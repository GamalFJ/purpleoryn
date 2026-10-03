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
- [~] **T3c — Intent flips on a stray keyword.** Implemented in Step 5 (strong/weak active-flow rule; offline harness passes, including
  the exact live case "comprar uno de sus servicios" during booking). Verify live in T9 (item 14).

- [x] **T3d — Autoridad button verified live (2026-10-01).** Original check: retest the Autoridad button once deployed: a sales chat that ends in an Autoridad recommendation shows "Hablar de
  Autoridad" (opens cal.com with the plan prefilled, not the order form); a Conversión or Presencia recommendation still shows
  "Elegir <plan>" and opens the form.

- [~] **T9 partial results (live, 2026-09-30, deploy b9faffd; owner tested two chats).** Passed: items 4, 5, 6, 11 (one question at a time,
  qualification stored with whitelisted fields only, `recommended_plan = autoridad` / `plan_recommendation`, "Si por favor"/"claro" keep the intent
  and hold the state, no state errors); items 9-10 passed on the text (the Autoridad reply says the button lets the visitor pick day and hour,
  never claims a booking) but the button label and link were not checked. Found and fixed in D17: the booking chat was switched to sales by a
  plan-fit phrase and never got the call button; the model wrote fake markdown cal.com links. Still untested: 1-3, 7, 8, 12-20.
- [x] **T9b — D17 fixes retested live (see T9c).** Original checks: Retest the D17 fixes live (fresh tab each): (a) "Quiero agendar una llamada" → answer the goal with "una asesoría para saber qué
  plan me conviene" → the chat stays in booking and shows the real Cal.com button; `chat_sessions.intent` stays `booking`; (b) after an Autoridad
  recommendation, answer "claro" → no raw `[text](url)` in the reply, it points to the existing "Hablar de Autoridad" button; (c) no reply ever
  contains a markdown link.

- [~] **T9 round 3 results (live, 2026-09-30, deploys b9faffd/ce57391; owner tested four more chats and the admin page).** Verified: 2, 3, 4, 5, 6,
  9-10 (text), 11, 13, 15, 16, 17 (no false claims; WhatsApp number was missing, fixed in D18), 18 (screenshots of the detail page; the list line
  "state · intent" was not shown), 20. Not verified live: 1 (only "Hola"), 7/8 (button labels and links are not visible in the database), 12,
  14, 19 (needs a hand-edited row). Defects found and fixed in D18: negated/plural "agendar citas" read as a call request, "no sé cuál me
  convendría" not read as which-plan, markdown asterisks in replies, the ROI input assumed from a unit price.
- [x] **T9c — Live retest of D17/D18: DONE (2026-09-30 and 2026-10-01, production 10f75be).** Fresh tab per script; results read from `chat_sessions` /
  `chat_messages` and confirmed by the owner for what the database cannot show (buttons).
  1. **Booking stays booking when asked which plan fits:** PASS (intent stayed `booking`, call button shown).
  2. **No fake links after Autoridad + "claro":** PASS.
  3. **No Markdown/asterisks, exact prices:** PASS.
  4. **Handoff reply:** PASS (includes +1 809-603-4113, no "notified" claim).
  5. **Negation and plural booking detection:** PASS ("agendar citas" does not start booking; a real request still does).
  6. **ROI asks for the value of one purchase first:** PASS (then 3000 pesos gave Presencia RD$33,499.87 / 12 / 34 / 3).
  Batch 2 (2026-10-01):
  - **G, order-form link:** PASS. A business with a website but no Google profile ended `plan_recommendation` with `recommended_plan = conversion`;
    the owner confirmed the "Elegir Conversión" button opens the order form with the plan preselected (T9 item 8). The Presencia button is covered by check 6's chat.
  - **H, sales → booking:** PASS (intent `booking` after "Mejor quiero agendar una llamada", one call question, stayed `booking`, ended `booking_offered`
    with the call button; T9 item 12).
  - **J, weak keyword inside booking:** PASS (intent stayed `booking` on "Quiero comprar uno de sus servicios"; T9 item 14).
  - **K, receptionist and unknown question:** PASS (service area Santo Domingo / Este / Oeste, no Miami office invented; T9 item 15).
  Also confirmed by the owner: "Hablar de Autoridad" opens Cal.com (T3d, T9 item 9); the admin list line "state · intent" and the detail page display correctly (T9 item 18).
  **Still not verified live:** T9 item 19 (rejected transition; needs a hand-edited row) and T9 item 1 (only "Hola" was ever sent as a first message).
  Small issues seen, not fixed (owner has not asked): the Conversión reply called the plan "Conversion" (no accent) and its feature wording should be checked
  against `tiers`; the booking call button appears before timing is asked; "Ya registré tus datos" slightly overstates; the model sometimes states a plan in
  prose without calling `recommend_plan`; classifier quirks ("¿Qué planes tienen?" starts sales; "agendar visitas"/"reuniones" can start booking).
- [x] **T10 — Production runs the rotated OpenRouter key (2026-10-01).** Production deployment 25480f5 (created after the 00:31 UTC env edit) is READY and
  production chats answered during T9c. The old key was committed nowhere.

