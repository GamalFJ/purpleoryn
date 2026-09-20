import { CAL_URL, SITE } from "@/lib/site";
import type { Tier } from "@/lib/tiers";

// Cal.com booking link. When a plan was chosen it travels with the booking two
// ways: `metadata[plan]` (visible in the booking record and webhooks) and a
// prefilled note the visitor sees in the "additional notes" field. The agent
// adds its short qualification summary (never contact details) to that note.
export function calUrl(plan?: Pick<Tier, "slug" | "name"> | null, summary?: string): string {
  if (!plan && !summary) return CAL_URL;
  const params = new URLSearchParams();
  if (plan) params.set("metadata[plan]", plan.slug);
  const notes = [plan ? `Plan de interés: ${plan.name}` : "", summary ? `Resumen: ${summary}` : ""].filter(Boolean).join(". ");
  if (notes) params.set("notes", notes);
  return `${CAL_URL}?${params.toString()}`;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.phoneE164.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_GENERAL = "Hola Purple Cove Labs, quiero información sobre sus planes.";

// Tags which market a WhatsApp click came from before handing off to
// wa.me (app/api/go/whatsapp/route.ts). Every visitor-facing WhatsApp link
// should go through this, not whatsappUrl() directly, so the rare
// click-WhatsApp-without-filling-the-form case is still attributed to a
// market. `message` is optional -- omit it to use the route's own default
// (WHATSAPP_GENERAL) and avoid repeating the same literal everywhere.
export function whatsappRedirectUrl(marketId: string, message?: string): string {
  const params = new URLSearchParams({ market: marketId });
  if (message) params.set("text", message);
  return `/api/go/whatsapp?${params.toString()}`;
}

// Visitors type this field in whatever form is natural to them: a bare
// handle ("@negocio"), a handle with no @, or a full URL to any platform.
// A full URL is trusted as-is; anything else is treated as an Instagram
// handle, since that's what the field is for.
export function socialProfileUrl(input: string): string {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  return `https://instagram.com/${value.replace(/^@/, "")}`;
}
