import type { SalesStage } from "@/lib/agent/flow";
import type { AgentAction } from "@/lib/agent/tools";
import { SALES_OFFER_PHRASE, SALES_OFFER_RE, type Capability, type TurnPlan } from "@/lib/agent/orchestrator";
import type { Qualification, QualificationKey } from "@/lib/agent/qualification";
import { buildRecommendationReply, recommendationNumbers, replyMatchesRecommendation } from "@/lib/agent/recommendation";
import { salesStatus } from "@/lib/agent/sales";
import type { ConversationState } from "@/lib/chat-state";
import type { Tier, TierSlug } from "@/lib/tiers";

// What the prompt asks for and the model sometimes skips, guaranteed in code. The model writes the
// reply and may call the tools; this checks the turn against what the stage requires and returns
// the tool calls that are missing (the route runs them through the same runTool, so every rule of
// the tools still applies) and a corrected reply where the facts in it cannot be left to chance.
//
//   sales, plan decided: recommend_plan and the figures card for the rubric's plan, and a reply that
//     names that plan with the exact prices and break-even (else the reply is written from the tier data);
//   sales, released: the PDF and the WhatsApp button;
//   booking, nothing left to ask: the call button;
//   handoff: the WhatsApp button and the call button;
//   "the team confirms it directly": the WhatsApp button, so the promise has a path;
//   receptionist offer: the reply ends with the exact offer question.
export interface EnforceInput {
  capability: Capability;
  plan: Pick<TurnPlan, "asks" | "stage" | "clarifiesSale" | "offerExpected">;
  baseState: ConversationState;
  // The intent came from a topic-less message ("Sí", "gracias"), not from the visitor's own request.
  inherited: boolean;
  // The sales stage stored before this turn.
  storedStage: SalesStage | undefined;
  known: Qualification;
  asked: readonly QualificationKey[];
  tiers: Tier[];
  message: string;
  reply: string;
  actions: readonly AgentAction[];
}

export interface PlannedCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface EnforceResult {
  reply: string;
  calls: PlannedCall[];
  // Figures cards for any other plan are dropped (the numbers must match the plan recommended).
  dropRoiOtherThan: TierSlug | null;
}

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const TEAM_CONFIRMS_RE = /\b(el|nuestro) equipo (lo |se lo |puede |podra |debe )*(confirm|verific|revis)/;

function withOffer(reply: string): string {
  const parts = reply.trim().split(/(?<=[.!?])\s+/);
  // Drop a trailing question the model asked instead of the offer.
  while (parts.length && parts[parts.length - 1].includes("?")) parts.pop();
  return [...parts, SALES_OFFER_PHRASE].join(" ").trim();
}

export function enforceTurn(input: EnforceInput): EnforceResult {
  const { capability, plan, known, tiers, message, actions } = input;
  const has = (type: AgentAction["type"]) => actions.some((a) => a.type === type);
  const calls: PlannedCall[] = [];
  const planned = (name: string) => calls.some((c) => c.name === name);
  let reply = input.reply;
  let dropRoiOtherThan: TierSlug | null = null;

  const discovery = plan.stage === undefined || plan.stage === "discovery";
  const status = salesStatus(known, input.asked);

  // Recommendation turn. Skipped when the visitor asked something (their question comes first).
  if (capability === "sales" && discovery && status.ready && status.plan && !plan.clarifiesSale && !message.includes("?")) {
    const tier = tiers.find((t) => t.slug === status.plan?.plan);
    if (tier) {
      const nums = recommendationNumbers(tier, known.average_sale);
      dropRoiOtherThan = tier.slug;
      if (!actions.some((a) => a.type === "recommend_plan" && a.plan === tier.slug)) {
        calls.push({ name: "recommend_plan", arguments: { plan: tier.slug, reason: "chosen from what the visitor said" } });
      }
      if (nums && known.average_sale && !actions.some((a) => a.type === "roi" && a.plan === tier.slug)) {
        calls.push({ name: "calculate_roi", arguments: { plan: tier.slug, average_sale_value: known.average_sale } });
      }
      if (!reply || !replyMatchesRecommendation(reply, tier, nums)) reply = buildRecommendationReply(tier, nums);
    }
  }

  // Only on the turn the conversation is released, not on every later turn.
  if (capability === "sales" && plan.stage === "released" && input.storedStage !== "released") {
    if (!has("show_page")) calls.push({ name: "show_page", arguments: { page: "pdf_oryn_presence" } });
    if (!has("handoff_whatsapp")) calls.push({ name: "handoff_whatsapp", arguments: { reason: "released" } });
  }

  if (capability === "booking" && input.baseState !== "booking_offered" && plan.asks === null && !has("offer_call")) {
    const summary = [known.business_type, known.goal, known.timing].filter(Boolean).join(", ").slice(0, 200);
    calls.push({ name: "offer_call", arguments: { summary } });
  }

  // Only when the visitor just asked for a person, not on a later "gracias".
  if (capability === "handoff" && !input.inherited) {
    if (!has("handoff_whatsapp")) calls.push({ name: "handoff_whatsapp", arguments: { reason: "asked_for_person" } });
    if (!has("offer_call")) calls.push({ name: "offer_call", arguments: { summary: "" } });
  }

  if ((capability === "receptionist" || capability === "sales") && TEAM_CONFIRMS_RE.test(fold(reply)) && !has("handoff_whatsapp") && !planned("handoff_whatsapp")) {
    calls.push({ name: "handoff_whatsapp", arguments: { reason: "unknown_fact" } });
  }

  if (plan.offerExpected && !SALES_OFFER_RE.test(fold(reply))) reply = withOffer(reply);

  return { reply, calls, dropRoiOtherThan };
}
