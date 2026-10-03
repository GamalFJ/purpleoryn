# Decisions

Append-only log. Newest at the bottom. Each entry: decision, why, consequence. To reverse one,
add a new entry that supersedes it; don't edit history. Dates are when the decision was recorded
in this file (some were made earlier in chat or in the code).

## D1 — One conversational AI system, four capabilities
**Decision:** Oryn is a single conversational system with four capabilities (AI Receptionist, AI
Sales Agent, AI Booking Agent, Human Handoff). Not separate agents, APIs, databases or widgets.
**Why:** One conversation, one context, one place to log and rate-limit; avoids parallel systems
drifting apart. **Consequence:** New behavior extends `/api/chat`, `lib/agent/*` and `chat_sessions`.
Never add a second chatbot, a second chat API or a second conversation store.

## D2 — Provider abstraction stays
**Decision:** All model calls go through `lib/ai` (`ChatProvider`, `chatWithFallback`). The chat route
and tools know no vendor. **Why:** Providers change; the agent must not. **Consequence:** New provider =
new file in `lib/ai/` + entry in `configuredProviders()`.

## D3 — OpenRouter is the intended runtime provider; OpenAI is preserved
**Decision:** OpenRouter is the primary runtime provider, selected with `AI_PROVIDER=openrouter`.
The OpenAI provider is kept, as fallback (or primary with `AI_PROVIDER=openai`).
**Note:** with `AI_PROVIDER` unset the code is OpenAI-first (backward compatible). Which value is set in
production could not be verified from the repository. **Consequence:** don't remove OpenAI; don't assume
the deployed environment matches `.env.example`.

## D4 — GitHub is the source of truth
**Decision:** The repository — code plus `/docs`, `CLAUDE.md`, `MANUS.md` — is the only source of truth
for product, architecture, decisions, roadmap, state and tasks. **Why:** Claude Code and Manus alternate
on this project and must not depend on chat history. **Consequence:** inspect the repo before coding;
update [CURRENT-STATE.md](CURRENT-STATE.md) when implementation materially changes; record new decisions here.

## D5 — Supabase is the conversation state store
**Decision:** Conversation lifecycle (state, intent, booking/handoff status) lives on the existing
`chat_sessions` row. **Consequence:** no parallel store.

## D6 — The database is authoritative for state transitions
**Decision:** Allowed transitions are decided in SQL (`chat_state_can_transition`) against the state
stored on the row, inside the write RPC. The API keeps no copy of the table and never derives the
"previous state" from the new message. Rejections keep the previous state, are recorded in
`last_error_code`, and are reported as `stateUpdate: "rejected"`. **Why:** the first Step 4 version
checked transitions client-side from an intent-derived state and let failures disappear into logs.

## D7 — Privileged state values are server-trusted only
**Decision:** `booking_confirmed`, `completed`, `booking_status = 'confirmed'` and
`handoff_status = 'completed'` are reachable only through `chat_apply_trusted_state`. All state
functions are service-role only; `anon`/`authenticated` cannot execute them. The visitor-driven route
uses `chat_apply_state`, which refuses those values. **Why:** the public anon key must not be able to
mark a booking confirmed or a handoff done. **Consequence:** a future verified event (for example a
validated Cal.com webhook) calls the trusted RPC from server code using the service-role key only.

## D8 — Intent handling stays deterministic for now
**Decision:** `classifyIntent` remains regex-based; the only context rule is that a bare affirmation
continues the stored intent (`resolveIntent`). No AI classifier yet. **Consequence:** an unrelated
mid-flow answer ("tengo una ferretería") still classifies as `unknown`; revisit in orchestration.

## D9 — Cal.com is the current booking provider
**Decision:** Booking is a Cal.com link (`CAL_URL`), offered by the `offer_call` tool.
**Consequence:** there is no way to know a booking happened until a webhook/API integration exists;
`booking_confirmed` is therefore unreachable today by design.

## D10 — Kapso is not implemented
**Decision:** Kapso is not part of the repository and must not be described as implemented. Any
future adoption needs its own decision entry first.

## D11 — Formal leads stay separate from chat
**Decision:** `/servicios` order submissions (`leads`, orders, Telegram alert) and `market_leads`
are separate from chat sessions. Chat does not create leads or orders. **Consequence:** linking the two
requires an explicit new decision and design.

## D12 — Language and business-information rules
**Decision:** Client-facing AI output is Dominican Spanish; admin/developer content is English. The
assistant never invents business information; prices are quoted exactly, with decimals, as `RD$`.

