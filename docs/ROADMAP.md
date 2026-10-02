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
- **Step 4b — Stabilization (commits a77c437, 1b489b9):** database-authoritative transitions, service-role-only
  state RPCs with a separate trusted path, rejections reported instead of swallowed, affirmation
  intent inheritance, shared project docs (`/docs`, `CLAUDE.md`, `MANUS.md`).

- **Step 4c — Autoridad recommendation opens the call booking** (D15; verified live 2026-10-01) and chat-behavior fixes (D14, verified live).
- **Step 5 — Unified Oryn orchestration: implemented in code** (D16): orchestrator, four capabilities, tool gating, qualification
  memory, stronger intent switching, read-only admin fields, safe fallback. **Live verification pending** (TASKS.md T9).

## Current

- **Step 5 is deployed to production** (latest commit 10f75be, deployment READY). **T9c (live retest of D17/D18) and T10 (rotated OpenRouter key) are done and recorded in TASKS.md.** Not verified live: T9 items 1 and 19.

## Next

- T9c is complete, so new work can start with the owner's go-ahead. Candidates, each needing the owner's go-ahead and a decision entry: the human-handoff
  notification, the Cal.com webhook/API, and reconciling the Supabase migration history.

## Future (not started, each needs a decision entry first)

- Human handoff that actually notifies a person (tool + alert), e.g. Telegram or WhatsApp.
- Cal.com API/webhook integration so a booking can be verified and `booking_confirmed` reached via
  `chat_apply_trusted_state`.
- Optional link between a chat session and a formal lead/order (currently separate, decision D11).
- Additional providers (`anthropic`, `gemini` are named in types but not implemented).
- Kapso — only if explicitly adopted (decision D10).
- Tests: the repo has no test runner; add one only with the owner's approval.
