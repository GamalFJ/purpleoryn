import { computeRoi } from "@/lib/roi";
import type { Tier } from "@/lib/tiers";

// The recommendation turn verifies the recommended plan is named in the reply.
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

// The reply names the plan.
export function replyMatchesRecommendation(reply: string, tier: Tier, nums?: RecommendationNumbers | null): boolean {
  void nums;
  const text = fold(reply);
  return text.includes(fold(tier.name));
}

export function buildRecommendationReply(tier: Tier, nums?: RecommendationNumbers | null): string {
  void nums;
  return `Para su negocio le recomiendo el plan ${tier.name}: ${tier.tagline.replace(/^Para /, "para ").replace(/\.$/, "")}. En una asesoría de 20 minutos evaluamos los detalles específicos y confirmamos si su negocio califica para Oryn Presence. El botón de abajo le permite agendar su asesoría.`;
}
