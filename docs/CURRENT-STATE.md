# Current state

What **actually exists in the repository** as of the stabilization commit (2026-09-30). Planned work is
not described here — see [ROADMAP.md](ROADMAP.md). Update this file whenever implementation materially
changes.

## Repository

- Next.js 15 / React 19 / TypeScript / Tailwind 4 / Supabase site, `purpleoryn`.
- Validation available: `npm run typecheck`, `npm run lint`, `npm run build`. **No test runner exists.**
- Migrations in `supabase/migrations/` (latest two are chat state; see below).

## Chat (`POST /api/chat`) — working

- Validates input, logs messages (`chat_log_message`), rate-limits (60/session, 30 user msgs/IP/hour).
- Builds the system prompt per request from live plans/add-ons + FAQ (`lib/agent/prompt.ts`).
- Runs up to 3 tool rounds via `chatWithFallback` (`lib/ai`).
- Returns `{ reply, actions, state, intent, stateUpdate }`. On provider failure: 502 with the Spanish
  fallback text pointing to WhatsApp.
- If the AI provider or Supabase (anon) is not configured: 503 with the fallback text.

## AI providers — working

- `openrouter` (default model `openai/gpt-4o-mini`, overridable by `AI_MODEL`/`OPENROUTER_MODEL`) and
  `openai` (`OPENAI_MODEL`). `AI_PROVIDER` picks the primary; the other is fallback. Unset = OpenAI first.
- Not implemented: `anthropic`, `gemini` (names exist in types/env example only).
- **Unverified:** which provider/keys are set in the deployed environment.

## Tools — working

`calculate_roi`, `recommend_plan`, `offer_call` (`lib/agent/tools.ts`). No handoff, booking, availability
or lead tools.

## Conversation state — implemented, untested against a live database

- Columns on `chat_sessions` (migration `20260930000000_chat_state.sql`).
- Hardening migration `20260930010000_chat_state_hardening.sql`: drops the anon-callable
  `chat_update_state`; adds `chat_state_can_transition`, `chat_apply_state` (used by the route) and
  `chat_apply_trusted_state` (unused); all service-role only.
- Route reads the stored intent via the service role, resolves intent (with affirmation inheritance),
  and applies state through `chat_apply_state`. Refused/failed updates are reported as
  `stateUpdate: "rejected" | "failed"`; the previous state is kept.
- **Migration status: NOT verified as applied.** The connector available to the last session could only
  see a different Supabase project (`signatura-creativa`), so the purpleoryn database was not inspected.
  Until both migrations are applied there, every state update reports `stateUpdate: "failed"` (chat
  itself keeps answering).
- Requires `SUPABASE_SERVICE_ROLE_KEY` in the server environment; without it state updates report
  `"failed"`.
- `chat_sessions.qualification` exists but nothing writes it. `booking_confirmed` and `completed` are
  never set by any code. Nothing calls `chat_apply_trusted_state`.
- State is telemetry only: not used by the prompt, tools, `ChatPanel` or the admin panel.

## Intent handling

Deterministic regex over the last message (`lib/chat-state.ts`), plus continuation of the stored intent
for bare affirmations. Known limitation: a mid-flow answer with no keyword (e.g. "tengo una ferretería")
classifies as `unknown` → state `unknown_request`.

## UI

- `ChatLauncher` (floating button, lazy-loads) and `ChatPanel` (sessionStorage history, starter chips,
  renders `roi` / `recommend_plan` / `offer_call` actions). It ignores `state`, `intent`, `stateUpdate`.
- Admin `conversaciones` shows `recommended_plan` and `handoff` only.

## Integrations

| Integration | Reality |
| --- | --- |
| Cal.com | Link only (`CAL_URL`, prefilled plan/notes, click event). No API/webhook. |
| WhatsApp | `wa.me` links and a click-attribution beacon (`/api/go/whatsapp` → `market_leads`). Not connected to chat sessions; no chat handoff channel. |
| Telegram | Alerts for `/servicios` orders (direct call) and `market_leads`/`orders` (edge function via dashboard webhook). None for chat. |
| Supabase | Anon, cookie and service-role clients; RLS on; migrations in repo. |
| Kapso | Not present. |

## Known gaps / risks

1. Chat-state migrations unverified in the purpleoryn Supabase project (see above).
2. `chat_log_message` and legacy `chat_record_outcome` remain callable with the anon key (unchanged).
   `chat_record_outcome` can set `recommended_plan` / `handoff` for any known session UUID. Untouched
   by the stabilization on purpose.
3. Human handoff is a status flag only (`handoff_status = 'requested'`); no notification exists.
4. `handoff_summary` stores the visitor's raw message (≤500 chars) and could contain contact details the
   visitor typed.
5. Two overlapping outcome models (`recommended_plan`/`handoff` and `booking_status`/`handoff_status`).
6. Concurrent requests on one session can interleave state writes (last write wins under the row lock).
