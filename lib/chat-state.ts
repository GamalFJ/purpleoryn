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
// A call the visitor wants for themselves. A plural object ("agendar citas" as a feature
// of their own site, "llamadas") is not a request for one.
const BOOKING_RE =
  /(?:agend(?:ar|emos|amos|e)|reservar|programar)(?!\s+(?:(?:las|sus|tus|mis)\s+)?(?:citas|reservas|consultas|clientes|turnos|llamadas))|llamada(?!s)|reuni[oó]n|cal\.com|calendario|(?<![\p{L}])cita(?![\p{L}])/u;
// "no es necesario agendar citas", "no quiero hablar con una persona": what follows a
// negation (up to a comma, "pero", "gracias"...) is not what the visitor is asking for.
const NEGATED_RE =
  /(?<![\p{L}])(?:no|ni|sin)(?![\p{L}])(?:(?!pero|sino|aunque|gracias)[^.,;?!]){0,25}?(?:agend\p{L}*|citas?|reserv\p{L}*|llamad\p{L}*|reuni[oó]n|hablar|contactar|persona|humano|asesor\p{L}*|representante)/gu;
const PRICING_RE = /(precio|precios|cu[aá]nto|costo|costos|cuesta|cuestan|mensualidad|pago)/u;
const SALES_RE =
  /(qu[eé] plan|cu[aá]l plan|conviene|convendr|recomiend|recomendar|no s[eé] cu[aá]l|cu[aá]l me|ay[uú]d\p{L}* a (?:elegir|escoger|decidir)|escoger|decidir|contratar|ventas|objetivo|problema|negocio|empezar|comenzar)/u;
const PLAN_RE = /(plan|planes)/u;
const SERVICES_RE = /(servicio|servicios|p[aá]gina|sitio web|seo|google business|perfil de negocio|agente de ia|oryn|qu[eé] hacen)/u;
const GREETING_RE = /^(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches|qui[eé]n eres|qu[eé] es oryn)[!.?\s]*$/u;

export function classifyIntent(content: string): ConversationIntent {
  const text = content.toLocaleLowerCase("es-DO");
  const asked = text.replace(NEGATED_RE, " ");
  if (HANDOFF_RE.test(asked)) return "human_handoff";
  if (BOOKING_RE.test(asked)) return "booking";
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

// Intents that are a guided flow with its own capability. Inside one of these a
// stray keyword must not kick the visitor out ("comprar uno de sus servicios"
// during a booking is still a booking).
const ACTIVE_FLOW_INTENTS: readonly ConversationIntent[] = ["sales", "booking", "human_handoff"];

// An explicit price question is strong enough to leave booking/handoff. A plan-fit
// phrase is not: inside a booking it is usually the visitor's goal for the call
// ("una asesoría para saber qué plan me conviene"), and the sales capability
// cannot show the call button.
const PRICE_QUESTION_RE = /(precio|precios|cu[aá]nto (?:cuesta|cuestan|cobran|vale|sale|es)|costo|costos|mensualidad)/u;

// Classify the message, then apply the active-flow rule:
// - Outside an active flow: a message that names no topic continues the stored
//   intent (Step 4 behavior: "Sí", "Claro", "Me interesa", "Una agencia...").
// - Inside an active flow (sales / booking / human_handoff) the flow is kept
//   unless the visitor makes a strong change: asks to book, asks for a person,
//   or asks an explicit price question (from booking/handoff; the sales
//   capability already answers price questions).
// `inherited` tells the caller the intent did not come from this message's own
// words, so the message must not be stored as a summary of that intent.
export function resolveIntent(content: string, previousIntent: ConversationIntent | null): { intent: ConversationIntent; inherited: boolean } {
  const direct = classifyIntent(content);
  if (previousIntent && ACTIVE_FLOW_INTENTS.includes(previousIntent)) {
    if (direct === previousIntent) return { intent: direct, inherited: false };
    const text = content.toLocaleLowerCase("es-DO");
    const strong =
      direct === "booking" ||
      direct === "human_handoff" ||
      (direct === "pricing" && previousIntent !== "sales" && PRICE_QUESTION_RE.test(text));
    if (strong) return { intent: direct, inherited: false };
    return { intent: previousIntent, inherited: true };
  }
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
  // A visitor who asked for a person stays in the handoff state even though the
  // call button is offered as the way to reach one (booking_status still records it).
  if (baseState === "human_handoff_requested") return baseState;
  if (actions.some((action) => action.type === "offer_call")) return "booking_offered";
  if (actions.some((action) => action.type === "recommend_plan")) return "plan_recommendation";
  return baseState;
}

// Outcome of asking the database to apply a state change.
export type StateUpdateStatus = "ok" | "rejected" | "failed";