## D13 — `main` is the only branch; no PRs
**Decision (2026-09-30):** All work is committed directly on `main` and pushed; Vercel deploys from `main`.
No feature branches, no PRs. All previous branches were deleted; the only unmerged legacy commits were kept
as tags (`archive/presencia-digital-express`, `archive/faq-pedido-formal`). **Why:** same reasoning as the
Signatura Creativa repo — PRs were never reviewed before merging, so they only added friction and made it
hard to tell which branch was current. **Consequence:** no per-PR preview build as a dry run; commit only
when the owner asks, and run typecheck/lint/build first.

## D14 — Chat behavior fixes after the first live tests (supersedes the "affirmation only" part of D8)
**Decision (2026-09-30):** Live tests showed (1) the assistant claimed it had scheduled a call when it only shows a
Cal.com button, (2) it asked several questions in one message on the booking path, (3) it recommended the
highlighted plan for a business that needs appointment booking instead of the only plan whose agent books
appointments, and (4) keyword-free qualification answers reset the stored intent to `unknown`. Fixes: prompt rules
(cannot book anything; one question at a time; plan chosen from the plan facts, "Recomendado" is only a default),
`offer_call` result states nothing was booked, and any message that names no topic continues the stored intent and
holds a stored state. **Consequence:** still deterministic (no AI classifier). Booking remains link-only; the
"Elegir <plan>" button for Autoridad opens the order form while the site's own Autoridad CTA opens the call
booking — an open product question, not changed here.

## D15 — A plan sold by call sends the chat visitor to the call booking
**Decision (2026-09-30, owner approved):** `recommend_plan` follows the plan's own call to action on the site
(`TIER_CTA` in `lib/tiers.ts`). For a plan whose action is "call" (today Autoridad) the chat button is "Hablar de
Autoridad" and opens the Cal.com booking (plan and notes prefilled, `cal_click` tracked); for the other plans it stays
"Elegir <plan>" and opens the order form. The prompt and the tool result say so, and that nothing is booked or ordered.
**Consequence:** the rule lives in one place (`TIER_CTA`); changing a plan's action there changes site, chat button and prompt.
The stored state for such a recommendation is still `plan_recommendation` (not `booking_offered`); revisit in the orchestration step.

## D16 — Unified orchestration: one pure orchestrator, capabilities, tool gating, qualification memory
**Decision (2026-09-30, owner approved):** `lib/agent/orchestrator.ts` decides, per turn, the capability (receptionist, sales, booking,
human handoff), a short prompt addendum and the allowed tools from the stored state/intent/qualification and the last message. It stays
inside `/api/chat`, `chat_sessions` and the current tools; it is not a second chatbot, API or store. The database remains the state
authority (no TypeScript copy of the transition table). Tool gating: receptionist `calculate_roi` + `record_qualification`; sales adds
`recommend_plan`; booking `offer_call` + `record_qualification`; handoff `offer_call` only (no notification or confirmation tool exists).
Intent switching: inside an active flow only strong changes switch (book, person, which-plan, explicit price question from booking/handoff).
Qualification memory uses the existing `chat_sessions.qualification` column through `chat_apply_state` (no migration), with a whitelist,
length caps and contact-detail filtering; its purpose is continuity, not lead creation. The handoff capability keeps
`human_handoff_requested` when it offers the call button. If planning throws, `/api/chat` falls back to the pre-orchestration behavior.
**Consequences:** one extra model round when the visitor gives a new fact (`record_qualification`); a rejected state change drops that turn's
qualification; receptionist mode cannot show a call button (the visitor must ask to book, which switches capability). Out of scope and
still true: no handoff notification, no Cal.com webhook, no `booking_confirmed`, no lead creation from chat.

## D17 — Fixes to D16 after the first live Step 5 tests (supersedes the "which-plan" part of D16's intent switching)
**Decision (2026-09-30):** (1) Asking which plan fits no longer leaves booking or handoff. In a live booking chat the visitor's call goal
was "una asesoría para saber cuál plan más me conviene"; the old rule switched to sales, which has no call button, so the visitor asking
for a call never got one. Strong changes out of an active flow are now only: asking to book, asking for a person, and an explicit price
question (from booking/handoff). (2) Every capability addendum, and the base prompt, now forbid writing links, URLs or markdown and forbid
saying a button is shown unless a tool showed it this turn; after a recommendation or an offered call the model points to the button that is
already shown. The live chats had produced fake `[...](https://cal.com)` links and "el siguiente botón" with no button. (3) The base prompt
defers question order to the "next question" in the ACTIVE CAPABILITY section (it had asked about a website before appointments/orders).
**Consequence:** a visitor who is booking cannot get a plan recommendation without finishing or leaving the booking (by asking for a
person or a price); accepted, because booking is the higher-stakes flow. Verified offline (harness) and pending a live retest (TASKS.md T9b).

