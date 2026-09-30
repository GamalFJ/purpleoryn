# Architecture

Legend: **[implemented]** exists in the repo and was verified; **[planned]** does not exist yet.
Implementation detail and known gaps are tracked in [CURRENT-STATE.md](CURRENT-STATE.md).

## Stack [implemented]

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 4 · Supabase (`@supabase/ssr`,
`@supabase/supabase-js`) · Framer Motion · zod 4. Scripts: `npm run dev | build | lint |
typecheck` (there is no test runner). Deployed on Vercel. `images.unoptimized = true`.

Supabase clients (`lib/supabase/`):

- `publicClient()` (`server.ts`) — anon key, cookie-less. Public reads, anonymous inserts,
  and the legacy chat RPCs.
- `createClient()` (`server.ts`) — cookie-aware, admin panel and auth.
- `serviceClient()` (`service.ts`) — service role, bypasses RLS. Server-only. Used for `market_*`
  tables and chat conversation state. Never import in client components.

Multi-market: `middleware.ts` maps host → `x-market` header; only `do` is live.

## Chat request path [implemented]

```
ChatLauncher (client, lazy) → ChatPanel (client)
   sessionId in sessionStorage; POST /api/chat { sessionId, landingPage, messages }
        │
        ▼
app/api/chat/route.ts (Node runtime)
  1. zod-validate body (last message must be from the user)
  2. chat_log_message (anon RPC) → logs the user message, returns counters
     → rate limits: 60 messages/session, 30 user messages/IP/hour (IP hashed with CHAT_IP_SALT)
  3. readStoredState (service role: intent, state, qualification) → planTurn() (lib/agent/orchestrator.ts)
     → { intent, baseState, capability, addendum, allowedTools }; if planTurn throws → fallbackPlan()
  4. getTiers()/getAddons() → buildSystemPrompt() (lib/agent/prompt.ts) + the capability addendum
  5. tool loop, max 3 rounds: chatWithFallback() with only the allowed tools → runTool() (lib/agent/tools.ts);
     a tool the capability was not offered is refused
  6. chat_log_message (assistant reply); chat_record_outcome (anon RPC, legacy outcome fields)
  7. persistState → chat_apply_state (service-role RPC; also writes merged qualification when the visitor gave
     something new) → { state, intent, stateUpdate }
  8. response { reply, actions, state, intent, stateUpdate, capability }
```

`actions` are UI instructions rendered under the reply by `ChatPanel`: ROI table,
"Elegir <plan>" link to `/servicios?plan=…`, and the Cal.com booking button.
`ChatPanel` ignores `state`, `intent`, `stateUpdate` and `capability`. For a plan sold by call (Autoridad, per `TIER_CTA`) the
recommendation button is "Hablar de Autoridad" and opens the Cal.com booking (D15).

## AI provider abstraction [implemented]

`lib/ai/` — provider-neutral types (`types.ts`: `ChatProvider`, `ChatRequest`, `ToolDefinition`,
`ProviderError` with typed `code`), one file per vendor, and `index.ts`:

- `chatWithFallback()` tries configured providers in order and returns the first success.
- `AI_PROVIDER=openrouter` → OpenRouter first, OpenAI as fallback; `AI_PROVIDER=openai` → reverse;
  **unset → OpenAI first, OpenRouter second** (backward compatible).
- **OpenRouter** (`openrouter.ts`): OpenAI-compatible chat completions with tool calling.
  Model: `AI_MODEL` → `OPENROUTER_MODEL` → default `openai/gpt-4o-mini`. 25 s timeout.
- **OpenAI** (`openai.ts`): model from `OPENAI_MODEL`. Same hardening (typed, sanitized errors).
- `anthropic` / `gemini` appear in the `ChatProvider.name` union and in `.env.example` but have
  **no implementation**.

Env vars: `AI_PROVIDER`, `AI_MODEL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENAI_API_KEY`,
`OPENAI_MODEL`, `CHAT_IP_SALT`. Keys are server-only and never echoed.

## Tools [implemented]

`lib/agent/tools.ts` — `AGENT_TOOLS` and `runTool()`. Tools return a result string for the model and
optionally a UI `AgentAction`:

| Tool | Purpose | UI action |
| --- | --- | --- |
| `calculate_roi` | Oryn ROI Method for a plan and average sale value (`lib/roi.ts`) | `roi` table |
| `recommend_plan` | Recommend `presencia` / `conversion` / `autoridad` | link to `/servicios?plan=` |
| `offer_call` | Offer the free 20-minute call after brief pre-qualification | Cal.com button |
| `record_qualification` | Save what the visitor said about their business (whitelisted, length-capped, no contact details) into `chat_sessions.qualification` | none |

There is no handoff tool, booking tool, availability lookup or lead-capture tool. Which tools are offered per turn is
decided by the orchestrator (next section).

## Conversation state [implemented]

Stored on the existing `chat_sessions` row (no second store): `state`, `intent`, `intent_history`,
`qualification`, `booking_status`, `handoff_status`, `handoff_summary`, `outcome`, `last_error_code`,
`completed_at`, alongside the legacy `recommended_plan` and `handoff`.

- **Intent** — `lib/chat-state.ts`. `classifyIntent()` is deterministic regex over one message.
  `resolveIntent()` lets a message that names no topic ("Sí", "Una agencia de bienes raíces")
  continue the intent stored for the session (services / pricing / sales / booking / human_handoff only);
  `baseStateFor()` holds the stored state on such turns.
