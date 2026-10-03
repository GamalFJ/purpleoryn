// Conversation-flow bookkeeping kept in chat_sessions.flow (jsonb), separate from the visitor's
// own words in `qualification`. Written only by /api/chat through chat_apply_state. Nothing here
// is shown to the visitor.
import type { Objection } from "@/lib/agent/objections";

export const SALES_STAGES = ["discovery", "recommended", "objection_1", "objection_2", "released"] as const;
export type SalesStage = (typeof SALES_STAGES)[number];

// Telegram alerts already sent for this conversation; each kind is sent at most once.
export const ALERT_KINDS = ["handoff", "call"] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];

export interface Flow {
  sales_stage?: SalesStage;
  // The receptionist made an offer a bare "Sí" would accept; the next turn resolves it.
  pending_offer?: "sales";
  // Consecutive turns that ended on an unknown fact or a repeated question.
  failed_turns?: number;
  // The "this chat is the agent we install" line may be used once per conversation.
  demo_line_used?: boolean;
  alerts?: AlertKind[];
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
  if (Array.isArray(src.alerts)) {
    const kinds = src.alerts.filter((k): k is AlertKind => (ALERT_KINDS as readonly unknown[]).includes(k));
    if (kinds.length) out.alerts = [...new Set(kinds)];
  }
  return out;
}

const AFTER_RECOMMENDATION: readonly SalesStage[] = ["recommended", "objection_1", "objection_2"];

// The sales stage after this turn. Only code advances it, never the model.
//   discovery -> recommended when a plan button is shown this turn;
//   recommended -> objection_1 -> objection_2 on each objection;
//   a second objection round that still ends in an objection, a clear no or "not now" -> released.
// `released` is final: the agent stops pitching.
export function nextSalesStage(current: SalesStage | undefined, recommendedThisTurn: boolean, objection: Objection | null = null): SalesStage | undefined {
  if (current === "released") return current;
  if (current === undefined || current === "discovery") return recommendedThisTurn ? "recommended" : current;
  if (!AFTER_RECOMMENDATION.includes(current) || !objection) return current;
  if (objection === "decline" || objection === "not_now") return "released";
  if (current === "recommended") return "objection_1";
  if (current === "objection_1") return "objection_2";
  return "released"; // objection_2 and another objection
}
