export const CONVERSATION_STATES = [
  "new",
  "inquiry",
  "service_inquiry",
  "sales_qualification",
  "plan_recommendation",
  "booking_intent",
  "booking_offered",
  "booking_confirmed",
  "human_handoff_requested",
  "completed",
  "unknown_request",
  "external_failure",
] as const;

export type ConversationState = (typeof CONVERSATION_STATES)[number];

export const CONVERSATION_INTENTS = ["general_inquiry", "services", "pricing", "sales", "booking", "human_handoff", "unknown"] as const;

export type ConversationIntent = (typeof CONVERSATION_INTENTS)[number];

export const BOOKING_STATUSES = ["offered", "confirmed", "failed"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const HANDOFF_STATUSES = ["requested", "completed", "failed"] as const;
export type HandoffStatus = (typeof HANDOFF_STATUSES)[number];

// Which transitions are allowed is decided in the database
// (chat_state_can_transition, applied by chat_apply_state) from the state that
// is actually stored. There is deliberately no copy of that table here.

export function isConversationState(value: unknown): value is ConversationState {
  return typeof value === "string" && (CONVERSATION_STATES as readonly string[]).includes(value);
}

export function isConversationIntent(value: unknown): value is ConversationIntent {
  return typeof value === "string" && (CONVERSATION_INTENTS as readonly string[]).includes(value);
}

// Order matters: the first match wins.
const HANDOFF_RE =
  /(hablar con|habla con|hablarle|hablarles|contactar|comunicar(?:me|nos)? con|persona real|agente humano|humano|asesor(?:es|a)?(?![\p{L}])|representante|alguien (?:del equipo|real))|(?:escrib|habl|contact|comunic)\p{L}*[^.?!]{0,40}whatsapp/u;
const BOOKING_RE = /(agendar|agenda|reservar|reserva|cita|llamada|reunión|reunion|cal\.com|calendario)/u;
const PRICING_RE = /(precio|precios|cu[aá]nto|costo|costos|cuesta|cuestan|mensualidad|pago)/u;
const SALES_RE = /(qu[eé] plan|cu[aá]l plan|conviene|recomiend|recomendar|contratar|ventas|objetivo|problema|negocio|empezar|comenzar)/u;
const PLAN_RE = /(plan|planes)/u;
const SERVICES_RE = /(servicio|servicios|p[aá]gina|sitio web|seo|google business|perfil de negocio|agente de ia|oryn|qu[eé] hacen)/u;
const GREETING_RE = /^(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches|qui[eé]n eres|qu[eé] es oryn)[!.?\s]*$/u;

export function classifyIntent(content: string): ConversationIntent {
  const text = content.toLocaleLowerCase("es-DO");
  if (HANDOFF_RE.test(text)) return "human_handoff";
  if (BOOKING_RE.test(text)) return "booking";
  if (PRICING_RE.test(text)) return "pricing";
  if (SALES_RE.test(text)) return "sales";
  if (PLAN_RE.test(text)) return "pricing";
  if (SERVICES_RE.test(text)) return "services";
  if (GREETING_RE.test(text)) return "general_inquiry";
  return "unknown";
}

// Intents an ongoing conversation keeps until the visitor clearly changes topic.
// general_inquiry and unknown carry nothing to continue.
const CONTINUABLE_INTENTS: readonly ConversationIntent[] = ["services", "pricing", "sales", "booking", "human_handoff"];

// Classify the message; if it names no topic of its own ("Sí", "Claro", "Una
// agencia de bienes raíces", "300,000 pesos") it continues the intent already
// stored for the conversation. `inherited` tells the caller the intent did not
// come from this message's own words, so the message must not be stored as a
// summary of that intent.
export function resolveIntent(content: string, previousIntent: ConversationIntent | null): { intent: ConversationIntent; inherited: boolean } {
  const direct = classifyIntent(content);
  if (direct === "unknown" && previousIntent && CONTINUABLE_INTENTS.includes(previousIntent)) {
    return { intent: previousIntent, inherited: true };
  }
  return { intent: direct, inherited: false };
}

export function stateForIntent(intent: ConversationIntent): ConversationState {
  switch (intent) {
    case "general_inquiry":
      return "inquiry";
    case "services":
    case "pricing":
      return "service_inquiry";
    case "sales":
      return "sales_qualification";
    case "booking":
      return "booking_intent";
    case "human_handoff":
      return "human_handoff_requested";
    case "unknown":
      return "unknown_request";
  }
}

// States a conversation can already be in that an inherited (topic-less) turn
// must not pull backwards, e.g. "gracias" after plan_recommendation.
const HOLDABLE_STATES: readonly ConversationState[] = [
  "service_inquiry",
  "sales_qualification",
  "plan_recommendation",
  "booking_intent",
  "booking_offered",
  "human_handoff_requested",
];

// Starting point for this turn's state: the message's own intent, unless it was
// inherited and the stored state is one worth holding.
export function baseStateFor(intent: ConversationIntent, inherited: boolean, storedState: ConversationState | null): ConversationState {
  if (inherited && storedState && HOLDABLE_STATES.includes(storedState)) return storedState;
  return stateForIntent(intent);
}

// Desired state after this turn. Whether the move is allowed is decided by the
// database from the state actually stored, not here.
export function resolveResponseState(baseState: ConversationState, actions: readonly { type: string }[], providerFailed = false): ConversationState {
  if (providerFailed) return "external_failure";
  if (actions.some((action) => action.type === "offer_call")) return "booking_offered";
  if (actions.some((action) => action.type === "recommend_plan")) return "plan_recommendation";
  return baseState;
}

// Outcome of asking the database to apply a state change.
export type StateUpdateStatus = "ok" | "rejected" | "failed";
