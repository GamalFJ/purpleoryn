# CLAUDE.md — instructions for Claude Code

Project: **Oryn Presence** (Purple Cove Labs) — Next.js 15 site, order flow, admin panel and the Oryn
chat assistant. Claude Code and Manus alternate on this repo; **GitHub is the source of truth**, not
chat history.

## Read first

1. `docs/CURRENT-STATE.md` — what actually exists (start here)
2. `docs/TASKS.md` — the immediate sequence and blockers
3. `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PRODUCT.md`, `docs/ROADMAP.md`

Docs can lag the code. **Inspect the repository before coding** and trust the code where they differ;
then fix the doc.

## Product rules

- Oryn is **one conversational AI system** with four capabilities (Receptionist, Sales, Booking, Human
  Handoff). Not separate agents, APIs, databases or widgets.
- **Client-facing AI output is Dominican Spanish** (natural, "usted", no emojis; decided 2026-10-02, D20). Admin/developer-facing
  content, code, comments, docs and logs are English.
- **Never invent business information** (prices, discounts, timelines, guarantees, results, clients,
  addresses, hours). Plan and price facts come from Supabase `tiers`/`addons` at runtime.
- Currency is `RD$` prefix, no space. Keep decimals exactly (RD$15,499.99); never round.
- The site domain is `purpleoryn.com`. The market is Dominican businesses only; don't add regional
  labels or positioning beyond that in customer-facing copy.

## Architecture rules

- **Extend, don't replace.** Preserve `/api/chat`, `lib/ai/*`, `lib/agent/*`, `chat_sessions` /
  `chat_messages`, `ChatPanel`, the Cal.com link flow and the WhatsApp links.
- **No duplicate systems:** no second chatbot, chat API, conversation store, provider layer or state
  machine. New model vendors go through `lib/ai` only.
- **The database is authoritative for conversation state.** Transitions are decided in SQL
  (`chat_state_can_transition`); don't re-implement them in TypeScript. Never call
  `chat_apply_trusted_state` from anything a visitor can drive; `booking_confirmed`, `completed`,
  `booking_status = 'confirmed'` and `handoff_status = 'completed'` need a verified server-side event.
- Service-role key: server-only, never `NEXT_PUBLIC_`, never exposed to the client, never echoed or
  logged. Use `.env.local`; never commit secrets.
- Supabase: `createBrowserClient` for client components, server clients for server code; don't mix.
- Don't introduce a new framework, ORM, state library or CSS system without asking. Kapso is **not**
  part of this project unless a decision entry says so.
- Formal leads/orders (`/servicios`) stay separate from chat unless explicitly designed otherwise.

## Working rules

- Scope: fix what was asked. **Do not modify unrelated functionality**; mention other issues instead.
- Migrations: add new files under `supabase/migrations/` with a later timestamp; never edit an applied
  migration. **Never claim a migration is applied unless you verified it in the purpleoryn project**
  (the Supabase connector may point at a different project — this site's project is named "Purple Cove Labs Website"; the org's other projects are different products).
- After changes, **run validation**: `npm run typecheck`, `npm run lint`, and `npm run build` when the
  change can affect the build. There is no test runner; don't add one without approval.
- **Update `docs/CURRENT-STATE.md`** when implementation materially changes (and ARCHITECTURE / TASKS /
  ROADMAP / DECISIONS as they are affected). Record new architectural decisions in `docs/DECISIONS.md`.
- Don't create extra README or summary markdown files.
- **Git: `main` is the only branch.** When the owner asks you to commit, commit directly on `main` and push; no feature branches, no PRs (Vercel deploys from `main`). Only commit, push or deploy when asked. Older unmerged work is preserved as `archive/*` tags.
- Match the surrounding code's style, naming and comment density; UI changes reuse existing components
  and design tokens.
