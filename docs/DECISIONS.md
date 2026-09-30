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