## D18 — Classifier false positives, plain-text guard, handoff number, per-sale ROI question (after live round 3)
**Decision (2026-09-30, owner approved):** Live chats showed (1) "no es necesario agendar citas" and "un sitio web donde puedan agendar
citas" were read as a request for a call, (2) "no sé cuál me convendría" was not read as wanting a plan, (3) the model kept writing
markdown (`**Presencia**`) although the UI is plain text, (4) the handoff reply omitted the WhatsApp number, and (5) for "vendo 2 cajas de
12 al día, la unidad a 250 pesos" the assistant silently used the unit price (RD$250) as the average sale and reported "134 unidades".
Fixes: booking detection now needs a real request for a call (agendar/reservar/programar not followed by a plural object such as "citas",
"llamada" not "llamadas", "reunión", "cal.com", "calendario", singular "cita"); text after a negation ("no", "ni", "sin", up to a comma,
"pero" or "gracias") is ignored for booking and handoff detection; "convendría", "no sé cuál", "cuál me", "ayúdame a elegir/escoger/decidir"
count as a which-plan question; `toPlainText()` (`lib/agent/plain-text.ts`) strips markdown (bold, italics, headings, code, markdown links)
from every reply server-side; the handoff addendum now contains the WhatsApp number from `SITE.phoneDisplay`; and the ROI method stays
**per sale** (owner chose option a): if the visitor gives a unit price, a volume or a daily/monthly total, the assistant asks ONE question
about what a customer spends in one purchase or order, does not call `calculate_roi` until it has that, and says "ventas" (not
"unidades") unless a sale is one unit. **Not done (would be a new method, needs its own decision):** a volume-based ROI estimate.
**Consequences:** "servicios" inside "empresa de servicios de data" is still a weak services keyword (harmless outside an active flow);
the plain-text guard also removes the URL of any markdown link, so URLs must be written plainly; the deterministic fixes are verified
offline only. The owner deferred the remaining live T9 checks (see TASKS.md).

## D19 — Runtime model stays `openai/gpt-4o-mini`; prompt rules after the model trials (2026-10-02)
**Decision (owner approved):** Two models were tried in production through `AI_MODEL`. `anthropic/claude-sonnet-5.5` used far more tokens and
a turn failed with an OpenRouter 4xx (`provider_failure`; the status is not logged, so the cause is unknown). `openai/gpt-4.1-mini` was stable
and stated plan facts correctly (Autoridad is the only plan whose agent agenda citas and toma pedidos), but in Scripts G and H it saved
qualification fields the visitor never gave (`has_website: false`, `has_google_profile: false`, `appointments_or_orders: "neither"`), asked
permission to show the button instead of pointing to it, looped after "Sí, por favor", and gave no price or break-even. Production `AI_MODEL`
was set back to `openai/gpt-4o-mini` (the default). The same prompt gaps are fixed in the prompt, not by the model: `SAVE_FACTS` and the
`record_qualification` description say to save only what the visitor stated and never default a skipped answer; a `BUTTON_RULE` forbids asking
permission to show a button; the sales "enough to recommend" step requires `recommend_plan` in the same turn, the exact plan prices and the
`calculate_roi` break-even in the reply, and never recommending a plan in prose without the tool; the booking step says not to mention the
button until the pending question is answered. **Consequences:** these are prompt rules the model can still ignore; there is no server-side
guard on saved qualification values (a possible follow-up in `lib/agent/qualification.ts`). The earlier `gpt-4o-mini` reply that Conversión
"toma pedidos" contradicted `tiers` (Conversión has lead scoring and 24-hour follow-up). Live retest of G and H is pending (TASKS.md T11).

## D20 — The chat speaks "usted" (2026-10-02, owner approved)
**Decision:** Oryn addresses visitors as "usted" (su, le), not "tú". Business owners are the audience and the register fits a front desk that
sells to them. **Scope and timing:** the prompt, the static greeting and the launcher label ("Pregúntale a Oryn") change together in the prompt
rewrite phase, not before, so a visitor never sees two registers; the project CLAUDE.md line that says "tú" is updated in that same change.
**Consequence:** until then the live chat still uses "tú".

