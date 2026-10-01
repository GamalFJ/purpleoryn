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

- [ ] **T3d — Retest the Autoridad button** once deployed: a sales chat that ends in an Autoridad recommendation shows "Hablar de
  Autoridad" (opens cal.com with the plan prefilled, not the order form); a Conversión or Presencia recommendation still shows
  "Elegir <plan>" and opens the form.

- [~] **T9 partial results (live, 2026-09-30, deploy b9faffd; owner tested two chats).** Passed: items 4, 5, 6, 11 (one question at a time,
  qualification stored with whitelisted fields only, `recommended_plan = autoridad` / `plan_recommendation`, "Si por favor"/"claro" keep the intent
  and hold the state, no state errors); items 9-10 passed on the text (the Autoridad reply says the button lets the visitor pick day and hour,
  never claims a booking) but the button label and link were not checked. Found and fixed in D17: the booking chat was switched to sales by a
  plan-fit phrase and never got the call button; the model wrote fake markdown cal.com links. Still untested: 1-3, 7, 8, 12-20.
- [ ] **T9b — Retest the D17 fixes live** (fresh tab each): (a) "Quiero agendar una llamada" → answer the goal with "una asesoría para saber qué
  plan me conviene" → the chat stays in booking and shows the real Cal.com button; `chat_sessions.intent` stays `booking`; (b) after an Autoridad
  recommendation, answer "claro" → no raw `[text](url)` in the reply, it points to the existing "Hablar de Autoridad" button; (c) no reply ever
  contains a markdown link.

- [~] **T9 round 3 results (live, 2026-09-30, deploys b9faffd/ce57391; owner tested four more chats and the admin page).** Verified: 2, 3, 4, 5, 6,
  9-10 (text), 11, 13, 15, 16, 17 (no false claims; WhatsApp number was missing, fixed in D18), 18 (screenshots of the detail page; the list line
  "state · intent" was not shown), 20. Not verified live: 1 (only "Hola"), 7/8 (button labels and links are not visible in the database), 12,
  14, 19 (needs a hand-edited row). Defects found and fixed in D18: negated/plural "agendar citas" read as a call request, "no sé cuál me
  convendría" not read as which-plan, markdown asterisks in replies, the ROI input assumed from a unit price.
- [ ] **T9c — Live retest of D17/D18. OUTSTANDING: deferred by the owner ("we will fix that later"); no live results are recorded.** Fresh tab per check,
  then read `chat_sessions` in Supabase. The six required checks:
  1. **Booking stays booking when asked which plan fits:** "Quiero agendar una llamada", answer the goal with "una asesoría para saber qué plan me conviene" →
     stays in booking, shows the real Cal.com button, `intent` stays `booking`.
  2. **No fake links:** after an Autoridad recommendation answer "claro" → the reply contains no link text and points to the existing button.
  3. **No Markdown/asterisks:** no `**`, `*`, `#` or `[text](url)` in any reply (try the plans list and the pricing answer).
  4. **Correct WhatsApp number in handoff:** "prefiero hablar con una persona" → the reply includes +1 809-603-4113, claims nobody was notified, gives no response time.
  5. **Negation and plural booking detection:** "no es necesario agendar citas" and "quiero un sitio web donde puedan agendar citas" do NOT start booking;
     "Quiero agendar una llamada" still does.
  6. **ROI asks for the value of one purchase first:** "vendo 2 cajas de 12 al día, la unidad a 250 pesos" → the assistant asks what a customer spends in one
     purchase or order before any ROI numbers, and says "ventas", not "unidades".
  **Still UNVERIFIED live from earlier rounds (do not mark verified until seen):** the exact "Hablar de Autoridad" button label and its Cal.com link; a Conversión
  recommendation showing "Elegir Conversión" and opening the order form (T9 item 8); the sales → booking transition (T9 item 12); the admin conversations **list**
  line "state · intent" (T9 item 18; the detail page was verified by screenshots). Also not covered: T9 items 1, 14 and 19.
- [ ] **T10 — Production must run the rotated OpenRouter key.** The owner rotated the key; `OPENROUTER_API_KEY` was edited in Vercel on 2026-10-01 00:31 UTC, which is
  after production deployment `10f75be` (2026-09-30 23:43 UTC) was created. Env changes apply only to new deployments, so confirm a production deployment created
  after the edit is READY and that a test chat still answers. (The old key was committed nowhere; a real key was only ever in an uncommitted local edit of
  `.env.example`, now reverted.)

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
