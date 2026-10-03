import { looksLikeUnitOrVolume } from "@/lib/agent/answers";
import type { Flow } from "@/lib/agent/flow";
import { choosePlan, type PlanChoice } from "@/lib/agent/plan-rubric";
import { isKnown, nextMissing, SALES_QUALIFICATION_ORDER, type Qualification, type QualificationKey } from "@/lib/agent/qualification";

// Where the sales conversation stands, from what is saved and what was already asked.
//   plan  - the plan the rubric chose, or null while it cannot decide
//   ask   - the next question (unknown and never asked), or null
//   ready - the rubric has decided AND the business type and the value of one sale are settled
//           (known, or asked once and skipped). The ROI figure is wanted, not required: a visitor
//           who skips it still gets the plan.
export interface SalesStatus {
  ask: QualificationKey | null;
  plan: PlanChoice | null;
  ready: boolean;
}

const settled = (known: Qualification, asked: readonly QualificationKey[], key: QualificationKey) => isKnown(known, key) || asked.includes(key);

export function salesStatus(known: Qualification, asked: readonly QualificationKey[]): SalesStatus {
  const plan = choosePlan(known, asked);
  if (!plan) return { ask: nextMissing(known, SALES_QUALIFICATION_ORDER, asked), plan: null, ready: false };
  // The plan is decided; only what the recommendation needs is still open.
  if (!settled(known, asked, "business_type")) return { ask: "business_type", plan, ready: false };
  if (!settled(known, asked, "average_sale")) return { ask: "average_sale", plan, ready: false };
  return { ask: null, plan, ready: true };
}

// The visitor answered the question about the value of ONE sale with a unit price, a volume or a
// recurring total. That is not what the ROI method needs: ask ONE clarifying question, once, and
// do not compute anything from it.
export function isSaleClarifying(flow: Flow, known: Qualification, message: string): boolean {
  const lastAsked = (flow.asked ?? []).at(-1);
  return lastAsked === "average_sale" && !isKnown(known, "average_sale") && !flow.sale_clarified && looksLikeUnitOrVolume(message);
}