## D21 — Plan choice is made in code from the visitor's business reality (2026-10-02, owner approved; supersedes the model-picks-from-rows rule)
**Decision:** `choosePlan()` (`lib/agent/plan-rubric.ts`) picks the plan from `customer_interaction`, what the visitor wants the agent to do with
their own customers: `presence_only` (a digital presence plus answering a few questions, e.g. a launch or start-up) gives Presencia;
`qualify_followup` gives Conversión; `agent_completes` (the agent books or takes orders by itself) gives Autoridad once `business_model`
(products, services or both) is known; `unsure` gives Conversión. **There is no default plan:** with no `customer_interaction` the result is null
and the agent keeps asking. The model explains the choice and may not pick another; `recommend_plan` will refuse a different plan in the tools
phase. **Consequence:** the reasons in the rubric must stay consistent with the `tiers` rows; the sales question order and the prompt text that
use the rubric ship in a later phase, so today's live behavior is unchanged.

## D22 — Flow bookkeeping column, new qualification keys, 'offered' handoff status (2026-10-02, owner approved migration)
**Decision:** Migration `20261002000000_chat_flow.sql` adds `chat_sessions.flow` (jsonb object: `sales_stage`, `pending_offer`, `failed_turns`,
`demo_line_used`), kept apart from `qualification` because it is not something the visitor said and `sanitizeQualification` drops unknown keys.
`handoff_status` accepts `'offered'` (the WhatsApp handoff button was shown); `'completed'` stays trusted-path only. `chat_apply_state` and
`chat_apply_trusted_state` take an optional `p_flow`; privileged-value rules and the transition table are unchanged. Three qualification keys are
added: `pain` (what is not working, 120 characters), `business_model` and `customer_interaction`. `/api/chat` reads `flow`, advances
`sales_stage` to `recommended` when a plan button is shown, and writes `flow` only when it changed. **Deploy order:** apply the migration first;
old code keeps working because it calls the RPC with named parameters. **Consequences:** the new keys are not yet in the `record_qualification`
tool schema or the prompt, so nothing writes them until the prompt phase; the Supabase migration history is still out of sync with the repo (apply
through the connector, never `db push`).

