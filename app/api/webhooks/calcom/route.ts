import { NextResponse, type NextRequest } from "next/server";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { serviceClient } from "@/lib/supabase/service";
import {
  notifyBookingCancelled,
  notifyBookingCreated,
  notifyBookingRescheduled,
  notifyIntegrationError,
} from "@/lib/telegram";
import { normalizeEmail, normalizePhone } from "@/lib/lead-validation";
import { verifyCalWebhookSignature, type CalWebhookBody } from "@/lib/calcom";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;

  // 1. Read raw request text for signature verification
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-cal-signature-256");

  // 2. Reject invalid or missing signature
  const isValid = verifyCalWebhookSignature(rawBody, signatureHeader, secret);
  if (!isValid) {
    console.warn("[calcom-webhook] Rejected request: missing or invalid signature header");
    return NextResponse.json({ error: "Invalid or missing signature" }, { status: 401 });
  }

  // 3. Parse JSON payload
  let body: CalWebhookBody;
  try {
    body = JSON.parse(rawBody) as CalWebhookBody;
  } catch {
    console.error("[calcom-webhook] Failed to parse request JSON");
    return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
  }

  const triggerEvent = String(body.triggerEvent || body.event || body.type || "").toUpperCase();
  const payload = body.payload || {};

  const rawBookingId = payload.uid || payload.id || payload.bookingId;
  if (!rawBookingId) {
    return NextResponse.json({ error: "Missing booking ID in payload" }, { status: 400 });
  }
  const externalBookingId = String(rawBookingId);

  // Normalize event fields
  const eventTitle = payload.title || payload.eventTitle || payload.type || "Lead Response Consultation Demo";
  const eventType = payload.type || (payload.eventTypeId ? String(payload.eventTypeId) : "consultation");

  const attendee = payload.attendees?.[0] || {};
  const respName = typeof payload.responses?.name === "object" ? payload.responses.name.value : payload.responses?.name;
  const rawName = attendee.name || respName || "Cal.com Attendee";

  const respEmail = typeof payload.responses?.email === "object" ? payload.responses.email.value : payload.responses?.email;
  const rawEmail = attendee.email || respEmail || "";

  const respPhone = typeof payload.responses?.phone === "object" ? payload.responses.phone.value : payload.responses?.phone;
  const rawPhone = attendee.phoneNumber || attendee.phone || respPhone || null;

  if (!rawEmail) {
    return NextResponse.json({ error: "Missing attendee email in payload" }, { status: 400 });
  }

  const attendeeName = String(rawName).trim();
  const attendeeEmail = normalizeEmail(String(rawEmail));
  const attendeePhone = rawPhone ? normalizePhone(String(rawPhone)) : null;
  const attendeeTimeZone = attendee.timeZone || payload.timeZone || "America/Chicago";

  const startTime = payload.startTime || payload.start || new Date().toISOString();
  const endTime = payload.endTime || payload.end || new Date(Date.now() + 20 * 60 * 1000).toISOString();
  const bookingSource = (payload.metadata?.source as string) || "US_WEBSITE";
  const respNotes = typeof payload.responses?.notes === "object" ? payload.responses.notes.value : payload.responses?.notes;
  const notes = payload.description || respNotes || null;

  // Extract business/company name and website from responses if present
  const getResponseValue = (keys: string[]): string | null => {
    if (!payload.responses || typeof payload.responses !== "object") return null;
    const resp = payload.responses as Record<string, unknown>;
    for (const key of keys) {
      for (const [k, v] of Object.entries(resp)) {
        if (k.toLowerCase() === key.toLowerCase() || k.toLowerCase().includes(key.toLowerCase())) {
          if (v !== undefined && v !== null) {
            if (typeof v === "object" && "value" in (v as Record<string, unknown>)) {
              const innerVal = String((v as Record<string, unknown>).value).trim();
              if (innerVal) return innerVal;
            }
            if (typeof v === "string" && v.trim()) return v.trim();
          }
        }
      }
    }
    return null;
  };

  const payloadBusiness = getResponseValue(["business", "company", "businessname", "companyname", "business_name", "company_name"]);
  const payloadWebsite = getResponseValue(["website", "companywebsite", "company_website", "site", "url"]);

  if (!isServiceRoleConfigured()) {
    console.error("[calcom-webhook] Database not configured for service role operations");
    return NextResponse.json({ error: "Database configuration error" }, { status: 500 });
  }

  const supabase = serviceClient();

  try {
    // 4. Idempotency Check: look up existing booking
    const { data: existingBooking, error: fetchBookingErr } = await supabase
      .from("market_bookings")
      .select("id, external_booking_id, lead_id, booking_status, telegram_notified")
      .eq("external_booking_id", externalBookingId)
      .maybeSingle();

    if (fetchBookingErr) {
      console.error("[calcom-webhook] Error querying market_bookings:", fetchBookingErr.message);
      throw new Error(`Database error querying booking: ${fetchBookingErr.message}`);
    }

    // ─── CASE A: BOOKING_CREATED ─────────────────────────────────────────────
    if (triggerEvent === "BOOKING_CREATED") {
      if (existingBooking) {
        // Redelivery / duplicate event: acknowledge safely without sending duplicate alert
        return NextResponse.json({
          received: true,
          status: "already_processed",
          duplicate: true,
          bookingId: externalBookingId,
        });
      }

      // Check if lead already exists by email (reasonable identity match without false company merges)
      const { data: existingLead, error: leadLookupErr } = await supabase
        .from("market_leads")
        .select("id, phone, name, business_name, website")
        .eq("email", attendeeEmail)
        .maybeSingle();

      if (leadLookupErr) {
        console.warn("[calcom-webhook] Error looking up lead:", leadLookupErr.message);
      }

      const businessName = payloadBusiness || existingLead?.business_name || null;
      const website = payloadWebsite || existingLead?.website || null;

      let leadId: string | null = null;

      if (existingLead) {
        leadId = existingLead.id;
        // Update activity timestamp & update phone / business / website if missing
        await supabase
          .from("market_leads")
          .update({
            last_activity_at: new Date().toISOString(),
            ...(attendeePhone && !existingLead.phone ? { phone: attendeePhone } : {}),
            ...(businessName && !existingLead.business_name ? { business_name: businessName } : {}),
            ...(website && !existingLead.website ? { website } : {}),
          })
          .eq("id", existingLead.id);
      } else {
        // Create new prospect
        const { data: newLead, error: newLeadErr } = await supabase
          .from("market_leads")
          .insert({
            market_id: "us",
            name: attendeeName,
            business_name: businessName,
            website: website,
            email: attendeeEmail,
            phone: attendeePhone,
            source: bookingSource,
            channel: "calcom",
            status: "new",
            tier_interest: eventTitle,
            service_category: "Consultation Demo",
            message: `Booked via Cal.com: ${eventTitle} (${new Date(startTime).toLocaleString("en-US", { timeZone: attendeeTimeZone })})`,
            notes: notes || null,
            last_activity_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (newLeadErr) {
          console.error("[calcom-webhook] Failed to create lead for booking:", newLeadErr.message);
        } else {
          leadId = newLead?.id ?? null;
        }
      }

      // 1. Send Telegram notification immediately so the alert is NEVER blocked by DB delays
      const tgResult = await notifyBookingCreated({
        bookingId: externalBookingId,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        attendeeTimeZone,
        eventTitle,
        startTime,
        endTime,
        businessName,
        website,
        source: "Cal.com",
        notes,
      });

      // 2. Insert new booking record (resilient against database migration timing)
      try {
        const { error: insertBookingErr } = await supabase.from("market_bookings").insert({
          external_booking_id: externalBookingId,
          lead_id: leadId,
          market_id: "us",
          event_title: eventTitle,
          event_type: eventType,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          attendee_phone: attendeePhone,
          attendee_time_zone: attendeeTimeZone,
          booking_start: new Date(startTime).toISOString(),
          booking_end: new Date(endTime).toISOString(),
          booking_status: "created",
          booking_source: bookingSource,
          notes: notes || null,
          telegram_notified: tgResult.success,
          telegram_error: tgResult.error || null,
          raw_payload: payload,
        });

        if (insertBookingErr) {
          console.error("[calcom-webhook] Failed to insert booking in database:", insertBookingErr.message);
        }
      } catch (dbErr) {
        console.error("[calcom-webhook] DB exception during booking insert:", dbErr);
      }

      return NextResponse.json({
        received: true,
        status: "created",
        bookingId: externalBookingId,
      });
    }

    // ─── CASE B: BOOKING_RESCHEDULED ─────────────────────────────────────────
    if (triggerEvent === "BOOKING_RESCHEDULED") {
      if (existingBooking) {
        await supabase
          .from("market_bookings")
          .update({
            booking_start: new Date(startTime).toISOString(),
            booking_end: new Date(endTime).toISOString(),
            booking_status: "rescheduled",
            attendee_time_zone: attendeeTimeZone,
            raw_payload: payload,
            updated_at: new Date().toISOString(),
          })
          .eq("external_booking_id", externalBookingId);

        if (existingBooking.lead_id) {
          await supabase
            .from("market_leads")
            .update({ last_activity_at: new Date().toISOString() })
            .eq("id", existingBooking.lead_id);
        }
      } else {
        // If not already in DB, create as rescheduled
        await supabase.from("market_bookings").insert({
          external_booking_id: externalBookingId,
          market_id: "us",
          event_title: eventTitle,
          event_type: eventType,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          attendee_phone: attendeePhone,
          attendee_time_zone: attendeeTimeZone,
          booking_start: new Date(startTime).toISOString(),
          booking_end: new Date(endTime).toISOString(),
          booking_status: "rescheduled",
          booking_source: bookingSource,
          notes: notes || null,
          raw_payload: payload,
        });
      }

      await notifyBookingRescheduled({
        bookingId: externalBookingId,
        attendeeName,
        attendeeEmail,
        businessName: payloadBusiness || null,
        website: payloadWebsite || null,
        eventTitle,
        startTime,
        attendeeTimeZone,
        source: "Cal.com",
      });

      return NextResponse.json({
        received: true,
        status: "rescheduled",
        bookingId: externalBookingId,
      });
    }

    // ─── CASE C: BOOKING_CANCELLED ───────────────────────────────────────────
    if (triggerEvent === "BOOKING_CANCELLED") {
      if (existingBooking) {
        await supabase
          .from("market_bookings")
          .update({
            booking_status: "cancelled",
            raw_payload: payload,
            updated_at: new Date().toISOString(),
          })
          .eq("external_booking_id", externalBookingId);

        if (existingBooking.lead_id) {
          await supabase
            .from("market_leads")
            .update({ last_activity_at: new Date().toISOString() })
            .eq("id", existingBooking.lead_id);
        }
      } else {
        await supabase.from("market_bookings").insert({
          external_booking_id: externalBookingId,
          market_id: "us",
          event_title: eventTitle,
          event_type: eventType,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          attendee_phone: attendeePhone,
          attendee_time_zone: attendeeTimeZone,
          booking_start: new Date(startTime).toISOString(),
          booking_end: new Date(endTime).toISOString(),
          booking_status: "cancelled",
          booking_source: bookingSource,
          notes: notes || null,
          raw_payload: payload,
        });
      }

      await notifyBookingCancelled({
        bookingId: externalBookingId,
        attendeeName,
        attendeeEmail,
        businessName: payloadBusiness || null,
        website: payloadWebsite || null,
        eventTitle,
        startTime,
        attendeeTimeZone,
        source: "Cal.com",
      });

      return NextResponse.json({
        received: true,
        status: "cancelled",
        bookingId: externalBookingId,
      });
    }

    // Unhandled event
    return NextResponse.json({
      received: true,
      status: "ignored",
      message: `Event '${triggerEvent}' is not processed`,
    });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.error("[calcom-webhook] Unhandled processing error:", errMessage);

    // Notify Telegram about critical webhook integration failure
    try {
      await notifyIntegrationError("Cal.com Webhook", errMessage);
    } catch {
      // Ignore notification error
    }

    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
