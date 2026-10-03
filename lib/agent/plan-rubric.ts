import type { TierSlug } from "@/lib/tiers";
import type { Qualification, QualificationKey } from "@/lib/agent/qualification";

// Which plan fits, decided in code from the visitor's business reality: what they sell and how they
// want the agent to deal with THEIR customers. The model explains the choice; it does not make it.
//
// There is no default plan. With too little to go on the result is null and the agent asks the next
// question. A visitor who does not know what they want (said so, or skipped the question once) is
// sent to Conversión, the balanced starting point.
//
// Keep the reasons consistent with the plan rows in the `tiers` table.
export interface PlanChoice {
  plan: TierSlug;
  reason: string;
}

export const PLAN_ORDER: readonly TierSlug[] = ["presencia", "conversion", "autoridad"];

// `asked` lists the questions already asked once; a skipped answer is not asked again.
export function choosePlan(known: Qualification, asked: readonly QualificationKey[] = []): PlanChoice | null {
  const interaction = known.customer_interaction ?? (asked.includes("customer_interaction") ? "unsure" : undefined);
  if (!interaction) return null;

  switch (interaction) {
    case "presence_only":
      // A launch or a start-up that needs to be found and to answer a few questions.
      return {
        plan: "presencia",
        reason: "They need a digital presence and an agent that answers questions and passes each customer on, organized: Presencia (one-page site, Google Business Profile, basic SEO and the Smart Qualifier).",
      };
    case "qualify_followup":
      return {
        plan: "conversion",
        reason: "They want each lead qualified and followed up while they close: Conversión (lead scoring, automatic follow-up at 24 hours, a simple pipeline and a multi-page site).",
      };
    case "agent_completes":
      // Taking orders or booking by itself is only in Autoridad's agent row. What they sell is asked first so the
      // explanation can speak about their business; a visitor who skipped that question is not held up.
      if (!known.business_model && !asked.includes("business_model")) return null;
      return {
        plan: "autoridad",
        reason: "They want the agent to book appointments or take orders by itself: Autoridad is the only plan whose agent does that (Google Calendar booking, orders and a lead panel).",
      };
    case "unsure":
      return {
        plan: "conversion",
        reason: "They do not know what they want yet: Conversión is the balanced starting point (site with service pages, lead follow-up and the monthly report).",
      };
  }
}

// One plan below, for a visitor whose objection is the price. Never above the rubric.
export function stepDownFrom(plan: TierSlug): TierSlug | null {
  const i = PLAN_ORDER.indexOf(plan);
  return i > 0 ? PLAN_ORDER[i - 1] : null;
}
