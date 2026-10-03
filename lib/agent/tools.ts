import { formatRD } from "@/lib/format";
import { computeRoi } from "@/lib/roi";
import { TIER_CTA, isTierSlug, type Tier, type TierSlug } from "@/lib/tiers";
import type { ToolCall, ToolDefinition } from "@/lib/ai/types";
import type { AgentToolName } from "@/lib/agent/orchestrator";
import { AGENT_PAGES, AGENT_PAGE_KEYS, buildHandoffUrl, HANDOFF_REASONS, isAgentPage, isHandoffReason, type AgentPageKey, type HandoffReason } from "@/lib/agent/handoff";
import type { SalesStage } from "@/lib/agent/flow";
import { choosePlan, stepDownFrom } from "@/lib/agent/plan-rubric";
import { APPOINTMENTS_OR_ORDERS, BUSINESS_MODELS, CUSTOMER_INTERACTIONS, sanitizeQualification, type Qualification, type QualificationKey } from "@/lib/agent/qualification";

// No rubric result, no plan: until what the visitor wants from the agent is known (or was asked
// once and skipped), a recommendation is refused and the agent asks the next question instead.
const REQUIRE_RUBRIC = true;

// UI actions the chat widget renders under the assistant's reply.
export type AgentAction =
  | { type: "roi"; plan: TierSlug; planName: string; averageSaleValue: number; yearOneInvestment: number; breakEvenSales: number; targetSalesPerYear: number; targetSalesPerMonth: number }
  | { type: "recommend_plan"; plan: TierSlug; planName: string }
  | { type: "offer_call"; plan: TierSlug | null; planName: string | null; summary: string }
  | { type: "handoff_whatsapp"; reason: HandoffReason; url: string; summary: string }
  | { type: "show_page"; page: AgentPageKey; label: string; href: string; newTab: boolean };

// What a tool may need to know about the conversation; read from what is stored, never from the model.
export interface ToolContext {
  known: Qualification;
  // The plan already recommended in this conversation, if any.
  planName: string | null;
  // Questions already asked once (the rubric treats a skipped answer as "unsure").
  asked?: readonly QualificationKey[];
  // After a recommendation, a price objection may be answered with the plan one step down.
  stage?: SalesStage;
}

