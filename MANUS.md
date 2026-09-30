# MANUS.md — instructions for Manus

Project: **Oryn Presence** (Purple Cove Labs) — Next.js 15 site, order flow, admin panel and the Oryn
chat assistant. Manus and Claude Code alternate on this repo. **GitHub is the source of truth**; do not
rely on chat history or on what another agent "remembers". `CLAUDE.md` holds the same rules for Claude
Code — keep the two files consistent.

## Start every session by

1. Pulling the latest branch and reading `docs/CURRENT-STATE.md`, then `docs/TASKS.md`.
2. Reading `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PRODUCT.md`, `docs/ROADMAP.md` as needed.
3. **Inspecting the actual code** before changing anything. If code and docs disagree, trust the code
   and fix the doc.

## Product rules

- Oryn is **one conversational AI system** with four capabilities: AI Receptionist, AI Sales Agent, AI
  Booking Agent, Human Handoff. They are capabilities of one system — not separate agents, APIs,
  databases or widgets.
- **Client-facing AI responses are Dominican Spanish.** Admin/developer-facing content, code, comments,
  docs and logs are English.
- **Do not invent business information.** Plans, prices and add-ons come from Supabase at runtime.
- Currency is written `RD$` with no space; keep decimals exactly (RD$15,499.99), never round.
- Domain is `purpleoryn.com`; market is Dominican businesses only.

## Architecture rules

- **Extend the existing architecture; do not replace it.** Keep `/api/chat`, `lib/ai/*` (provider
  abstraction: OpenRouter + OpenAI), `lib/agent/*` (prompt + tools), `chat_sessions`/`chat_messages`,
  `ChatPanel`, Cal.com links and WhatsApp links.
- **Do not create duplicate systems:** no second chatbot, chat API, conversation storage, provider layer
  or state machine.
- **Conversation state is decided by the database.** Allowed transitions live in SQL
  (`chat_state_can_transition`, applied by `chat_apply_state`). Do not copy that logic into TypeScript.
  `chat_apply_trusted_state` is only for verified server-side events (for example a validated booking
  webhook), never for anything a visitor can trigger.
- Never expose the Supabase service-role key or any API key to the client, logs or commits.
- Do not add a new framework, ORM, state library or CSS system without the owner's approval. Kapso is
  not part of this project unless `docs/DECISIONS.md` says so.
- Formal leads/orders (`/servicios`) are separate from chat unless a decision says otherwise.

## Working rules

- Only change what the task asks for; report other problems instead of fixing them.
- Migrations: add a new file with a later timestamp; never edit an applied one. **Do not say a migration
  is applied unless you verified it in the purpleoryn Supabase project** (named "Purple Cove Labs Website";
  the org's other projects are different products).
- Validate before handing off: `npm run typecheck`, `npm run lint`, `npm run build`. There is no test
  runner.
- **Update `docs/CURRENT-STATE.md`** whenever implementation materially changes; update the other docs and
  add a `docs/DECISIONS.md` entry when a decision changes.
- No extra README or summary files. Don't commit, push or deploy unless the owner asks; use the branch the
  owner names.
- Leave the repo in a state the next agent can pick up from the docs alone.
