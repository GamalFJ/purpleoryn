# Oryn Presence — Product

Source of truth for *what the product is*. Everything here was verified against the
repository on 2026-09-30. Where something is a rule or intent rather than something
in code, it says so. Implementation status lives in [CURRENT-STATE.md](CURRENT-STATE.md).

## Context

- **Purple Cove Labs (PCL)** is a solo-founder web + AI studio (founder: Gamal Jastram).
  Identity constants live in `lib/site.ts` (name, phone, email, service area, Cal.com link).
- **Oryn Presence** is the AI-powered digital-presence productized service PCL sells.
  This repository (`purpleoryn`, deployed at `purpleoryn.com`) is its marketing site,
  order flow, admin panel and the **Oryn** chat assistant.
- Service area on the live site: Santo Domingo, Santo Domingo Este, Santo Domingo Oeste
  (`SITE.serviceAreas`). PCL is set up as a service-area business; no street address is published.

## What is sold

Three fixed-price plans plus optional add-ons. Names and slugs are fixed in code
(`lib/tiers.ts`, `TierSlug`); **prices and plan content are owned by the Supabase `tiers`
and `addons` tables at runtime** (edited in the admin panel). The values below are the
seed values from the migrations and `DEFAULT_TIERS`; treat the database as authoritative.

| Plan (slug) | One-time | Monthly | Agent conversations / month | Extra conversation |
| --- | --- | --- | --- | --- |
| Presencia (`presencia`) | RD$15,499.99 | RD$1,499.99 | 75 | RD$18.00 |
| Conversión (`conversion`, recommended) | RD$21,999.99 | RD$2,199.99 | 150 | RD$16.00 |
| Autoridad (`autoridad`) | RD$28,999.99 | RD$3,499.99 | 300 | RD$14.00 |

Add-on seeded in migrations: **Agente de Voz IA** (RD$20,000.00 one-time, RD$2,199.99
monthly, 150 minutes included, RD$16.00 per extra minute). Add-ons are sold on top of a
plan, never as a fourth plan, and are paid 100% upfront (plans: 50% at start, 50% on delivery).

Every plan includes a website, on-page SEO, Google Business Profile setup, analytics and an
AI agent tier, plus support; the exact per-plan wording comes from the `tiers` rows.

Rules that must hold everywhere:

- Prices keep their exact decimals (RD$15,499.99). Never round or strip decimals.
- Currency is written with the `RD$` prefix and no space.
- Completing and submitting the `/servicios` plan form is a **formal order** (same weight
  as a WhatsApp or email approval) and reserves the slot for 7 calendar days. It is never
  described as a quote request.

## The Oryn conversational AI

**One conversational system**, not several bots. It is the chat widget on the public site
(`ChatLauncher` → `ChatPanel` → `POST /api/chat`), backed by one prompt, one tool set and one
conversation store (`chat_sessions` / `chat_messages`).

Product intent: that single system has four capabilities.

| Capability | What it means | Status |
| --- | --- | --- |
| AI Receptionist | Greets, answers questions from approved facts (plans, pricing, FAQ, process) | Partially present: prompt + FAQ + plan data; no dedicated code |
| AI Sales Agent | Qualifies the visitor, runs the ROI method, recommends one plan | Present: `calculate_roi`, `recommend_plan` tools |
| AI Booking Agent | Offers the free 20-minute call | Partial: `offer_call` shows a Cal.com link; no availability lookup, booking creation or confirmation |
| Human Handoff | Routes the visitor to a person | Minimal: intent/status are recorded and the prompt cites the WhatsApp number; no alert, no tool |

These are capabilities of the one system — not separate agents, APIs, databases or widgets.

## Language and content rules

- **Client-facing AI output is Dominican Spanish** ("tú", warm, direct, no emojis, short
  replies). The system prompt is written in English and instructs Spanish output.
- **Admin and developer-facing content stays in English** (admin panel labels for
  conversations are currently English; code, comments, docs and logs are English).
- **Never invent business information** — no prices, discounts, delivery times, guarantees,
  results, client names, addresses or hours that are not in the prompt's approved facts.
  When a fact is missing the assistant says it will confirm on the call or points to WhatsApp.
- The assistant does not collect phone numbers, emails or payment details in chat; the plan
  form and the call collect contact details.

## Multi-market note

The database has a `markets` table (`do`, `us`, `ca`, `ht`) and middleware routes by host,
but only `do` (Dominican Republic) is live: `READY_MARKETS = {"do"}`; other hosts redirect to
`/coming-soon`. The chat and all customer copy are Dominican-market only today.

## Out of scope for the product today

Not built (see [ROADMAP.md](ROADMAP.md)): WhatsApp-native conversations, a Cal.com webhook or
API integration, human-handoff notifications, an orchestration layer, Kapso.
