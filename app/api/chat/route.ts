import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { chatWithFallback, isAgentConfigured } from "@/lib/ai";
import type { AgentMessage } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import { AGENT_TOOLS, runTool, type AgentAction } from "@/lib/agent/tools";
import { getAddons, getTiers } from "@/lib/content";
import {
  isConversationIntent,
  isConversationState,
  baseStateFor,
  resolveIntent,
  resolveResponseState,
  type ConversationIntent,
  type ConversationState,
  type StateUpdateStatus,
} from "@/lib/chat-state";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";
import { serviceClient } from "@/lib/supabase/service";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const MAX_SESSION_MESSAGES = 60; // user + assistant, per conversation
const MAX_IP_USER_MESSAGES_PER_HOUR = 30;
const MAX_TOOL_ROUNDS = 3;
const HISTORY_WINDOW = 16;

const bodySchema = z.object({
  sessionId: z.uuid(),
  landingPage: z.string().max(300).optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) }))
    .min(1)
    .max(80),
});

const FALLBACK = `Ahora mismo no puedo responder. Escríbenos por WhatsApp al ${SITE.phoneDisplay} y te atendemos.`;

function ipHash(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.CHAT_IP_SALT ?? "pcl"}:${ip}`).digest("hex");
}

// Conversation state lives in columns that anon/authenticated cannot read or
// write; it is read and written here with the service role only. Server-side
// only, and the visitor-driven path can never reach privileged values
// (booking_confirmed, completed, booking_status 'confirmed', handoff 'completed').
async function readStoredState(sessionId: string): Promise<{ intent: ConversationIntent | null; state: ConversationState | null }> {
  const none = { intent: null, state: null };
  if (!isServiceRoleConfigured()) return none;
  const { data, error } = await serviceClient().from("chat_sessions").select("intent, state").eq("id", sessionId).maybeSingle();
  if (error) {
    console.error("[agent] state read failed:", error.message);
    return none;
  }
  return {
    intent: isConversationIntent(data?.intent) ? data.intent : null,
    state: isConversationState(data?.state) ? data.state : null,
  };
}

interface StateUpdate {
  status: StateUpdateStatus;
  // The state actually stored afterwards; null when it could not be determined.
  state: ConversationState | null;
}

// The database decides whether the transition is allowed from the state it has
// stored. A refusal keeps the previous state and is reported, not swallowed.
async function persistState(
  sessionId: string,
  state: ConversationState,
  intent: ConversationIntent,
  options: {
    recommendedPlan?: string | null;
    bookingStatus?: "offered" | "failed" | null;
    handoffStatus?: "requested" | "failed" | null;
    handoffSummary?: string | null;
    outcome?: string | null;
    lastErrorCode?: string | null;
  } = {},
): Promise<StateUpdate> {
  if (!isServiceRoleConfigured()) {
    console.error("[agent] state update skipped: SUPABASE_SERVICE_ROLE_KEY is not configured");
    return { status: "failed", state: null };
  }
  const { data, error } = await serviceClient().rpc("chat_apply_state", {
    p_session_id: sessionId,
    p_state: state,
    p_intent: intent,
    p_qualification: null,
    p_recommended_plan: options.recommendedPlan ?? null,
    p_booking_status: options.bookingStatus ?? null,
    p_handoff_status: options.handoffStatus ?? null,
    p_handoff_summary: options.handoffSummary ?? null,
    p_outcome: options.outcome ?? null,
    p_last_error_code: options.lastErrorCode ?? null,
  });
  const result = data as { ok?: boolean; code?: string; state?: string } | null;
  if (error || !result) {
    console.error("[agent] state update failed:", error?.message ?? "empty response");
    return { status: "failed", state: null };
  }
  const stored = isConversationState(result.state) ? result.state : null;
  if (!result.ok) {
    console.error(`[agent] state update rejected (${result.code ?? "unknown"}): kept ${stored ?? "previous state"}`);
    return { status: "rejected", state: stored };
  }
  return { status: "ok", state: stored };
}

export async function POST(request: NextRequest) {
  if (!isAgentConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ reply: FALLBACK, actions: [], unavailable: true }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  const last = parsed.success ? parsed.data.messages.at(-1) : undefined;
  if (!parsed.success || last?.role !== "user") {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const { sessionId, landingPage, messages } = parsed.data;
  const supabase = publicClient();
  const hash = ipHash(request);

  // Log the visitor's message first; the counters it returns drive rate limits.
  const { data: counters, error: logError } = await supabase.rpc("chat_log_message", {
    p_session_id: sessionId,
    p_ip_hash: hash,
    p_role: "user",
    p_content: last.content,
    p_landing_page: landingPage ?? null,
    p_user_agent: request.headers.get("user-agent"),
  });
  if (logError) {
    console.error("[agent] log failed:", logError.message);
    return NextResponse.json({ reply: FALLBACK, actions: [] }, { status: 502 });
  }
  const { session_messages, ip_user_messages_last_hour } = counters as { session_messages: number; ip_user_messages_last_hour: number };
  if (session_messages > MAX_SESSION_MESSAGES || ip_user_messages_last_hour > MAX_IP_USER_MESSAGES_PER_HOUR) {
    return NextResponse.json(
      {
        reply: `Llegamos al límite de mensajes por ahora. Para seguir, agenda una llamada gratis o escríbenos por WhatsApp al ${SITE.phoneDisplay}.`,
        actions: [{ type: "offer_call", plan: null, planName: null, summary: "" } satisfies AgentAction],
        limited: true,
      },
      { status: 429 },
    );
  }

  // A message that names no topic ("Sí", "Una agencia de bienes raíces") continues the
  // intent and state already stored for this session.
  const stored = await readStoredState(sessionId);
  const { intent, inherited } = resolveIntent(last.content, stored.intent);
  const intentState = baseStateFor(intent, inherited, stored.state);

  const [tiers, addons] = await Promise.all([getTiers(), getAddons()]);
  const system = buildSystemPrompt(tiers, addons);
  const conversation: AgentMessage[] = messages.slice(-HISTORY_WINDOW).map((m) => ({ role: m.role, content: m.content }));
  const actions: AgentAction[] = [];
  let reply = "";

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const result = await chatWithFallback({ system, messages: conversation, tools: round < MAX_TOOL_ROUNDS ? AGENT_TOOLS : [] });
      if (!result.toolCalls.length) {
        reply = result.text.trim();
        break;
      }
      conversation.push({ role: "assistant", content: result.text, toolCalls: result.toolCalls });
      for (const call of result.toolCalls) {
        const out = runTool(call, tiers);
        if (out.action) actions.push(out.action);
        conversation.push({ role: "tool", toolCallId: call.id, name: call.name, content: out.content });
      }
    }
  } catch {
    const failureState = resolveResponseState(intentState, [], true);
    const failure = await persistState(sessionId, failureState, intent, {
      outcome: "external_failure",
      lastErrorCode: "provider_failure",
    });
    return NextResponse.json({ reply: FALLBACK, actions: [], state: failure.state, stateUpdate: failure.status }, { status: 502 });
  }

  if (!reply) reply = actions.length ? "Aquí tienes:" : FALLBACK;

  await supabase.rpc("chat_log_message", {
    p_session_id: sessionId,
    p_ip_hash: hash,
    p_role: "assistant",
    p_content: reply.slice(0, 4000),
  });

  const recommended = [...actions].reverse().find((a) => a.type === "recommend_plan");
  const call = actions.find((a) => a.type === "offer_call");
  if (recommended || call) {
    await supabase.rpc("chat_record_outcome", {
      p_session_id: sessionId,
      p_recommended_plan: recommended?.plan ?? null,
      p_handoff: call ? "cal_com" : null,
    });
  }

  const finalState = resolveResponseState(intentState, actions);
  const update = await persistState(sessionId, finalState, intent, {
    recommendedPlan: recommended?.plan ?? null,
    bookingStatus: call ? "offered" : null,
    handoffStatus: intent === "human_handoff" ? "requested" : null,
    // An inherited intent ("Sí") is not the visitor's own description of what they need.
    handoffSummary: intent === "human_handoff" && !inherited ? last.content : null,
    outcome: finalState,
  });

  // Keep one action of each kind (the latest) so the widget doesn't stack duplicates.
  // `state` is what the database actually stored; `stateUpdate` says whether it moved.
  const latestByType = new Map(actions.map((a) => [a.type, a]));
  return NextResponse.json({ reply, actions: [...latestByType.values()], state: update.state, intent, stateUpdate: update.status });
}