- [ ] **T11 — Live retest of the D19 prompt rules on `gpt-4o-mini`.** Scripts G and H (fresh tab each). Pass: a plan button appears in the same turn as the
  recommendation; the reply includes the exact price and the break-even; no reply asks permission to show a button; in H, where the visitor skips the website
  question, `chat_sessions.qualification` holds only `business_type`, `goal` and `timing` (no `has_website`, `has_google_profile` or
  `appointments_or_orders`); the call is not offered before the pending question is answered.

- [x] **T12 - Brain phase 1 (2026-10-02):** migration `20261002000000_chat_flow.sql` applied and verified in the Purple Cove Labs Website project (`flow` column, `'offered'` handoff status, `chat_apply_state` with `p_flow`; anon has no execute rights; the old call style still resolves). Code: `lib/agent/plan-rubric.ts` (D21), `lib/agent/flow.ts`, the new qualification keys (D22). No live behavior change. Next phases: tools (`handoff_whatsapp`, `show_page`) and guards, then the prompt rewrite in usted (D20), then chips, lead score and alerts.

- [ ] **T13 - Brain phase 2 live check (2026-10-02, code in D23).** After deploy, fresh tab each: (a) Script H with "Mejor quiero agendar una llamada" at message 3 -> `qualification` has no `has_website`, `has_google_profile` or `appointments_or_orders` (E1); (b) "prefiero hablar con una persona" -> a WhatsApp button that opens a prefilled message with no phone or email in it, `handoff_status` is `offered` or `requested`, one Telegram alert, none on a second ask; (c) "¿Dónde puedo ver el documento del sistema?" -> a `show_page` button; (d) an Autoridad recommendation chat -> one Telegram alert when the call button is shown; (e) in a recommended chat answer "está caro" and then "lo voy a pensar" -> `flow.sales_stage` is `objection_1` then `objection_2`; (f) no reply asks permission to show a button or says it registered data. Check `flow` and `handoff_status` in `chat_sessions`.

- [ ] **T14 - Brain phase 3 live check (2026-10-02, D24 and D25).** Run the replay scripts of the contract (section F) with `node scripts/oryn-replay.mjs`, or by hand, fresh tab each. Must pass first: B1, B2, B3, A1, H1, S1, V1 (no "tú"), C1 and D1. Read `chat_sessions.flow` and `qualification` for each. Known risks to look for: the agent asking the same question twice; a plan recommended with no `customer_interaction` saved; "tú" forms; a receptionist that never makes the offer; a recommendation reply that is too long.

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

## Step 5 — Unified Oryn AI orchestration (implemented in code 2026-09-30; NOT yet verified live)

- [x] **T4** — Design recorded as D16 (owner approved: qualification memory and admin view in; handoff alert out).
- [x] **T5** — `lib/agent/orchestrator.ts` (pure) + fallback; the three original tools unchanged.
- [x] **T6** — Addendum per capability fed into the prompt; state and qualification are now model inputs.
- [x] **T7** — Admin conversations show `state`, `intent`, `booking_status`, `handoff_status`, last error, qualification (read-only).
- [x] **T8** — ARCHITECTURE, CURRENT-STATE, DECISIONS, ROADMAP, TASKS updated.
- [ ] **T9 — Live verification after deploy** (Spanish, fresh tab per scenario unless noted; then read `chat_sessions` in Supabase):
  1. "¿A qué se dedican?" → Dominican Spanish answer from approved facts; `capability: receptionist`.
  2. "¿Qué servicios ofrecen?" → services from the facts, no invented claims.
  3. "¿Cuánto cuestan los planes?" → exact prices with decimals.
  4. "¿Qué plan me conviene?" → `intent = sales`, one question at a time.
  5. Give business context → `chat_sessions.qualification` holds only the whitelisted fields (no contact details).
  6. Reach a recommendation → `recommended_plan` set, `state = plan_recommendation`.
  7. Presencia recommendation → "Elegir Presencia", opens the order form.
  8. Conversión recommendation → "Elegir Conversión", opens the order form.
  9. Autoridad recommendation → "Hablar de Autoridad", opens Cal.com with the plan prefilled.
  10. Autoridad text never says a booking was made.
  11. "Sí" / "Claro" after a question keeps the intent.
  12. Sales → "Mejor quiero agendar una llamada" → `intent = booking`.
  13. Booking → "Prefiero hablar con una persona" → `intent = human_handoff`, state `human_handoff_requested`.
  14. During booking answer "comprar uno de sus servicios" → intent stays `booking`.
  15. An unknown question (e.g. an office in another country) → safe answer, no invention.
  16. Booking chat: never says scheduled/confirmed; `booking_status` stays `offered`.
  17. Handoff chat: gives the WhatsApp number/call button, never says anyone was notified, no response times.
  18. Admin → Conversations: list shows state · intent; detail shows the status fields and qualification.
  19. Rejected transition (only reproducible by editing a row by hand) → `stateUpdate: "rejected"`, stored state unchanged.
  20. Existing chat still works end to end (greeting chips, ROI card, rate limits).

## Later (each needs its own decision entry)

- Human-handoff tool + alert channel.
- Cal.com webhook/API → `chat_apply_trusted_state` for `booking_confirmed`.
- Decide what to do about the anon-callable legacy RPCs (`chat_record_outcome`).
