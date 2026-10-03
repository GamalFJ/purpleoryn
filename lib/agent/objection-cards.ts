import { formatRD } from "@/lib/format";
import type { Objection } from "@/lib/agent/objections";
import { stepDownFrom } from "@/lib/agent/plan-rubric";
import type { Tier, TierSlug } from "@/lib/tiers";

// One card is injected into the prompt, and only when the visitor's message matched that objection.
// Shape of every objection reply: (1) name the concern in the visitor's own words, one short
// sentence, never starting with "pero"; (2) one reframe that uses only plan facts and tool numbers;
// (3) exactly one next step: one question OR one button. No discount, no negotiation, no invented
// result, no urgency. The reference lines are guides, not a script; stay in "usted".
export interface CardContext {
  recommendedPlan: TierSlug | null;
  tiers: Tier[];
}

const SHAPE =
  "Shape of the reply: one short sentence naming their concern in their own words (never start with 'pero'); one reframe using only plan facts and tool numbers; then exactly ONE next step, a question or a button, never both. No discount, no negotiation, no invented results, no urgency.";

function priceCard(ctx: CardContext): string {
  const plan = ctx.tiers.find((t) => t.slug === ctx.recommendedPlan);
  const lowerSlug = ctx.recommendedPlan ? stepDownFrom(ctx.recommendedPlan) : null;
  const lower = ctx.tiers.find((t) => t.slug === lowerSlug);
  const reframe = plan
    ? `Call calculate_roi for ${plan.name} and restate the cost as sales: break-even sales for the year and per month (break_even_sales_per_month), using their own sale value.`
    : "If the value of one sale is known, call calculate_roi and restate the cost as sales.";
  const stepDown = lower
    ? `Then offer ONE step down, saying what it lacks compared with the recommended plan according to the plan rows: ${lower.name}, ${formatRD(lower.oneTime)} one-time and ${formatRD(lower.monthly)} per month. If they pick it, call recommend_plan for ${lower.name}.`
    : "There is no cheaper plan to offer; do not invent one. Explain what the monthly fee covers using only the plan rows.";
  return [
    "OBJECTION: PRICE (they say it is expensive or outside their budget).",
    reframe,
    stepDown,
    "Prices are fixed and the same for everyone; never discount. If asked, say so in one sentence.",
    "Next step: ask which of the two ways suits them better now.",
    SHAPE,
    "Reference: «Entiendo, es una inversión seria para un negocio. Visto en ventas son X en todo el año, unas Y al mes. Si prefiere empezar más liviano, {plan} cuesta ... pero ahí {lo que no incluye}. ¿Cuál de las dos formas le sirve más ahora?»",
  ].join("\n");
}

const STATIC_CARDS: Record<Exclude<Objection, "price">, string> = {
  think: [
    "OBJECTION: THEY WANT TO THINK IT OVER.",
    "Respect it. Next step: one calibrated question about what they would need to see to decide with peace of mind (what would help them decide?). Do not repeat the pitch.",
    SHAPE,
    "Reference: «Claro, es una decisión que merece pensarse. ¿Qué le haría falta ver para decidir con tranquilidad?»",
  ].join("\n"),
  partner: [
    "OBJECTION: THEY NEED ANOTHER PERSON, OR HAVE ANOTHER QUOTE.",
    "If another person decides: agree that deciding together makes sense and call offer_call: the free 20-minute call is a good way to settle the doubts. Do not promise who can attend.",
    "If they have another quote: do not criticize it; invite them to compare what each includes (site, Google visibility, the agent, one fixed price) and ask what the other proposal includes. No next-step button in that case.",
    SHAPE,
    "Reference: «Tiene sentido decidirlo en conjunto. La llamada gratis de 20 minutos sirve para resolver las dudas.»",
  ].join("\n"),
  not_now: [
    "OBJECTION: NOT NOW. The conversation is closing.",
    "Accept it in one sentence, name what they told you is not working (their own words) once, without pressure or urgency. Call show_page with pdf_oryn_presence and handoff_whatsapp with reason released; say both buttons are below. Ask nothing.",
    SHAPE,
  ].join("\n"),
  decline: [
    "THE VISITOR SAID NO. The conversation is closing.",
    "Accept it in one sentence and thank them. Call show_page with pdf_oryn_presence and handoff_whatsapp with reason released; say both buttons are below. Ask nothing and make no new argument.",
  ].join("\n"),
};

export function objectionCard(type: Objection, ctx: CardContext): string {
  return type === "price" ? priceCard(ctx) : STATIC_CARDS[type];
}