## D23 — Brain phase 2: tools, guards and alerts (2026-10-02, owner approved)
**Decision:** (1) New tools `handoff_whatsapp` (reason enum; the summary and the `wa.me` link are built in code from saved facts, never by the model; sets
`handoff_status = 'offered'`, never downgrading `requested`) and `show_page` (key from a whitelist of the plans page, how we work and the two PDFs). The
chat panel renders both. (2) `calculate_roi` also returns the per-month break-even. (3) Evidence guard (E1): a fact the model saves is kept only if the visitor's own
words support it (keyword evidence for website, Google profile and appointments or orders; the number must appear for the average sale; a shared word for the text
fields); `business_model` and `customer_interaction` are not model-writable until the prompt asks for them. (4) Recommendation retry (E2): in sales, with enough
known and no stage yet, a reply that recommends a plan without `recommend_plan` triggers one extra model call restricted to that tool; the reply is kept. (5) Reply lint
(a sentence-stripping E3): sentences that ask permission to show a button, claim an unverified action (registered, notified, will contact you, "contactar a alguien de
inmediato"), promise a guarantee or a ranking, or apply pressure are removed; removals are logged. (6) Turn budget (E4): from 10 visitor messages the agent stops asking and
offers a person; from 16 it answers in two sentences. (7) Objection classifier (price, think, partner, not_now, decline) and a sales stage machine in `flow`
(recommended, objection_1, objection_2, released) advanced only by code; nothing reads the stage yet. (8) Rubric lock (E6) in `recommend_plan`, with a transitional switch
(`REQUIRE_RUBRIC = false`) because nothing can save `customer_interaction` until the prompt phase. (9) Telegram alerts (admin-facing, English, plain text, off
when the bot variables are unset) the first time per conversation a visitor is sent to WhatsApp or shown the call button, sent after the response and only once the state is
stored; each kind is recorded in `flow.alerts` so it is not repeated. **Consequences:** the lint is regex-based and can miss paraphrases; it is a safety net, not a
substitute for the prompt rewrite. The receptionist still has `calculate_roi`. Alerts say a visitor was shown a button, not that they wrote or booked.

## D24 — Brain phase 3: the prompt rewrite, the plan questions and the objection cards (2026-10-02, owner approved)
**Decision:** (1) The base prompt is rewritten in "usted" (D20) around identity, voice, hard rules and the facts; the sales and appointment steps live only in the capability addenda. The
old business rules (formal order with a 7-day reservation, add-ons paid 100% upfront, only three plans, the service area) are kept. A new APPROVED CLAIMS block holds two Google
statistics, checked against Google's own page on 2026-10-02 (the second is worded "2.7 veces más probabilidad de considerarlo confiable", as Google says); the Harvard Business
Review claim is left out until the article itself is checked. (2) The sales questions are: business type, what is not working today, products or services or both, what they want the
agent to do with their own customers, the value of one sale; each is asked at most once (`flow.asked`). `choosePlan` decides from that, with no default plan; a skipped
`customer_interaction` question counts as "unsure" and gives Conversión. `REQUIRE_RUBRIC` is now true: `recommend_plan` is refused until the rubric has a result, and refused for any
plan but the rubric's, except one step down after a price objection. `business_model` and `customer_interaction` are now model-writable, without a keyword guard. (3) The receptionist
asks an intake question (business type, then what is not working), offers once «¿Le ayudo a elegir su plan?»; the offer is recognised in the reply (`flow.pending_offer`) so a bare "Sí"
goes to sales. (4) Objection cards (price, think, partner or another quote, not now, decline) are injected only when the visitor's message matched; the second round or a clear no
releases the conversation (only `show_page` and `handoff_whatsapp`). (5) Booking asks at most business type and goal, each once, then offers the call whether or not they were answered
(D25). (6) The static greeting, the chips, the launcher labels and the fallback messages are in "usted"; the CLAUDE.md and PRODUCT.md lines are updated. (7) A "tú" form in a reply is
logged, not stripped. **Consequences:** the site-wide CTA labels (`CTA`, `TIER_CTA`) are still in "tú"; changing them is a separate, site-wide decision. The FAQ answers are worded with "tú" in places;
the prompt tells the model to give them in "usted". The first live results decide how much of the card wording needs tuning.

## D25 — Booking offers the call without waiting for every answer (2026-10-02)
**Decision:** supersedes the contract rule that business type, goal and timing were all required before `offer_call`. Booking asks business type and the goal of the call, each once, then calls
`offer_call` whether or not they were answered; timing is saved if mentioned, never asked. **Why:** a setter's one job is the booking; the call itself does the qualifying, and the live tests showed
visitors skipping questions.

## D26 — What the stage requires is guaranteed in code, not asked of the model (2026-10-03, after the first live replays)
**Decision:** The live replays (scripts B1, D2, S1, U1, E1, A1) showed `gpt-4o-mini` skipping steps the prompt requires: not saving an answer (so the next turn planned with a missing fact and sent the
visitor to the wrong plan), calling `calculate_roi` for a plan other than the one recommended (wrong break-even in the reply and the card), recommending in prose without the button, saying "los botones
están abajo" with no button, computing from an invented unit price. These are now guaranteed by code. (1) `inferAnswer` reads the visitor's answer to the question asked last (what they sell, what they want from the
agent, the value of a sale, business type, pain, goal) and saves it when the model did not; what the model saves wins. (2) The recommendation turn (`lib/agent/enforce.ts`): when the rubric has decided and the
sale value is settled, code runs `recommend_plan` and the figures card for the rubric's plan if the model did not, drops a figures card for any other plan, and replaces the reply with one built from the tier data
(`lib/agent/recommendation.ts`) if it does not name the plan with both exact prices and the break-even; the model's reply is kept when it is right. The addendum now gives the model the exact figures. (3) Released:
the PDF and the WhatsApp buttons are added on the turn of release; booking: the call button once nothing is left to ask; handoff: both buttons on the request; "el equipo lo confirma directamente" always comes with the
WhatsApp button; the receptionist's reply ends with the exact offer question. (4) `calculate_roi` and the saved `average_sale` accept only a number the visitor wrote that is not a unit price, a volume or a recurring total;
such an answer gets ONE clarifying question (`flow.sale_clarified`), then the agent continues without a figure. (5) A sentence that points at a button when none is shown is removed. (6) The ROI is locked to the rubric's plan from
the moment the plan is decided. **Consequences:** a forced recommendation reads more like a template than the model's own wording (the model's reply wins whenever it is right); when a visitor asks a question on the
recommendation turn, nothing is forced. The E2 retry call is gone (replaced by 2).
