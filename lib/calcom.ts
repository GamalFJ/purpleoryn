import crypto from "crypto";

export interface CalAttendee {
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  timeZone?: string;
}

export interface CalWebhookBody {
  triggerEvent?: string;
  event?: string;
  type?: string;
  payload?: {
    uid?: string;
    id?: number | string;
    bookingId?: string | number;
    title?: string;
    eventTitle?: string;
    type?: string;
    eventTypeId?: number | string;
    startTime?: string;
    start?: string;
    endTime?: string;
    end?: string;
    timeZone?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    attendees?: CalAttendee[];
    responses?: {
      name?: { value?: string } | string;
      email?: { value?: string } | string;
      phone?: { value?: string } | string;
      notes?: { value?: string } | string;
      business?: { value?: string } | string;
      company?: { value?: string } | string;
      website?: { value?: string } | string;
      [key: string]: unknown;
    };
  };
}

/**
 * Validates the Cal.com X-Cal-Signature-256 header using timingSafeEqual.
 * Never trust unsigned payload in production.
 */
export function verifyCalWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  try {
    const computedHmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const provided = signatureHeader.trim().toLowerCase();

    const expectedBuf = Buffer.from(computedHmac, "utf8");
    const providedBuf = Buffer.from(provided, "utf8");

    if (expectedBuf.length !== providedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch (err) {
    console.error("[calcom-webhook] Signature verification exception:", err);
    return false;
  }
}
