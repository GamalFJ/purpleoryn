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
