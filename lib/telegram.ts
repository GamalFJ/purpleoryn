import type { AddonSnapshot } from "@/lib/addons";
import { formatRD } from "@/lib/format";
import { socialProfileUrl } from "@/lib/links";
import type { OrderTotals } from "@/lib/orders";
import { SITE } from "@/lib/site";

// New-lead alert, same channel and env vars as Oryn Drop. Notifications are
// simply off until both variables are set. Never throws: the lead is already
// saved in Supabase, which is the record of truth.
export interface LeadAlert {
  planName: string | null;
  addons: AddonSnapshot[];
  totals: OrderTotals;
  name: string;
  business: string;
  businessNiche: string;
  socialHandle: string | null;
  whatsapp: string;
  email: string | null;
  message: string | null;
  averageSaleValue: number | null;
  utmSource: string | null;
  landingPage: string | null;
}

// Oryn chat alert: a visitor was sent to WhatsApp or shown the call button. Same channel and
// env vars, same rule: off when unset, never throws. The caller sends each kind once per chat.
export async function notifyChatEvent(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 1500), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[chat] Telegram alert failed:", res.status);
  } catch (err) {
    console.error("[chat] Telegram alert failed:", err instanceof Error ? err.message : err);
  }
}

export async function notifyNewLead(lead: LeadAlert): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    "Nuevo prospecto en purpleoryn.com",
    "",
    `Plan: ${lead.planName ?? "Sin plan"}`,
    lead.addons.length
      ? `Módulos (100% por adelantado): ${lead.addons.map((a) => `${a.name} (${formatRD(a.oneTime)} + ${formatRD(a.monthly)}/mes)`).join(", ")}`
      : null,
    `Total pedido (pago inicial): ${formatRD(lead.totals.oneTime)}`,
    `Total mensualidad: ${formatRD(lead.totals.monthly)}`,
    `Nombre: ${lead.name}`,
    `Negocio: ${lead.business}`,
    `Rubro: ${lead.businessNiche}`,
    lead.socialHandle ? `Red social: ${lead.socialHandle} (${socialProfileUrl(lead.socialHandle)})` : null,
    `WhatsApp: ${lead.whatsapp} (https://wa.me/${lead.whatsapp.replace("+", "")})`,
    lead.email ? `Correo: ${lead.email}` : null,
    lead.averageSaleValue ? `Venta promedio: ${formatRD(lead.averageSaleValue)}` : null,
    lead.message ? `Mensaje: ${lead.message.slice(0, 500)}` : null,
    `Origen: ${lead.utmSource || "directo"}${lead.landingPage ? `, entró por ${lead.landingPage}` : ""}`,
    "",
    `${SITE.url}/admin/prospectos?estado=nuevo`,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Plain text (no parse_mode) so visitor input never breaks formatting.
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[lead] Telegram alert failed:", res.status);
  } catch (err) {
    console.error("[lead] Telegram alert failed:", err instanceof Error ? err.message : err);
  }
}


export interface MarketOrderAlert {
  marketId: string;
  host: string;
  planName: string;
  withVoiceAddon: boolean;
  currency: string;
  oneTimeTotal: number;
  monthlyTotal: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  preferredContact: string;
  notes?: string | null;
  averageSaleValue?: number | null;
  utmSource?: string | null;
}

export async function notifyMarketOrder(alert: MarketOrderAlert): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    `Nuevo pedido en ${alert.host} (${alert.marketId.toUpperCase()})`,
    "",
    `Plan: ${alert.planName}`,
    `Modulo de Voz: ${alert.withVoiceAddon ? "Si (300 min/mes)" : "No"}`,
    `Inversion inicial (50% plan + 100% voz): ${alert.currency} ${alert.oneTimeTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `Abono mensual: ${alert.currency} ${alert.monthlyTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mes`,
    "",
    `Negocio: ${alert.businessName}`,
    `Contacto: ${alert.contactName}`,
    `Telefono: ${alert.phone}`,
    `Correo: ${alert.email}`,
    `Canal preferido: ${alert.preferredContact}`,
    alert.notes ? `Notas: ${alert.notes.slice(0, 500)}` : null,
    alert.averageSaleValue ? `Venta promedio: ${alert.currency} ${alert.averageSaleValue}` : null,
    alert.utmSource ? `Origen: ${alert.utmSource}` : null,
    "",
    "Cupo reservado por 7 dias calendario.",
    `Ver pedidos: https://purpleoryn.com/admin/market-orders`,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[market-order] Telegram alert failed:", res.status);
  } catch (err) {
    console.error("[market-order] Telegram alert failed:", err instanceof Error ? err.message : err);
  }
}

// ─── U.S. Lead & Cal.com Integrations ──────────────────────────────────────────

export interface UsWebsiteLeadAlert {
  contactName: string;
  businessName: string;
  phone: string;
  email: string;
  trade?: string;
  plan: string;
  withVoiceAddon: boolean;
  notes?: string;
  source?: string;
}

