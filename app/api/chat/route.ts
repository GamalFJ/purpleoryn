import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { chatWithFallback, isAgentConfigured } from "@/lib/ai";
import type { AgentMessage } from "@/lib/ai/types";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import { AGENT_TOOLS, runTool, type AgentAction } from "@/lib/agent/tools";
import { getAddons, getTiers } from "@/lib/content";
import {
  classifyIntent,
  resolveResponseState,
  stateForIntent,
  type ConversationIntent,
  type ConversationState,
} from "@/lib/chat-state";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";
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

type PublicSupabase = ReturnType<typeof publicClient>;

async function persistState(
  supabase: PublicSupabase,
  sessionId: string,
  state: ConversationState,
  intent: ConversationIntent,
  options: {
    recommendedPlan?: string | null;
    bookingStatus?: "offered" | "confirmed" | "failed" | null;
    handoffStatus?: "requested" | "completed" | "failed" | null;
    handoffSummary?: string | null;
    outcome?: string | null;
    lastErrorCode?: string | null;
  } = {},
) {
  const { error } = await supabase.rpc("chat_update_state", {
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
  if (error) console.error("[agent] state update failed:", error.message);
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
  const intent = classifyIntent(last.content);
  const intentState = stateForIntent(intent);

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
    await persistState(supabase, sessionId, failureState, intent, {
      outcome: "external_failure",
      lastErrorCode: "provider_failure",
    });
    return NextResponse.json({ reply: FALLBACK, actions: [] }, { status: 502 });
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
  await persistState(supabase, sessionId, finalState, intent, {
    recommendedPlan: recommended?.plan ?? null,
    bookingStatus: call ? "offered" : null,
    handoffStatus: intent === "human_handoff" ? "requested" : null,
    handoffSummary: intent === "human_handoff" ? last.content : null,
    outcome: finalState,
  });

  // Keep one action of each kind (the latest) so the widget doesn't stack duplicates.
  const latestByType = new Map(actions.map((a) => [a.type, a]));
  return NextResponse.json({ reply, actions: [...latestByType.values()], state: finalState, intent });
}