- **State** — 12 states; the desired state comes from the intent, overridden by `offer_call`
  (→ `booking_offered`) or `recommend_plan` (→ `plan_recommendation`), or `external_failure` on
  provider failure.
- **The database is authoritative.** `chat_state_can_transition()` in SQL is the only transition
  table. The API never decides a transition from a state it derived itself.
- **Write paths** (migration `20260930010000_chat_state_hardening.sql`), all service-role only;
  `anon`/`authenticated` have no execute rights:
  - `chat_apply_state` — used by `/api/chat`. Refuses `booking_confirmed`, `completed`,
    `booking_status = 'confirmed'`, `handoff_status = 'completed'`.
  - `chat_apply_trusted_state` — the only path that accepts those values. **Not called by any code.**
  - A refused change returns `{ ok:false, code, state }`, keeps the stored state, records
    `last_error_code`, and surfaces as `stateUpdate: "rejected"` in the API response
    (`"failed"` when the RPC or service role is unavailable). Chat replies still go out.
- State is **telemetry only** today: it is not fed to the prompt or tools and not shown in the UI.

## Integrations

- **Cal.com** [implemented, link-only] — `CAL_URL` in `lib/site.ts`; `calUrl()` (`lib/links.ts`)
  prefills `metadata[plan]` and notes; `TrackedLink` fires a `cal_click` analytics event.
  No API, no webhook, so a booking can never be confirmed back into chat state.
- **WhatsApp** [implemented, link-only] — `whatsappUrl()` builds `wa.me` links from the number in
  `lib/site.ts`. `POST /api/go/whatsapp` is a click-attribution beacon that writes to `market_leads`
  and is unrelated to chat sessions. The chat has no WhatsApp handoff channel.
- **Telegram** [implemented, leads only] — `lib/telegram.ts` alerts on `/servicios` order
  submissions; the `supabase/functions/telegram-notify` edge function handles `market_leads` /
  `orders` inserts via a dashboard-wired Database Webhook. Chat activity sends no alert. Off when `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` are unset.
- **Supabase** [implemented] — see the client list above. Migrations in `supabase/migrations/`.
- **Formal leads/orders** [implemented] — the `/servicios` form (`app/servicios/actions.ts`)
  writes to `leads` and creates orders. Chat does not create leads.
- **Kapso** — not present in the repository.

## Admin [implemented]

`app/admin/(panel)/`: `conversaciones` (read-only session list + transcript; shows `recommended_plan`, `handoff`, and now
`state`, `intent`, `booking_status`, `handoff_status`, the last error code and the saved qualification), `planes`, `portafolio`, `prospectos`, `ajustes`,
`market-*`. Auth via Supabase; authorization enforced in the layout and by RLS.

## Unified orchestration [implemented in code, not yet verified live — Step 5]

One conversational system, four capabilities. `lib/agent/orchestrator.ts` is pure (no model, database or network):
`planTurn({ storedState, storedIntent, message, qualification })` returns the intent, the state to ask the database for,
the active capability, a short prompt addendum and the allowed tools. `/api/chat` appends the addendum to the existing
system prompt. If `planTurn` throws, `fallbackPlan()` restores the pre-orchestration behavior (classify the message alone,
no addendum, the original three tools). The database still decides whether a state change is allowed.

| Capability | Active when | Tools offered | Focus |
| --- | --- | --- | --- |
| Receptionist | general inquiry, services, pricing, unknown, new | `calculate_roi`, `record_qualification` | answer from approved facts; no call button |
| Sales | `sales_qualification`, `plan_recommendation` | `calculate_roi`, `recommend_plan`, `record_qualification` | ask only the next useful question; recommend when business type, appointments/orders and average sale are known |
| Booking | `booking_intent`, `booking_offered` | `offer_call`, `record_qualification` | ask only the missing item (business type, goal, timing); never claim a booking |
| Human handoff | `human_handoff_requested` | `offer_call` | point to WhatsApp and the call; never claim anyone was notified; no response times |

**Intent switching (`resolveIntent` in `lib/chat-state.ts`).** The classifier is unchanged. Outside an active flow a message
that names no topic continues the stored intent (Step 4 behavior). Inside an active flow (sales, booking, human_handoff) weak
keywords ("servicios", "empezar", "cuánto" in an answer) do not switch it. Strong changes do: asking to book, asking for a
person, asking which plan fits (from booking/handoff), or an explicit price question (from booking/handoff).

**Qualification memory (`lib/agent/qualification.ts`).** Stored in the existing `chat_sessions.qualification` (no migration) via
`chat_apply_state`. Keys: `business_type`, `has_website`, `has_google_profile`, `customer_channel`, `appointments_or_orders`,
`average_sale`, `goal`, `timing`. Text is capped (60–120 characters), stripped of control characters, and dropped if it looks like
an email, link, handle or phone number. The orchestrator tells the model what is known, and what to ask next, as data rather than
instructions. If the state change is rejected, that turn's qualification is not stored.

**State behavior.** `offer_call` moves to `booking_offered` except in the handoff capability, which keeps
`human_handoff_requested` (the call button is recorded in `booking_status`). An Autoridad recommendation stays
`plan_recommendation` (D15). `booking_confirmed`, `completed` and handoff `completed` remain reachable only via the trusted RPC, which
nothing calls.

**Out of scope (not implemented):** human-handoff notification (WhatsApp/Telegram/Kapso), Cal.com webhook or automatic booking,
`booking_confirmed`, lead/order creation from chat, provider changes. See [DECISIONS.md](DECISIONS.md) (D16) and [TASKS.md](TASKS.md).