const PLAN_ENUM = { type: "string", enum: ["presencia", "conversion", "autoridad"] };

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: "calculate_roi",
    description:
      "Compute the Oryn ROI Method for a plan given the value of ONE typical sale (what a customer spends in one purchase or order) in Dominican pesos. Never pass a unit price, a volume or a daily/monthly total. Always use this instead of doing math.",
    parameters: {
      type: "object",
      properties: {
        plan: PLAN_ENUM,
        average_sale_value: { type: "number", description: "Value of ONE typical sale or order in RD$, greater than 0. Not a unit price, volume or total." },
      },
      required: ["plan", "average_sale_value"],
      additionalProperties: false,
    },
  },
  {
    name: "recommend_plan",
    description: "Recommend one plan once you are confident it fits. Shows the visitor a button: the plan order form with that plan preselected, or, for a plan that is sold by call, the free-call booking instead. Nothing is ordered or booked by this tool.",
    parameters: {
      type: "object",
      properties: {
        plan: PLAN_ENUM,
        reason: { type: "string", description: "One short sentence explaining the fit (internal, not shown)." },
      },
      required: ["plan", "reason"],
      additionalProperties: false,
    },
  },
  {
    name: "offer_call",
    description: "Offer the free 20-minute call via Cal.com after brief pre-qualification. Shows a button that opens Cal.com so the visitor picks their own time; it does not book anything.",
    parameters: {
      type: "object",
      properties: {
        plan: { ...PLAN_ENUM, description: "Plan discussed, if any." },
        summary: { type: "string", description: "Max 200 characters: business type, main goal, timing. No contact details." },
      },
      required: ["summary"],
      additionalProperties: false,
    },
  },
  {
    name: "handoff_whatsapp",
    description:
      "Show the visitor a WhatsApp button that opens a chat with the Purple Cove Labs team with a summary already written. Use it when the visitor asks for a person, when a fact is not in the prompt, when they decline the call, or when they have decided not to go ahead for now. The summary is built by the system; you only choose the reason. Nothing is sent and nobody is notified by this tool.",
    parameters: {
      type: "object",
      properties: { reason: { type: "string", enum: [...HANDOFF_REASONS] } },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "show_page",
    description: "Show the visitor a button to one page or document of the site (plans and prices, how we work, or the PDF documents). Use it when the full answer lives there. You only choose the page; the link comes from the system.",
    parameters: {
      type: "object",
      properties: { page: { type: "string", enum: [...AGENT_PAGE_KEYS] } },
      required: ["page"],
      additionalProperties: false,
    },
  },
  {
    name: "record_qualification",
    description:
      "Save facts the visitor has told you about their business so you don't ask again. Include only the fields the visitor actually gave you; leave out anything they did not state. Never infer, guess or default a value (no false or \"neither\" for a question they skipped), and never contact details (phone, email, links, handles). Nothing is shown to the visitor.",
    parameters: {
      type: "object",
      properties: {
        business_type: { type: "string", description: "Type of business, at most 80 characters." },
        has_website: { type: "boolean", description: "Whether they already have a website." },
        has_google_profile: { type: "boolean", description: "Whether they already have a Google Business Profile." },
        customer_channel: { type: "string", description: "How customers find them today, at most 80 characters." },
        appointments_or_orders: { type: "string", enum: [...APPOINTMENTS_OR_ORDERS], description: "Whether their customers book appointments, place orders, both or neither." },
        average_sale: { type: "number", description: "What a customer spends in one typical purchase or order in RD$, greater than 0 (not a unit price, volume or total)." },
        goal: { type: "string", description: "Their main goal, at most 120 characters." },
        timing: { type: "string", description: "How soon they want to start, at most 60 characters." },
        pain: { type: "string", description: "What is not working in their business today, in their own words, at most 120 characters." },
        business_model: { type: "string", enum: [...BUSINESS_MODELS], description: "Whether they sell products, services or both." },
        customer_interaction: {
          type: "string",
          enum: [...CUSTOMER_INTERACTIONS],
          description:
            "What they want the agent to do with THEIR customers: presence_only (be found online and have a few questions answered, typical of a launch or start-up), qualify_followup (qualify each lead and follow up while they close), agent_completes (the agent books the appointment or takes the order by itself) or unsure (they say they do not know). Only when their answer says so.",
        },
      },
      additionalProperties: false,
    },
  },
];

// The tools the orchestrator allows for this turn's capability.
export function toolsFor(allowed: readonly AgentToolName[]): ToolDefinition[] {
  return AGENT_TOOLS.filter((tool) => (allowed as readonly string[]).includes(tool.name));
}

export interface ToolResult {
  content: string;
  action?: AgentAction;
  // Whitelisted facts to merge into chat_sessions.qualification.
  qualification?: Qualification;
}

