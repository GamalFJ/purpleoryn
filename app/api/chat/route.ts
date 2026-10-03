import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { chatWithFallback, isAgentConfigured } from "@/lib/ai";
import type { AgentMessage } from "@/lib/ai/types";
import { nextSalesStage, sanitizeFlow, type AlertKind, type Flow } from "@/lib/agent/flow";
import { chatAlertText } from "@/lib/agent/handoff";
import { classifyObjection } from "@/lib/agent/objections";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import { fallbackPlan, planTurn, type TurnPlan } from "@/lib/agent/orchestrator";
import { toPlainText } from "@/lib/agent/plain-text";
import { guardQualification, isKnown, mergeQualification, sanitizeQualification, SALES_ENOUGH, type Qualification } from "@/lib/agent/qualification";
import { lintReply } from "@/lib/agent/reply-lint";
import { runTool, toolsFor, type AgentAction } from "@/lib/agent/tools";
import { notifyChatEvent } from "@/lib/telegram";
import { getAddons, getTiers } from "@/lib/content";
import {
  isConversationIntent,
  isConversationState,
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

// Turn budget (E4): after this many visitor messages without a decision the agent stops asking and offers a person.
const MAX_VISITOR_TURNS_BEFORE_HANDOFF = 10;
const MAX_VISITOR_TURNS_SHORT = 16;

const foldForMatch = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
// A reply that recommends a plan ("te recomiendo ...", "el plan que le conviene es ...").
const RECOMMENDS_PLAN_RE = /\b(te|le) recomiendo\b|\brecomiend[oa]\b.*\b(presencia|conversion|autoridad)\b|\b(presencia|conversion|autoridad)\b.*\b(es el plan|es el ideal|es la mejor|te conviene|le conviene)\b/;

type RecommendAction = Extract<AgentAction, { type: "recommend_plan" }>;
type OfferCallAction = Extract<AgentAction, { type: "offer_call" }>;
type HandoffAction = Extract<AgentAction, { type: "handoff_whatsapp" }>;
const isRecommendAction = (a: AgentAction): a is RecommendAction => a.type === "recommend_plan";
const isOfferCallAction = (a: AgentAction): a is OfferCallAction => a.type === "offer_call";
const isHandoffAction = (a: AgentAction): a is HandoffAction => a.type === "handoff_whatsapp";

const FALLBACK = `Ahora mismo no puedo responder. Escríbenos por WhatsApp al ${SITE.phoneDisplay} y te atendemos.`;

function ipHash(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.CHAT_IP_SALT ?? "pcl"}:${ip}`).digest("hex");
}

// Conversation state lives in columns that anon/authenticated cannot read or
// write; it is read and written here with the service role only. Server-side
// only, and the visitor-driven path can never reach privileged values
// (booking_confirmed, completed, booking_status 'confirmed', handoff 'completed').
interface StoredSession {
  intent: ConversationIntent | null;
  state: ConversationState | null;
  qualification: Qualification;
  flow: Flow;
  recommendedPlan: string | null;
  handoffStatus: string | null;
}

async function readStoredState(sessionId: string): Promise<StoredSession> {
  const none: StoredSession = { intent: null, state: null, qualification: {}, flow: {}, recommendedPlan: null, handoffStatus: null };
  if (!isServiceRoleConfigured()) return none;
  const { data, error } = await serviceClient()
    .from("chat_sessions")
    .select("intent, state, qualification, flow, recommended_plan, handoff_status")
    .eq("id", sessionId)
    .maybeSingle();
  if (error) {
    console.error("[agent] state read failed:", error.message);
    return none;
  }
  return {
    intent: isConversationIntent(data?.intent) ? data.intent : null,
    state: isConversationState(data?.state) ? data.state : null,
    qualification: sanitizeQualification(data?.qualification),
    flow: sanitizeFlow(data?.flow),
    recommendedPlan: typeof data?.recommended_plan === "string" ? data.recommended_plan : null,
    handoffStatus: typeof data?.handoff_status === "string" ? data.handoff_status : null,
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
    qualification?: Qualification | null;
    flow?: Flow | null;
    recommendedPlan?: string | null;
    bookingStatus?: "offered" | "failed" | null;
    handoffStatus?: "offered" | "requested" | "failed" | null;
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
    p_qualification: options.qualification ?? null,
    p_flow: options.flow ?? null,
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

  // The orchestrator turns what is stored (state, intent, qualification) plus the last
  // message into this turn's capability, prompt addendum and allowed tools. If it ever
  // fails, fall back to the pre-orchestration behavior instead of breaking the chat.
  const stored = await readStoredState(sessionId);
  let plan: TurnPlan;
  try {
    plan = planTurn({ storedState: stored.state, storedIntent: stored.intent, message: last.content, qualification: stored.qualification });
  } catch (error) {
    console.error("[agent] orchestration failed, using fallback:", error instanceof Error ? error.message : "unknown error");
    plan = fallbackPlan(last.content);
  }
  const { intent, inherited, baseState: intentState, capability } = plan;
  const allowedTools = new Set<string>(plan.allowedTools);

  const [tiers, addons] = await Promise.all([getTiers(), getAddons()]);
  const basePrompt = buildSystemPrompt(tiers, addons);
  // Turn budget (E4): a long conversation that has not reached a button stops asking and hands over.
  const visitorTurns = messages.filter((m) => m.role === "user").length;
  const budgetNote =
    visitorTurns >= MAX_VISITOR_TURNS_SHORT
      ? "This conversation is very long. Reply in at most two sentences, ask nothing new and point to the WhatsApp button (handoff_whatsapp) if you have it."
      : visitorTurns >= MAX_VISITOR_TURNS_BEFORE_HANDOFF
        ? "This conversation has gone on for many turns without a decision. Stop asking questions: answer what was asked and, if you have handoff_whatsapp, offer it so a person can take over."
        : "";
  const addendum = [plan.addendum, budgetNote].filter(Boolean).join("\n");
  const system = addendum ? `${basePrompt}

${addendum}` : basePrompt;
  let qualificationPatch: Qualification = {};
  const conversation: AgentMessage[] = messages.slice(-HISTORY_WINDOW).map((m) => ({ role: m.role, content: m.content }));
  const actions: AgentAction[] = [];
  let reply = "";

  // Evidence for what the model may save: only the visitor's own words count (E1).
  const visitorText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const storedPlanName = tiers.find((t) => t.slug === stored.recommendedPlan)?.name ?? null;
  const toolContext = () => {
    const planNow = [...actions].reverse().find(isRecommendAction);
    return { known: mergeQualification(stored.qualification, qualificationPatch), planName: planNow?.planName ?? storedPlanName };
  };

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const result = await chatWithFallback({ system, messages: conversation, tools: round < MAX_TOOL_ROUNDS ? toolsFor(plan.allowedTools) : [] });
      if (!result.toolCalls.length) {
        reply = toPlainText(result.text);
        break;
      }
      conversation.push({ role: "assistant", content: result.text, toolCalls: result.toolCalls });
      for (const call of result.toolCalls) {
        // Only tools the active capability was offered may run.
        const out = allowedTools.has(call.name) ? runTool(call, tiers, toolContext()) : { content: JSON.stringify({ error: "Herramienta no disponible ahora." }) };
        if ("action" in out && out.action) actions.push(out.action);
        if ("qualification" in out && out.qualification) {
          qualificationPatch = mergeQualification(qualificationPatch, guardQualification(out.qualification, visitorText));
        }
        conversation.push({ role: "tool", toolCallId: call.id, name: call.name, content: out.content });
      }
    }

    // E2: in sales, with enough known, a reply that recommends a plan must come with its button.
    // If the model named a plan without calling recommend_plan, ask once for just that call and
    // keep the reply it already wrote.
    const known = toolContext().known;
    const stage = stored.flow.sales_stage;
    if (
      reply &&
      capability === "sales" &&
      (stage === undefined || stage === "discovery") &&
      !actions.some((a) => a.type === "recommend_plan") &&
      SALES_ENOUGH.every((key) => isKnown(known, key)) &&
      RECOMMENDS_PLAN_RE.test(foldForMatch(reply))
    ) {
      try {
        const retry = await chatWithFallback({
          system: `${system}\nYou just named a plan as the recommendation in your reply but did not call recommend_plan. Call recommend_plan now for that plan. Write no text.`,
          messages: [...conversation, { role: "assistant", content: reply }],
          tools: toolsFor(["recommend_plan"]),
        });
        for (const call of retry.toolCalls) {
          if (call.name !== "recommend_plan") continue;
          const out = runTool(call, tiers, toolContext());
          if ("action" in out && out.action) actions.push(out.action);
        }
        console.warn(`[agent] recommend_plan retry: ${actions.some((a) => a.type === "recommend_plan") ? "ok" : "no call"}`);
      } catch (error) {
        console.error("[agent] recommend_plan retry failed:", error instanceof Error ? error.message : "unknown error");
      }
    }
  } catch {
    const failureState = resolveResponseState(intentState, [], true);
    const failure = await persistState(sessionId, failureState, intent, {
      outcome: "external_failure",
      lastErrorCode: "provider_failure",
    });
    return NextResponse.json({ reply: FALLBACK, actions: [], state: failure.state, stateUpdate: failure.status, capability }, { status: 502 });
  }

  // Sentences that break the contract (permission questions, false claims, promises) are removed.
  const linted = lintReply(reply);
  if (linted.removed.length) console.warn(`[agent] reply lint removed: ${linted.removed.join(",")}`);
  reply = linted.text;

  if (!reply) reply = actions.length ? "Aquí tienes:" : FALLBACK;

  await supabase.rpc("chat_log_message", {
    p_session_id: sessionId,
    p_ip_hash: hash,
    p_role: "assistant",
    p_content: reply.slice(0, 4000),
  });

  const recommended = [...actions].reverse().find(isRecommendAction);
  const call = actions.find(isOfferCallAction);
  const handoff = [...actions].reverse().find(isHandoffAction);
  if (recommended || call) {
    await supabase.rpc("chat_record_outcome", {
      p_session_id: sessionId,
      p_recommended_plan: recommended?.plan ?? null,
      p_handoff: call ? "cal_com" : null,
    });
  }

  const finalState = resolveResponseState(intentState, actions);
  // Only code advances the sales stage; it is written only when it changed.
  const salesStage = nextSalesStage(stored.flow.sales_stage, Boolean(recommended), classifyObjection(last.content));
  // Each alert kind (WhatsApp handoff, call button) is sent once per conversation.
  const sentAlerts = stored.flow.alerts ?? [];
  const newAlerts: AlertKind[] = [];
  if (handoff && !sentAlerts.includes("handoff")) newAlerts.push("handoff");
  if (call && !sentAlerts.includes("call")) newAlerts.push("call");
  const flowChanged = salesStage !== stored.flow.sales_stage || newAlerts.length > 0;
  // A visitor who asked for a person stays "requested"; the WhatsApp button only marks "offered".
  const handoffStatus = intent === "human_handoff" ? "requested" : handoff && stored.handoffStatus !== "requested" && stored.handoffStatus !== "completed" ? "offered" : null;
  const update = await persistState(sessionId, finalState, intent, {
    // Merge into what was stored; only written when the visitor gave something new.
    qualification: Object.keys(qualificationPatch).length ? mergeQualification(stored.qualification, qualificationPatch) : null,
    flow: flowChanged ? { ...stored.flow, ...(salesStage ? { sales_stage: salesStage } : {}), ...(newAlerts.length ? { alerts: [...sentAlerts, ...newAlerts] } : {}) } : null,
    recommendedPlan: recommended?.plan ?? null,
    bookingStatus: call ? "offered" : null,
    handoffStatus,
    // An inherited intent ("Sí") is not the visitor's own description of what they need.
    handoffSummary: intent === "human_handoff" && !inherited ? last.content : (handoff?.summary ?? null),
    outcome: finalState,
  });

  // Alerts go out after the response so the visitor never waits on Telegram, and only once the
  // state is stored, so a failed write can be retried by the next event instead of being lost.
  if (update.status === "ok" && newAlerts.length) {
    const known = mergeQualification(stored.qualification, qualificationPatch);
    const planName = recommended?.planName ?? storedPlanName;
    after(async () => {
      for (const kind of newAlerts) {
        await notifyChatEvent(chatAlertText(kind, sessionId, known, planName, kind === "handoff" ? handoff?.reason : undefined));
      }
    });
  }

  // Keep one action of each kind (the latest) so the widget doesn't stack duplicates.
  // `state` is what the database actually stored; `stateUpdate` says whether it moved.
  const latestByType = new Map(actions.map((a) => [a.type, a]));
  return NextResponse.json({ reply, actions: [...latestByType.values()], state: update.state, intent, stateUpdate: update.status, capability });
}
