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

const STATE_TRANSITIONS: Record<ConversationState, readonly ConversationState[]> = {
  new: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "external_failure"],
  inquiry: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "completed", "external_failure"],
  service_inquiry: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "completed", "external_failure"],
  sales_qualification: ["inquiry", "service_inquiry", "sales_qualification", "plan_recommendation", "booking_intent", "human_handoff_requested", "unknown_request", "completed", "external_failure"],
  plan_recommendation: ["inquiry", "service_inquiry", "sales_qualification", "plan_recommendation", "booking_intent", "booking_offered", "human_handoff_requested", "completed", "external_failure"],
  booking_intent: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "booking_offered", "human_handoff_requested", "unknown_request", "completed", "external_failure"],
  booking_offered: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "booking_offered", "human_handoff_requested", "unknown_request", "completed", "external_failure"],
  booking_confirmed: ["completed", "inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request"],
  human_handoff_requested: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "completed", "external_failure", "unknown_request"],
  completed: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "completed"],
  unknown_request: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "external_failure"],
  external_failure: ["inquiry", "service_inquiry", "sales_qualification", "booking_intent", "human_handoff_requested", "unknown_request", "external_failure"],
};

export function isConversationState(value: string): value is ConversationState {
  return (CONVERSATION_STATES as readonly string[]).includes(value);
}

export function isConversationIntent(value: string): value is ConversationIntent {
  return (CONVERSATION_INTENTS as readonly string[]).includes(value);
}

export function canTransition(from: ConversationState, to: ConversationState): boolean {
  return STATE_TRANSITIONS[from].includes(to);
}

export function classifyIntent(content: string): ConversationIntent {
  const text = content.toLocaleLowerCase("es-DO");
  if (/(hablar|comunicar|contactar|persona|humano|asesor|representante|whatsapp)/u.test(text)) return "human_handoff";
  if (/(agendar|agenda|reservar|reserva|cita|llamada|reunión|reunion|cal\.com|calendario)/u.test(text)) return "booking";
  if (/(precio|precios|cu[aá]nto|costo|costos|mensualidad|pago|plan)/u.test(text)) return "pricing";
  if (/(recomienda|recomiendas|conviene|contratar|ventas|objetivo|problema|negocio|empezar|comenzar)/u.test(text)) return "sales";
  if (/(servicio|servicios|p[aá]gina|sitio web|seo|google business|perfil de negocio|agente de ia|oryn|qu[eé] hacen)/u.test(text)) return "services";
  if (/^(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches|qui[eé]n eres|qu[eé] es oryn)[!.?\s]*$/u.test(text)) return "general_inquiry";
  return "unknown";
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

export function resolveResponseState(baseState: ConversationState, actions: readonly { type: string }[], providerFailed = false): ConversationState {
  if (providerFailed) return canTransition(baseState, "external_failure") ? "external_failure" : baseState;
  if (actions.some((action) => action.type === "offer_call")) return canTransition(baseState, "booking_offered") ? "booking_offered" : baseState;
  if (actions.some((action) => action.type === "recommend_plan")) return canTransition(baseState, "plan_recommendation") ? "plan_recommendation" : baseState;
  return baseState;
}
