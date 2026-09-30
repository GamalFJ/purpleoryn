# Tasks

Immediate development sequence. Keep this list short and current; move finished items to
[ROADMAP.md](ROADMAP.md) "Completed" and update [CURRENT-STATE.md](CURRENT-STATE.md).

## Before Step 5 (owner / environment — blockers)

- [x] **T1 — Migrations applied and verified (2026-09-30)** in the "Purple Cove Labs Website" project
  (`vmrsgltwsznyfnihfefu`). Chat-state columns were already present; the hardening migration was applied;
  grants verified (see CURRENT-STATE.md). Open follow-up: reconcile the migration history (chat_state and
  document_uploads applied but unrecorded).
- [x] **T2 — Deployed env checked (2026-09-30):** Production has `SUPABASE_SERVICE_ROLE_KEY`, `AI_PROVIDER`, `OPENROUTER_API_KEY` (OpenAI key removed); Preview has none of them (add them only if Preview testing is wanted).
- [x] **T3 — State flow verified live (2026-09-30).** Real chats stored the expected states with no errors; `anon`/`authenticated`
  have no execute rights on the state functions (checked in the database). Not exercised: checks 5 and 6 below (Preview-only failure tests).
- [x] **T3b — Chat-behavior fixes retested live (2026-09-30, deploy 01cc6ae).** Real-estate sales chat: one question at a time, asked about
  appointments/orders, recommended Autoridad, ROI correct (RD$70,999.87), `intent = sales` held across 7 turns, ended
  `plan_recommendation` with `recommended_plan = autoridad`. Booking chat: one question at a time, never claimed to schedule, said the
  button lets the visitor pick the time, ended `booking_offered` + `handoff = cal_com`. One flaw: see T3c.
- [ ] **T3c — Intent flips on a stray keyword.** In the booking chat, "comprar uno de sus servicios" contained "servicios", so the stored
  intent switched booking → services (final row: `intent = services`, `state = booking_offered`). State was still right. Address in Step 5
  (e.g. only switch away from an active flow on a strong topic).

- [ ] **T3d — Retest the Autoridad button** once deployed: a sales chat that ends in an Autoridad recommendation shows "Hablar de
  Autoridad" (opens cal.com with the plan prefilled, not the order form); a Conversión or Presencia recommendation still shows
  "Elegir <plan>" and opens the form.

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
