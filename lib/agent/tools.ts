import { formatRD } from "@/lib/format";
import { computeRoi } from "@/lib/roi";
import { TIER_CTA, isTierSlug, type Tier, type TierSlug } from "@/lib/tiers";
import type { ToolCall, ToolDefinition } from "@/lib/ai/types";
import type { AgentToolName } from "@/lib/agent/orchestrator";
import { APPOINTMENTS_OR_ORDERS, sanitizeQualification, type Qualification } from "@/lib/agent/qualification";

// UI actions the chat widget renders under the assistant's reply.
export type AgentAction =
  | { type: "roi"; plan: TierSlug; planName: string; averageSaleValue: number; yearOneInvestment: number; breakEvenSales: number; targetSalesPerYear: number; targetSalesPerMonth: number }
  | { type: "recommend_plan"; plan: TierSlug; planName: string }
  | { type: "offer_call"; plan: TierSlug | null; planName: string | null; summary: string };

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
    name: "record_qualification",
    description:
      "Save facts the visitor has told you about their business so you don't ask again. Include only the fields the visitor actually gave you; never contact details (phone, email, links, handles). Nothing is shown to the visitor.",
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

export function runTool(call: ToolCall, tiers: Tier[]): ToolResult {
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
          target_3x_sales_per_year: rounded.targetSalesPerYear,
          target_3x_sales_per_month: rounded.targetSalesPerMonth,
        }),
        action: { type: "roi", plan: tier.slug, planName: tier.name, averageSaleValue: asv, yearOneInvestment: roi.yearOneInvestment, ...rounded },
      };
    }
    case "recommend_plan": {
      const tier = tierFor(args.plan);
      if (!tier) return { content: JSON.stringify({ error: "Plan inválido." }) };
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
