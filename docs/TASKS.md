# Tasks

Immediate development sequence. Keep this list short and current; move finished items to
[ROADMAP.md](ROADMAP.md) "Completed" and update [CURRENT-STATE.md](CURRENT-STATE.md).

## Before Step 5 (owner / environment — blockers)

- [x] **T1 — Migrations applied and verified (2026-09-30)** in the "Purple Cove Labs Website" project
  (`vmrsgltwsznyfnihfefu`). Chat-state columns were already present; the hardening migration was applied;
  grants verified (see CURRENT-STATE.md). Open follow-up: reconcile the migration history (chat_state and
  document_uploads applied but unrecorded).
- [ ] **T2 — Confirm deployed env:** `SUPABASE_SERVICE_ROLE_KEY` set (state writes need it);
  `AI_PROVIDER` / `OPENROUTER_API_KEY` set as intended (unset `AI_PROVIDER` = OpenAI first).
- [ ] **T3 — Manual check of the state flow** on a preview deployment (checklist below).

### T3 manual checklist

1. First message "Quiero agendar una llamada" → reply + call button; response `stateUpdate: "ok"`,
   `state: "booking_offered"`; `chat_sessions.state` matches.
2. In a fresh session: "¿Qué plan me conviene?" → intent `sales`; after the assistant recommends a plan,
   `state: "plan_recommendation"` and `recommended_plan` set (this used to be silently rejected).
3. After a booking/sales question, send "Sí" or "Claro" → `intent` unchanged (inherited), not `unknown`.
4. With the anon key, call `rpc('chat_apply_state', …)` directly → permission denied.
5. Disable the service-role key on a preview → chat still replies, `stateUpdate: "failed"`.
6. Break the provider key on a preview → 502 fallback, `state: "external_failure"` (or kept state),
   `last_error_code = 'provider_failure'`.

## Step 5 — Unified Oryn AI orchestration (not started; needs go-ahead)

- [ ] **T4** — Design note first (append to DECISIONS.md): where the orchestrator lives
  (`lib/agent/`), its input (stored state + last message), its output (active capability, prompt
  addendum, allowed tools), and how it stays inside the existing route and tables.
- [ ] **T5** — Implement the orchestrator; keep the three current tools working unchanged.
- [ ] **T6** — Feed state into the prompt (state-specific addendum); keep Dominican Spanish output and the
  no-invented-facts rules.
- [ ] **T7** — Small read-only admin surfacing of `state`, `intent`, `handoff_status`.
- [ ] **T8** — Update CURRENT-STATE.md and ARCHITECTURE.md.

## Later (each needs its own decision entry)

- Human-handoff tool + alert channel.
- Cal.com webhook/API → `chat_apply_trusted_state` for `booking_confirmed`.
- Structured qualification into `chat_sessions.qualification`.
- Decide what to do about the anon-callable legacy RPCs (`chat_record_outcome`).
