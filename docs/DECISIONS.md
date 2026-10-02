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
