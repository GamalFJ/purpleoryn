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
  3. readStoredIntent (service role) → resolveIntent(last message, stored intent)
  4. getTiers()/getAddons() → buildSystemPrompt() (lib/agent/prompt.ts)
  5. tool loop, max 3 rounds: chatWithFallback() → runTool() (lib/agent/tools.ts)
  6. chat_log_message (assistant reply); chat_record_outcome (anon RPC, legacy outcome fields)
  7. persistState → chat_apply_state (service-role RPC) → { state, intent, stateUpdate }
  8. response { reply, actions, state, intent, stateUpdate }
```

`actions` are UI instructions rendered under the reply by `ChatPanel`: ROI table,
"Elegir <plan>" link to `/servicios?plan=…`, and the Cal.com booking button.
`ChatPanel` currently ignores `state`, `intent` and `stateUpdate`.

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

There is no handoff tool, booking tool, availability lookup or lead-capture tool.

## Conversation state [implemented]

Stored on the existing `chat_sessions` row (no second store): `state`, `intent`, `intent_history`,
`qualification`, `booking_status`, `handoff_status`, `handoff_summary`, `outcome`, `last_error_code`,
`completed_at`, alongside the legacy `recommended_plan` and `handoff`.

- **Intent** — `lib/chat-state.ts`. `classifyIntent()` is deterministic regex over one message.
  `resolveIntent()` lets a bare affirmation ("Sí", "Claro", "Eso", "Me interesa") continue the
  intent stored for the session (services / pricing / sales / booking / human_handoff only).
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

`app/admin/(panel)/`: `conversaciones` (session list + transcript; shows `recommended_plan` and
`handoff` only — not `state`/`intent`), `planes`, `portafolio`, `prospectos`, `ajustes`,
`market-*`. Auth via Supabase; authorization enforced in the layout and by RLS.

## Planned: unified orchestration [planned — Step 5, not started]

Target: one orchestration layer inside the existing route that takes (stored state, last message)
and decides the active capability (receptionist / sales / booking / handoff), a state-specific
prompt addendum and the allowed tools. Constraints already decided: extend `/api/chat`,
`chat_sessions` and the current tools; no second chatbot, API or conversation store. See
[DECISIONS.md](DECISIONS.md) and [TASKS.md](TASKS.md).