export interface BookingAlert {
  bookingId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string | null;
  attendeeTimeZone?: string;
  eventTitle: string;
  startTime: string;
  endTime?: string;
  businessName?: string | null;
  website?: string | null;
  source?: string;
  notes?: string | null;
}

export async function sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { success: false, error: "Telegram credentials not configured" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[telegram] alert failed:", res.status, errText);
      return { success: false, error: `Telegram HTTP ${res.status}: ${errText}` };
    }
    return { success: true };
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.error("[telegram] alert exception:", errMessage);
    return { success: false, error: errMessage };
  }
}

export async function notifyUsWebsiteLead(alert: UsWebsiteLeadAlert): Promise<{ success: boolean; error?: string }> {
  const lines = [
    "🇺🇸 New U.S. Website Lead",
    "",
    `Name: ${alert.contactName}`,
    `Company: ${alert.businessName}`,
    alert.trade ? `Trade: ${alert.trade}` : null,
    `Package: ${alert.plan.toUpperCase()}${alert.withVoiceAddon ? " + Voice Receptionist" : ""}`,
    `Phone: ${alert.phone}`,
    `Email: ${alert.email}`,
    alert.notes ? `Notes: ${alert.notes.slice(0, 500)}` : null,
    `Source: ${alert.source || "US_WEBSITE"}`,
    "",
    "Admin: https://purpleoryn.com/admin/market-leads",
  ].filter((l): l is string => l !== null);

  return sendTelegramMessage(lines.join("\n"));
}

export async function notifyBookingCreated(alert: BookingAlert): Promise<{ success: boolean; error?: string }> {
  let formattedDate = alert.startTime;
  try {
    const d = new Date(alert.startTime);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: alert.attendeeTimeZone || "America/Chicago",
      });
    }
  } catch {
    // fallback to alert.startTime
  }

  const lines = [
    "🟣 PURPLE ORYN — NEW DEMO BOOKING",
    "",
    `Name: ${alert.attendeeName}`,
    `Business: ${alert.businessName || "Not specified"}`,
    `Website: ${alert.website || "None"}`,
    `Event: ${alert.eventTitle}`,
    `Date: ${formattedDate}`,
    `Source: ${alert.source || "Cal.com"}`,
  ];

  if (alert.attendeeEmail) {
    lines.push(`Email: ${alert.attendeeEmail}`);
  }
  if (alert.attendeePhone) {
    lines.push(`Phone: ${alert.attendeePhone}`);
  }
  if (alert.notes) {
    lines.push(`Notes: ${alert.notes.slice(0, 300)}`);
  }

  lines.push("");
  lines.push("Admin: https://purpleoryn.com/admin/market-leads?tab=bookings");

  return sendTelegramMessage(lines.join("\n"));
}

export async function notifyBookingRescheduled(alert: BookingAlert): Promise<{ success: boolean; error?: string }> {
  let formattedDate = alert.startTime;
  try {
    const d = new Date(alert.startTime);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: alert.attendeeTimeZone || "America/Chicago",
      });
    }
  } catch {
    // fallback
  }

  const lines = [
    "🔄 PURPLE ORYN — BOOKING RESCHEDULED",
    "",
    `Name: ${alert.attendeeName}`,
    `Business: ${alert.businessName || "Not specified"}`,
    `Website: ${alert.website || "None"}`,
    `Event: ${alert.eventTitle}`,
    `New Date: ${formattedDate}`,
    `Source: ${alert.source || "Cal.com"}`,
  ];

  if (alert.attendeeEmail) {
    lines.push(`Email: ${alert.attendeeEmail}`);
  }

  lines.push("");
  lines.push("Admin: https://purpleoryn.com/admin/market-leads?tab=bookings");

  return sendTelegramMessage(lines.join("\n"));
}

export async function notifyBookingCancelled(alert: BookingAlert): Promise<{ success: boolean; error?: string }> {
  let formattedDate = alert.startTime;
  try {
    const d = new Date(alert.startTime);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: alert.attendeeTimeZone || "America/Chicago",
      });
    }
  } catch {
    // fallback
  }

  const lines = [
    "❌ PURPLE ORYN — BOOKING CANCELLED",
    "",
    `Name: ${alert.attendeeName}`,
    `Business: ${alert.businessName || "Not specified"}`,
    `Website: ${alert.website || "None"}`,
    `Event: ${alert.eventTitle}`,
    `Cancelled Slot: ${formattedDate}`,
    `Source: ${alert.source || "Cal.com"}`,
  ];

  if (alert.attendeeEmail) {
    lines.push(`Email: ${alert.attendeeEmail}`);
  }

  lines.push("");
  lines.push("Admin: https://purpleoryn.com/admin/market-leads?tab=bookings");

  return sendTelegramMessage(lines.join("\n"));
}

export async function notifyIntegrationError(context: string, error: string): Promise<{ success: boolean; error?: string }> {
  const lines = [
    `⚠️ Integration Error [${context}]`,
    "",
    `Error: ${error.slice(0, 500)}`,
    `Time: ${new Date().toISOString()}`,
  ];

  return sendTelegramMessage(lines.join("\n"));
}

