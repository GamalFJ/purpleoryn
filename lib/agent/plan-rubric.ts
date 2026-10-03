import type { TierSlug } from "@/lib/tiers";
import type { Qualification } from "@/lib/agent/qualification";

// Which plan fits, decided in code from what the visitor said about their business reality
// (what they sell and how they want the agent to deal with THEIR customers). The model explains
// the choice; it does not make it. There is no default plan: with too little to go on the result
// is null and the agent asks the next question. The only fallback is the visitor who says they
// do not know what they want, which is Conversión.
//
// Keep the reasons consistent with the plan rows in the `tiers` table.
export interface PlanChoice {
  plan: TierSlug;
  reason: string;
}

export function choosePlan(known: Qualification): PlanChoice | null {
  const interaction = known.customer_interaction;
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
      // Taking orders or booking by itself is only in Autoridad's agent row; ask what they sell first
      // so the explanation can speak about their business.
      if (!known.business_model) return null;
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
