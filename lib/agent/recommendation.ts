import { formatRD } from "@/lib/format";
import { computeRoi } from "@/lib/roi";
import { TIER_CTA, type Tier } from "@/lib/tiers";

// The recommendation turn is the one that must never be wrong: the plan, the prices and the
// break-even have to be right and in the reply. The model writes the reply; code checks it and, if it
// is missing the plan or the exact figures, writes the reply itself from the tier data.
export interface RecommendationNumbers {
  breakEven: number;
  perMonth: number;
}

export function recommendationNumbers(tier: Tier, averageSale: number | undefined): RecommendationNumbers | null {
  if (!averageSale) return null;
  const roi = computeRoi({ oneTime: tier.oneTime, monthly: tier.monthly, averageSaleValue: averageSale });
  if (!roi) return null;
  const breakEven = Math.ceil(roi.breakEvenSales);
  return { breakEven, perMonth: Math.ceil(roi.breakEvenSales / 12) };
}

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// The reply names the plan, quotes both prices exactly and (when the sale value is known) the break-even.
export function replyMatchesRecommendation(reply: string, tier: Tier, nums: RecommendationNumbers | null): boolean {
  const text = fold(reply);
  if (!text.includes(fold(tier.name))) return false;
  if (!reply.includes(formatRD(tier.oneTime)) || !reply.includes(formatRD(tier.monthly))) return false;
  if (nums && !new RegExp(`(^|\\D)${nums.breakEven}(\\D|$)`).test(reply)) return false;
  return true;
}

export function buildRecommendationReply(tier: Tier, nums: RecommendationNumbers | null): string {
  const button = TIER_CTA[tier.slug].action === "call" ? "El botón de abajo abre la llamada gratis para verlo con detalle." : "El botón de abajo lleva al formulario para elegirlo.";
  const numbers = nums
    ? `Para recuperar la inversión del primer año necesita ${nums.breakEven} ${nums.breakEven === 1 ? "venta" : "ventas"}, unas ${nums.perMonth} al mes.`
    : "Los números de retorno los vemos con lo que gasta un cliente en una compra típica.";
  return `Para su negocio le recomiendo el plan ${tier.name}: ${tier.tagline.replace(/^Para /, "para ").replace(/\.$/, "")}. Son ${formatRD(tier.oneTime)} de pago único y ${formatRD(tier.monthly)} al mes. ${numbers} ${button}`;
}
