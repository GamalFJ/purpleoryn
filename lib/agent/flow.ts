// Conversation-flow bookkeeping kept in chat_sessions.flow (jsonb), separate from the visitor's
// own words in `qualification`. Written only by /api/chat through chat_apply_state. Nothing here
// is shown to the visitor.

export const SALES_STAGES = ["discovery", "recommended", "objection_1", "objection_2", "released"] as const;
export type SalesStage = (typeof SALES_STAGES)[number];

export interface Flow {
  sales_stage?: SalesStage;
  // The receptionist made an offer a bare "Sí" would accept; the next turn resolves it.
  pending_offer?: "sales";
  // Consecutive turns that ended on an unknown fact or a repeated question.
  failed_turns?: number;
  // The "this chat is the agent we install" line may be used once per conversation.
  demo_line_used?: boolean;
}

export function sanitizeFlow(raw: unknown): Flow {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const out: Flow = {};
  if (typeof src.sales_stage === "string" && (SALES_STAGES as readonly string[]).includes(src.sales_stage)) {
    out.sales_stage = src.sales_stage as SalesStage;
  }
  if (src.pending_offer === "sales") out.pending_offer = "sales";
  if (typeof src.failed_turns === "number" && Number.isInteger(src.failed_turns) && src.failed_turns >= 0 && src.failed_turns <= 50) {
    out.failed_turns = src.failed_turns;
  }
  if (src.demo_line_used === true) out.demo_line_used = true;
  return out;
}

// The sales stage after this turn. Only code advances it, never the model: a plan button shown
// this turn moves discovery to recommended; every later stage is advanced by the objection logic
// (a later phase) and is left alone here.
export function nextSalesStage(current: SalesStage | undefined, recommendedThisTurn: boolean): SalesStage | undefined {
  if (recommendedThisTurn && (current === undefined || current === "discovery")) return "recommended";
  return current;
}
