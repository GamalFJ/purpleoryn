# Roadmap — Oryn conversational AI

Ordering is fixed; details of the immediate work are in [TASKS.md](TASKS.md). Steps 1–4 numbering
follows the original handoff plan.

## Completed

- **Step 1 — Repository audit.**
- **Step 2 — Architecture design** (one system, four capabilities; extend, don't replace).
- **Step 3 — Provider layer:** OpenRouter provider, hardened OpenAI provider, `AI_PROVIDER` selection
  with fallback (`lib/ai/*`).
- **Step 4 — Conversation state and intent:** state/intent columns on `chat_sessions`, deterministic
  intent classifier, state persisted by `/api/chat`.
- **Step 4b — Stabilization (this commit):** database-authoritative transitions, service-role-only
  state RPCs with a separate trusted path, rejections reported instead of swallowed, affirmation
  intent inheritance, shared project docs (`/docs`, `CLAUDE.md`, `MANUS.md`).

## Current

- **Blockers before Step 5** (see TASKS.md T1–T3): apply and verify the two chat-state migrations in
  the purpleoryn Supabase project, confirm `SUPABASE_SERVICE_ROLE_KEY` and `AI_PROVIDER` in the
  deployed environment, and manually exercise the chat state flow end to end.

## Next

- **Step 5 — Unified Oryn AI orchestration.** One layer inside `/api/chat` that uses the stored
  state and last message to choose the active capability, a state-specific prompt addendum and the
  allowed tools. Reuses the current route, tables and tools.
- Surface state where it is useful without redesigning anything: admin conversation list shows
  `state` / `intent` / handoff status (small, read-only).

## Future (not started, each needs a decision entry first)

- Human handoff that actually notifies a person (tool + alert), e.g. Telegram or WhatsApp.
- Cal.com API/webhook integration so a booking can be verified and `booking_confirmed` reached via
  `chat_apply_trusted_state`.
- Structured qualification stored in `chat_sessions.qualification` (column exists, unused).
- Optional link between a chat session and a formal lead/order (currently separate, decision D11).
- Additional providers (`anthropic`, `gemini` are named in types but not implemented).
- Kapso — only if explicitly adopted (decision D10).
- Tests: the repo has no test runner; add one only with the owner's approval.