export function runTool(call: ToolCall, tiers: Tier[], context: ToolContext = { known: {}, planName: null }): ToolResult {
  const args = call.arguments;
  const tierFor = (slug: unknown) => (isTierSlug(slug) ? tiers.find((t) => t.slug === slug) : undefined);

  switch (call.name) {
    case "calculate_roi": {
      const tier = tierFor(args.plan);
      const asv = Number(args.average_sale_value);
      const roi = tier ? computeRoi({ oneTime: tier.oneTime, monthly: tier.monthly, averageSaleValue: asv }) : null;
      if (!tier || !roi) return { content: JSON.stringify({ error: "Plan o valor promedio de venta inválido." }) };
      const rounded = {
        breakEvenSales: Math.ceil(roi.breakEvenSales),
        targetSalesPerYear: Math.ceil(roi.targetSalesPerYear),
        targetSalesPerMonth: Math.ceil(roi.targetSalesPerMonth),
      };
      return {
        content: JSON.stringify({
          plan: tier.name,
          average_sale_value: formatRD(asv),
          year_one_investment: formatRD(roi.yearOneInvestment),
          break_even_sales: rounded.breakEvenSales,
          break_even_sales_per_month: Math.ceil(roi.breakEvenSales / 12),
          target_3x_sales_per_year: rounded.targetSalesPerYear,
          target_3x_sales_per_month: rounded.targetSalesPerMonth,
        }),
        action: { type: "roi", plan: tier.slug, planName: tier.name, averageSaleValue: asv, yearOneInvestment: roi.yearOneInvestment, ...rounded },
      };
    }
    case "recommend_plan": {
      const tier = tierFor(args.plan);
      if (!tier) return { content: JSON.stringify({ error: "Plan inválido." }) };
      // The plan is chosen in code from what the visitor said; the model explains it.
      const chosen = choosePlan(context.known, context.asked ?? []);
      const afterRecommendation = context.stage === "recommended" || context.stage === "objection_1" || context.stage === "objection_2";
      const stepDown = chosen && afterRecommendation && stepDownFrom(chosen.plan) === tier.slug;
      if (chosen && chosen.plan !== tier.slug && !stepDown) {
        return { content: JSON.stringify({ ok: false, error: `Not allowed. The plan chosen from what the visitor told you is ${chosen.plan}. Reason: ${chosen.reason}. Recommend that plan.` }) };
      }
      if (!chosen && REQUIRE_RUBRIC) {
        return { content: JSON.stringify({ ok: false, error: "Not enough is known yet to choose a plan. Ask the next question instead." }) };
      }
      const cta = TIER_CTA[tier.slug];
      const shown =
        cta.action === "call"
          ? `Botón "${cta.label}" que abre la agenda de la llamada gratis en Cal.com (este plan se conversa por llamada, no por formulario). Nada quedó agendado.`
          : `Botón "Elegir ${tier.name}" que abre el formulario`;
      return {
        content: JSON.stringify({ ok: true, shown_to_visitor: shown }),
        action: { type: "recommend_plan", plan: tier.slug, planName: tier.name },
      };
    }
    case "offer_call": {
      const tier = tierFor(args.plan) ?? null;
      const summary = String(args.summary ?? "").slice(0, 200);
      return {
        content: JSON.stringify({
          ok: true,
          shown_to_visitor: "Botón que abre Cal.com para que el visitante elija día y hora de la llamada gratis de 20 minutos",
          note: "Nada quedó agendado. El visitante todavía tiene que elegir el horario en Cal.com.",
        }),
        action: { type: "offer_call", plan: tier?.slug ?? null, planName: tier?.name ?? null, summary },
      };
    }
    case "handoff_whatsapp": {
      if (!isHandoffReason(args.reason)) return { content: JSON.stringify({ ok: false, error: "Invalid reason." }) };
      const { url, summary } = buildHandoffUrl(args.reason, context.known, context.planName);
      return {
        content: JSON.stringify({
          ok: true,
          shown_to_visitor: 'Botón "Escribir por WhatsApp" que abre el chat con el resumen ya escrito',
          note: "Nothing was sent and nobody was notified. The visitor still has to press send in WhatsApp. Never say the team was notified or will answer by a certain time.",
        }),
        action: { type: "handoff_whatsapp", reason: args.reason, url, summary },
      };
    }
    case "show_page": {
      if (!isAgentPage(args.page)) return { content: JSON.stringify({ ok: false, error: "Invalid page." }) };
      const page = AGENT_PAGES[args.page];
      return {
        content: JSON.stringify({ ok: true, shown_to_visitor: `Botón "${page.label}"` }),
        action: { type: "show_page", page: args.page, label: page.label, href: page.href, newTab: page.newTab },
      };
    }
    case "record_qualification": {
      const qualification = sanitizeQualification(args);
      const saved = Object.keys(qualification);
      if (!saved.length) return { content: JSON.stringify({ ok: false, error: "No había nada válido para guardar." }) };
      return { content: JSON.stringify({ ok: true, saved }), qualification };
    }
    default:
      return { content: JSON.stringify({ error: `Unknown tool ${call.name}` }) };
  }
}
