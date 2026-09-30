# Current state

What **actually exists in the repository** as of the stabilization commit (2026-09-30). Planned work is
not described here — see [ROADMAP.md](ROADMAP.md). Update this file whenever implementation materially
changes.

## Repository

- Next.js 15 / React 19 / TypeScript / Tailwind 4 / Supabase site, `purpleoryn`.
- Validation available: `npm run typecheck`, `npm run lint`, `npm run build`. **No test runner exists.**
- Git: `main` is the only branch (owner decision, 2026-09-30); commits go straight to `main`, no PRs. Unmerged legacy commits are kept as tags `archive/presencia-digital-express` and `archive/faq-pedido-formal`. Production deploys from `main` on Vercel (project `purpleoryn`).
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
- **Deployed environment (checked 2026-09-30, names only; values are masked):** Production has `AI_PROVIDER`, `OPENROUTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`; `OPENAI_API_KEY` was removed, so OpenRouter is the only provider in production (no fallback). Whether `AI_PROVIDER` is exactly `openrouter` is unverified. Preview has none of the AI or service-role keys, so Preview chat returns the 503 fallback.

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
- **Migration status (verified 2026-09-30 against the live database).** The Supabase project is named
  **"Purple Cove Labs Website"** (ref `vmrsgltwsznyfnihfefu`, org "Purple Cove Labs"); the other projects in
  that org are different products.
  - `20260930000000_chat_state.sql` was **already applied** out-of-band (columns, constraints, indexes all
    present) but is **not recorded** in the migration history. Same for the repo's
    `20260920000000_document_uploads.sql` (columns and `site-docs` bucket exist, not in history).
  - `20260930010000_chat_state_hardening.sql` was **applied** on 2026-09-30 (history name
    `chat_state_hardening`, version `20260930135319`). Verified afterwards: `chat_update_state` is gone;
    `chat_apply_state` and `chat_apply_trusted_state` are executable by `service_role` only;
    `chat_state_can_transition` and the internal function are not executable by `anon`/`authenticated`;
    the transition function returns the expected results; a smoke call with an unknown session id
    returns `session_not_found`/`invalid_state` and touches no rows.
  - History drift: applied versions use dashboard/tool timestamps, not the repo filenames, and the history
    has `pin_set_updated_at_search_path` with no repo file. `supabase db push` would try to re-run
    unrecorded migrations; use the MCP/SQL editor or reconcile the history first.
  - Not yet exercised end to end: production deployed this code from `main` on 2026-09-30, but no chat has run against the new functions yet (all existing
    sessions are still `state = 'new'`).
- Requires `SUPABASE_SERVICE_ROLE_KEY` in the server environment; without it state updates report
  `"failed"`. It is set in Production (not in Preview).
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

1. Migration history in Supabase is out of sync with the repo (see above); the deployed code that calls
   `chat_apply_state` may not be live yet.
2. `chat_log_message` and legacy `chat_record_outcome` remain callable with the anon key (unchanged).
   `chat_record_outcome` can set `recommended_plan` / `handoff` for any known session UUID. Untouched
   by the stabilization on purpose.
3. Human handoff is a status flag only (`handoff_status = 'requested'`); no notification exists.
4. `handoff_summary` stores the visitor's raw message (≤500 chars) and could contain contact details the
   visitor typed.
5. Two overlapping outcome models (`recommended_plan`/`handoff` and `booking_status`/`handoff_status`).
6. Concurrent requests on one session can interleave state writes (last write wins under the row lock).
