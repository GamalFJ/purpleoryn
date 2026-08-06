# purpleoryn.com — Full-Stack Audit Report
**Date:** 2026-08-06  
**Audited by:** Elite multidisciplinary review panel (Principal Architect, Staff Frontend, Senior Full-Stack, UX Lead, SaaS Designer, CRO Specialist, Information Architect, Accessibility Specialist, Technical SEO Expert, Performance Engineer, Brand Strategist, Startup Growth Consultant, Skeptical VC, First-time Visitor, Busy Business Owner, Brutally Honest Design Critic)  
**Domain:** purpleoryn.com (purplecovelabs.com in canonical)  
**Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui + React Router + Supabase

---

## TL;DR — 5 Things to Fix This Week

1. **Strip the dependency footprint.** The 567 KB vendor bundle is indefensible for a marketing site. Remove every unused Radix primitive and library (recharts, embla, vaul, cmdk, input-otp, react-resizable-panels, react-day-picker, @calcom/embed-react) — cut vendor JS by ~60%.
2. **Add `.env` to `.gitignore` immediately.** The Supabase project ID and anon key are tracked in git and will end up on GitHub. Add `.env` to `.gitignore` before the next push.
3. **Fix the canonical URL and `lang` attribute.** The site says `lang="en"` in HTML and points canonical to `purplecovelabs.com` while living on `purpleoryn.com`. Every SEO point being earned is credited to the wrong domain with the wrong language signal.
4. **Move PresenciaDigitalExpress out of position 2.** You're making a hard RD$9,500 sales pitch to a cold visitor 3 seconds after they land — before any trust has been established. This section belongs on its own page or after social proof.
5. **Replace or remove the three anonymous testimonials.** "Cliente E-commerce" and "CEO" are not social proof. They are claims with no verifiable human behind them. A blank testimonial section converts better than fabricated-looking quotes.

---

## 1. Executive Summary

purpleoryn.com is a Lovable.dev-generated React SPA that has been customized but never properly audited, cleaned, or optimized. The code quality is better than most no-code outputs, but the site carries the structural DNA of a template: bloated dependencies, half-baked features, dead code, and a conversion architecture that prioritizes completeness over persuasion.

The core business problem is real and well-understood. The copy has genuine moments of clarity. The visual language is coherent. But the site fails at its primary job — convincing a small business owner in the Dominican Republic to press "send" on a WhatsApp message — for a collection of fixable reasons.

The most dangerous assumption embedded in this codebase is that a marketing site needs Supabase, React Query, 22 Radix UI primitives, an OTP input, and a command palette. It does not. The dependency bloat alone explains why a 10-section marketing site is shipping 567 KB of vendor JavaScript to a user on mobile data in Santiago.

This site does not deserve to be in its current state. It can be. That is the point of this report.

---

## 2. Overall Grades

| Category | Grade | Notes |
|---|---|---|
| UX | C | Conversion path broken by premature offer; missing social proof on homepage |
| Design | B– | Visually coherent but inconsistent between sections; PresenciaDigitalExpress is a foreign body |
| Architecture | D+ | Lovable.dev export never cleaned; dead code everywhere; wrong tool for the job |
| Performance | D | 567 KB vendor bundle; no SSR; CWV will fail on mobile |
| Accessibility | C– | `lang="en"` on Spanish content; missing alt text patterns; focus states thin |
| SEO | D | Wrong canonical; wrong lang; SPA with no SSR; no sitemap; `/admin` crawlable |
| Messaging | B | Clear problem/solution framing, but hero CTA doesn't match the conversion goal |
| Conversion | C– | WhatsApp absent from hero; anonymous testimonials; premature price drop |
| Maintainability | D+ | 9+ dead components; Pricing.tsx not in router; language system 30% implemented |
| Trust | C | No founder photo context, no verifiable names, no real client logos |
| Brand Positioning | B– | Purple aesthetic is distinctive but "AI Systems" positioning competes with every agency |

---

## 3. Repository Structure Map

```
gracious-torvalds-154c33/
├── public/                    # Static assets
│   ├── robots.txt             # Missing Sitemap, missing /admin disallow
│   ├── calculator.html        # Standalone HTML calculator (outside the React app)
│   ├── demo-*.png.jpeg        # Dual-extension filenames (!!!)
│   └── lovable-uploads/       # GPT Engineer / Lovable upload artifacts
├── src/
│   ├── App.tsx                # Router setup — 8 routes including Auth/Admin
│   ├── assets/                # 30+ image files, many orphaned
│   │   └── vielma/            # 14 case study screenshots (large, no optimization)
│   ├── components/
│   │   ├── BookingButton.tsx  # Thin wrapper around an <a> tag
│   │   ├── CaseStudy.tsx      # NOT USED ON ANY PAGE
│   │   ├── CTA.tsx            # NOT USED ON ANY PAGE
│   │   ├── Hero.tsx           # Homepage hero
│   │   ├── LanguageToggle.tsx # Language switcher
│   │   ├── NavLink.tsx        # NOT USED (Header builds its own nav inline)
│   │   ├── Newsletter.tsx     # NOT USED ON ANY PAGE
│   │   ├── OngoingBuilds.tsx  # NOT USED ON ANY PAGE
│   │   ├── PresenciaDigitalExpress.tsx  # Placed #2 on homepage — wrong position
│   │   ├── Process.tsx        # NOT USED ON ANY PAGE
│   │   ├── ScrollReveal.tsx   # Custom IntersectionObserver wrapper
│   │   ├── Services.tsx       # NOT USED ON ANY PAGE
│   │   ├── StickyMobileCTA.tsx # DEFINED BUT NEVER IMPORTED ANYWHERE
│   │   ├── StrategySession.tsx # NOT USED ON ANY PAGE
│   │   ├── Testimonials.tsx   # NOT USED — SocialProof.tsx used instead
│   │   ├── WhatsAppButton.tsx # Good — but skipped in hero CTA
│   │   ├── WhyUs.tsx          # NOT USED ON ANY PAGE
│   │   ├── pricing/           # 8 pricing components
│   │   │   └── (Retainers.tsx uses RD$ vs Planes.tsx uses USD — MISMATCH)
│   │   ├── sections/          # 6 homepage section components
│   │   └── ui/                # 49 shadcn components (most unused on marketing pages)
│   ├── contexts/
│   │   └── LanguageContext.tsx # i18n — partially implemented
│   ├── hooks/
│   │   └── useAuth.tsx        # Auth hook for Admin — irrelevant to marketing site
│   ├── pages/
│   │   ├── Index.tsx          # Homepage — missing HowItWorks, SocialProof
│   │   ├── Pricing.tsx        # DEAD FILE — not in router, shadowed by Planes.tsx
│   │   ├── Planes.tsx         # Retainer plans page (USD prices)
│   │   ├── Portafolio.tsx     # Case studies with broken href="#" Loom placeholder
│   │   ├── Demos.tsx          # iframe demo browser
│   │   ├── Apps.tsx           # Single-product page with "Video demo próximamente"
│   │   ├── Auth.tsx           # Supabase auth — exposed at /auth
│   │   └── Admin.tsx          # Admin panel — exposed at /admin
│   └── translations/          # en.ts, es.ts, fr.ts — only used in Planes pricing
└── index.html                 # lang="en" (wrong), canonical="purplecovelabs.com" (wrong)
```

---

## 4. Codebase Audit

### 4.1 Origin: This is a Lovable.dev Export

The evidence is irrefutable:
- `package.json` name: `"vite_react_shadcn_ts"` — the Lovable default project template name
- `devDependencies` includes `lovable-tagger`: `"^1.1.11"` — Lovable's proprietary development tool
- OG image URL: `https://storage.googleapis.com/gpt-engineer-file-uploads/...` — hosted on GPT Engineer's infrastructure (Lovable's predecessor)
- `public/lovable-uploads/` directory — the Lovable file upload path

**Consequence:** The entire dependency set was selected by Lovable's template, not by the needs of this project. Every library in `package.json` was included because Lovable's SPA shell might need it someday, not because this marketing site needs it today.

### 4.2 Dead Code Inventory

The following components exist in `src/` but are imported nowhere:

| File | Status | Impact |
|---|---|---|
| `src/components/CaseStudy.tsx` | Never imported | Wasted code |
| `src/components/CTA.tsx` | Never imported | Wasted code |
| `src/components/NavLink.tsx` | Never imported | Header duplicates its logic inline |
| `src/components/Newsletter.tsx` | Never imported | Wasted code |
| `src/components/OngoingBuilds.tsx` | Never imported | Wasted code |
| `src/components/Process.tsx` | Never imported | Wasted code |
| `src/components/Services.tsx` | Never imported | Wasted code |
| `src/components/StickyMobileCTA.tsx` | Defined, never imported | Was presumably removed from Index.tsx but not deleted |
| `src/components/StrategySession.tsx` | Never imported | Wasted code |
| `src/components/Testimonials.tsx` | Never imported | SocialProof.tsx is used instead |
| `src/components/WhyUs.tsx` | Never imported | Wasted code |
| `src/pages/Pricing.tsx` | Not in router | Router redirects `/pricing` to `Planes.tsx` |

**Verdict:** 12 dead files. Delete all of them.

Additionally, `src/components/sections/HowItWorks.tsx` and `src/components/sections/SocialProof.tsx` exist and are well-written, but are absent from `Index.tsx`. They belong on the homepage. They are not there.

### 4.3 Dependency Audit

The `package.json` has 35 production dependencies for a marketing website. This is not engineering — it is hoarding.

**Radix UI Primitives (22 installed):**
```
@radix-ui/react-accordion
@radix-ui/react-alert-dialog
@radix-ui/react-aspect-ratio
@radix-ui/react-avatar
@radix-ui/react-checkbox
@radix-ui/react-collapsible
@radix-ui/react-context-menu
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-hover-card
@radix-ui/react-label
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-popover
@radix-ui/react-progress
@radix-ui/react-radio-group
@radix-ui/react-scroll-area
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slider
@radix-ui/react-slot
@radix-ui/react-switch
@radix-ui/react-tabs
@radix-ui/react-toast
@radix-ui/react-toggle
@radix-ui/react-toggle-group
@radix-ui/react-tooltip
```

The marketing pages use: `accordion`, `dialog`, `slot`, `toast`, `tooltip`. Possibly 5 of 22+ installed. The rest are inherited from the Lovable template.

**Other unused/suspicious dependencies:**

| Package | Why It's There | Actually Used? |
|---|---|---|
| `@calcom/embed-react` | Inline cal.com calendar embed | NO — `BookingButton` is a plain `<a href>` link, not an embed |
| `@supabase/supabase-js` | Auth + DB | Only for `/auth` and `/admin` pages |
| `@tanstack/react-query` | Server state management | Only for Admin auth state |
| `cmdk` | Command palette | Absolutely not |
| `date-fns` | Date utilities | Possibly in Admin only |
| `embla-carousel-react` | Carousel | Not found on any marketing page |
| `input-otp` | OTP input field | Definitely not |
| `next-themes` | Dark/light mode | Not found in use |
| `react-day-picker` | Date picker | Not found on marketing pages |
| `react-hook-form` | Form validation | Not found on marketing pages |
| `react-resizable-panels` | Panel resize | Definitely not |
| `recharts` | Charts | Admin only |
| `vaul` | Drawer component | Not found in use |
| `zod` | Schema validation | Not found on marketing pages |

**Verdict:** At minimum 12–15 production dependencies are dead weight for the public-facing site. Combined size contribution: estimated 180–250 KB of the 567 KB vendor bundle.

### 4.4 Architecture Problems

**Wrong rendering strategy.** This is a React SPA. That means on first load, Google sees:
```html
<div id="root"></div>
```
Nothing. Blank. All content is JavaScript-rendered. For a marketing site selling SEO services to clients, this is ironic and damaging. A Vite SPA cannot do server-side rendering without additional tooling. The correct choice is **Astro** (static site, partial hydration), **Next.js** (SSR/SSG), or at minimum **vite-plugin-ssr**. The current setup is architecturally the worst choice for an SEO-dependent marketing site.

**Two-source-of-truth pricing.** `RetainersPreview.tsx` (used on homepage) shows:
- Plan Básico: `RD$ 10,675 /mes`
- Plan Estándar: `RD$ 17,995 /mes`
- Plan AI Partner: `RD$ 35,014 /mes`

`Retainers.tsx` (used on Planes page) shows:
- Maintenance plan: `$350/mo`
- Growth plan: `$525/mo`
- AI Partner: `$950/mo`

These are two different files with two different price lists. A visitor going from homepage to Planes page sees completely different prices with different currencies. This will kill trust instantly.

**Language system is theater.** There is a 3-language toggle (ES/EN/FR) with a full translation context, localStorage persistence, and browser language detection. But the homepage is 100% hardcoded in Spanish. The translations are only wired into pricing components on the Planes page. The toggle exists but does nothing on the most-visited page. This creates a false promise to any English or French visitor.

**`BookingButton` is a wrapper around a link.** It accepts an `as?: "button" | "div"` prop that is never used. It renders an `<a>` tag unconditionally. This is an abstraction that does nothing except give the anchor a name.

---

## 5. Performance Audit

### 5.1 Bundle Analysis (from `dist/assets/`)

| Chunk | Size (raw) |
|---|---|
| `index-CMz1y69A.js` (vendor) | **566,753 bytes (553 KB)** |
| `Portafolio-BY-qHEYf.js` | 37,074 bytes |
| `Auth-Bs7H9XPj.js` | 57,988 bytes |
| All route chunks combined | ~165,000 bytes |
| **Total JS** | **~730 KB** |
| CSS | ~60 KB (estimated) |

**Target for a marketing site:** Under 150 KB total JS (compressed). This site is shipping ~5× that.

A mobile user in Santo Domingo on a 4G connection averages 5–15 Mbps. At 5 Mbps, downloading 730 KB of JS takes ~1.2 seconds, plus parse + execute time. First Contentful Paint will be 3–5+ seconds. Lighthouse mobile score is projected at **30–45 out of 100**.

### 5.2 Specific Performance Failures

**No image optimization.** The hero founder photo is served as a raw PNG from `/lovable-uploads/`. No `width`/`height` attributes set (causes layout shift). No `fetchpriority="high"` on the LCP image. The 14 Vielma Group screenshots in Portafolio are uncompressed PNGs/JPGs loaded with `loading="lazy"` — correct, but the underlying files are likely unoptimized originals.

**Demo thumbnail filenames:** `/demo-constructora.png.jpeg` — a dual-extension filename. This is a symptom of using an image file exported from Lovable without renaming it. It serves as JPEG (correct content-type), but the filename is confusing to crawlers and CDN rules.

**No font loading strategy.** `index.html` has `<link rel="preconnect" href="https://fonts.googleapis.com">` but no actual font `<link>` tags. The fonts are presumably referenced in `PresenciaDigitalExpress.tsx` as inline `fontFamily` styles (`'Space Grotesk', sans-serif` and `'DM Sans', sans-serif`) — but these fonts are never loaded. The browser falls back to system fonts, causing a visual mismatch. This also means the preconnect is wasted.

**Two Toasters in the component tree.** `App.tsx` renders both `<Toaster>` (from `@radix-ui/react-toast`) and `<Sonner>` (from `sonner`). Two notification systems loaded for a site with no notifications.

**`ScrollReveal` causes layout shift.** Every below-fold section starts at `opacity-0 translate-y-8` and animates in. This is a vanity animation that hides content during scroll. For users with `prefers-reduced-motion`, this will still animate (no media query check). It also causes cumulative layout shift on slower devices.

**`@calcom/embed-react` is installed but unused.** The package alone adds JS to the bundle without providing anything — `BookingButton` links to cal.com as a plain anchor.

---

## 6. UX Audit

### 6.1 First-Time Visitor Walk-Through

**Second 0–5: Hero**
> "Sistemas que hacen crecer tu negocio. Más ventas. Menos trabajo."

Who said that? Who is this? What exactly do they do? The hero gives a promise but no identity. "More than 10 businesses automate with us" — 10 is not a number to brag about. The CTAs are "Ver Demos" and "Ver Portafolio" — both send the visitor away from conversion into research mode. WhatsApp does not appear. There is no sentence explaining what Purple Cove Labs actually builds.

**Second 5–30: PresenciaDigitalExpress card**
> "Su Página de Captura en 3 días. RD$9,500."

The visitor has known this company for 5 seconds and is now being asked to pay RD$9,500. This is premature. Cold traffic does not buy from a brand they have never heard of within their first scroll. This section is doing real damage to conversion by violating trust-before-ask sequencing.

**Scroll to Problem section:**
> "Si tu negocio funciona a pulso, no escala."

Good. This is the first moment the site earns attention. But it came too late — after an uninvited sales pitch.

**Promise section:** Four generic benefit tiles (More sales, More time, More control, More scale). Every competitor in this category claims the same four things. There is zero differentiation.

**Offer section:** A bullet list of services. No specificity about HOW. No anchoring to actual client results. No guarantee.

**FinalCTA:** Two CTAs — calendar booking and WhatsApp. Good. But this is the first WhatsApp button visible without scrolling specifically to find it.

**Verdict: The visitor exits the page without contacting because:**
1. Hero doesn't explain what PCL builds in concrete terms
2. PresenciaDigitalExpress interrupts trust-building with a sales pitch
3. HowItWorks and SocialProof are missing from the homepage entirely
4. WhatsApp appears for the first time near the bottom
5. Testimonials are anonymous and unverifiable

### 6.2 Mobile UX

The `StickyMobileCTA` component was built and then removed from the page (it's on this very branch: `fix/remove-sticky-mobile-cta`). Its removal is correct — it obscured content — but nothing replaced the mobile conversion anchor. On mobile, the primary CTA requires scrolling past multiple sections before appearing.

Footer has `pb-24 md:pb-10` — extra bottom padding that suggests it was built to work with the sticky CTA. Now that the CTA is removed, that padding is vestigial whitespace.

### 6.3 Demos Page

The Demos page loads an `<iframe>` pointing to `demos.purpleoryn.com` — a separate subdomain. The iframe is 600px tall on mobile, 750px on tablet, 900px on desktop. This is fine in concept, but:
- The niche cards are buttons that toggle the iframe — no direct link to the demo until clicked
- The iframe has no scrollbar on some browsers without explicit styling
- No CTA between the demo and FinalCTA — a visitor who is impressed by the demo has no immediate path to contact

### 6.4 Portafolio: Broken Content Shipped to Production

`Portafolio.tsx` lines 350–360:
```jsx
{/* REPLACE href="#" WITH LOOM URL WHEN READY */}
<a href="#" className="..." target="_blank" rel="noopener noreferrer">
  Ver demo en Loom →
</a>
```

A placeholder link (`href="#"`) pointing nowhere is live on the production portfolio page. This clicks and does nothing. For a company selling web development, shipping broken links is a credibility failure.

---

## 7. Conversion Audit

### 7.1 Conversion Path Analysis

**Current path:**
```
Hero (CTAs: Ver Demos, Ver Portafolio)
    ↓
PresenciaDigitalExpress (CTA: Solicitar Ahora → WhatsApp)
    ↓
Problem (no CTA)
    ↓
Promise (no CTA)
    ↓
Offer (CTA: Agendar Llamada Estratégica — Cal.com)
    ↓
FinalCTA (CTAs: Agendar Llamada + WhatsApp)
    ↓
Footer (CTAs: email × 2 + Cal.com link)
```

**Missing from conversion path:** Social proof. HowItWorks. Process. Pricing. FAQ.

**CTA fragmentation — four different contact mechanisms with no hierarchy:**
1. `BookingButton` → Cal.com (`cal.com/purple-cove-labs/20-min-cafe-virtual`)
2. `WhatsAppButton` → wa.me/18096034113 (with prefill message)
3. `PricingCTA` → Fluum.ai (`fluum.ai/c/strategy-systems-session-709721`) — a third booking platform
4. `mailto:gamal.jastram@purpleoryn.com` AND `mailto:purplecoves@gmail.com` — two different emails in the footer

A visitor contacts through Fluum, another through Cal, another through WhatsApp. There is no single source of lead collection. A personal Gmail address in the footer (`purplecoves@gmail.com`) signals that this is a side project, not a professional agency.

### 7.2 Testimonials: The Credibility Problem

```
"Pasamos de responder mensajes a mano a tener un sistema que califica leads mientras dormimos."
— Cliente Estudio de Arquitectura · Fundador, ArKyTeK

"El equipo de Purple Cove Labs entiende el negocio antes de tocar código. Marcó la diferencia."
— Cliente E-commerce · CEO

"Por fin tengo visibilidad real de mis operaciones. Todo conectado, todo medible."
— Cliente Servicios Profesionales · Director de Operaciones
```

Problems:
- "Fundador, ArKyTeK" — a named company with an unnamed founder. If you can name the company, name the person.
- "Cliente E-commerce · CEO" — completely anonymous. This is indistinguishable from a made-up testimonial.
- "Cliente Servicios Profesionales · Director de Operaciones" — same problem.
- No photos. No company logos. No LinkedIn links. No way to verify these are real.

A skeptical VC or enterprise buyer will dismiss all three. Even a small business owner wonders if these are real.

### 7.3 Stats Without Attribution

```
+40% Leads calificados
20h  Ahorradas / semana
24/7 Operación automática
```

Whose leads? Whose 20 hours? These stats appear above the testimonials but are attributed to no client. The Portafolio page has actual metrics (from ArKyTeK and Vielma Group) that verify these claims — but they're on a separate page. On the homepage, they float unanchored.

### 7.4 Urgency Fabrication

"🔥 Últimos cupos del mes disponibles" appears in the hero badge.  
"⚡ Últimos cupos del mes" appears again in FinalCTA.  
PresenciaDigitalExpress says "Cupos limitados esta semana" AND "Oferta Especial · Disponible Esta Semana."

Four urgency triggers on a single homepage. Sophisticated buyers recognize manufactured scarcity and distrust it. Unsophisticated buyers may believe it once — but if they come back next month and the badge says the same thing, trust collapses permanently.

---

## 8. Information Architecture Audit

### 8.1 Current Sitemap

```
/ (Index)
/portafolio
/apps
/demos
/planes
/pricing → redirects to /planes
/auth
/admin
```

### 8.2 What's Wrong With This Structure

**`/apps` is a dead end.** The Apps page promotes the "Prospect Intelligence Dashboard" — a product that has "Video demo próximamente" as its demo. A visitor who clicks on Apps finds a feature list and a placeholder. This page should not exist publicly until the product has a video or live demo.

**`/demos` iframe approach has friction.** Clicking a niche card to see a demo inside an iframe is fine, but four clicks to explore four niches is unnecessary. The demos should load by default, or the page should show screenshots with a "Ver en vivo" link.

**`/auth` and `/admin` are public and crawlable.** `robots.txt` does not disallow these routes. Any crawler or competitor can discover your admin interface. Even if auth is required to use admin, the existence of an admin panel tells competitors what infrastructure you're running.

**`/planes` confuses new visitors.** The page is titled "Planes de Asociación Continua" — this is retainer/maintenance pricing. But visitors from the homepage hero ("Sistemas que hacen crecer tu negocio") don't know they're looking for a retainer. They're looking for what it costs to build the system. There is no "build" pricing page — only maintenance pricing. The initial project cost is never stated anywhere on the site.

### 8.3 Recommended Architecture

**Verdict: Single-page with deep anchor sections.** Not multi-page.

**Reasoning:** The target audience is a business owner in the Dominican Republic, likely on mobile, who found the site through word of mouth, WhatsApp, or a local referral. They are not performing deep research. They need to understand what PCL does, see evidence it works, and contact within 90 seconds. Multi-page navigation creates friction and drop-off. Every page transition is a chance to leave.

The current multi-page structure is appropriate for agencies serving enterprise buyers doing vendor evaluation over 2–3 visits. PCL is not that. The conversion event is a WhatsApp message, not a signed contract.

**Keep as separate pages:**
- `/portafolio` — case studies are research content, appropriate to separate
- `/demos` — interactive content, appropriate to separate
- `/planes` — detailed pricing for bottom-funnel visitors

**Eliminate as separate pages:**
- `/apps` — merge into homepage or portafolio, or hold until product is ready
- Remove `/pricing` (already a redirect)
- Remove `/auth` and `/admin` from the public domain entirely — move to admin.purpleoryn.com

**Recommended homepage section order:**
```
1. Hero — who you are, what you do, one CTA (WhatsApp)
2. Problem — "Si tu negocio funciona a pulso, no escala"
3. Solution / Promise — what you build and the outcome
4. HowItWorks — 3 steps (already built, not used)
5. SocialProof — stats + testimonials (already built, not on homepage)
6. Offer — service menu with light pricing signal
7. RetainersPreview — monthly plans
8. PresenciaDigitalExpress — positioned as accessible entry point
9. FinalCTA — WhatsApp primary
10. Footer
```

---

## 9. Design Audit

### 9.1 What Works
- The dark purple aesthetic is consistent and distinctive. It reads "technical" without being cold.
- The glass-card system creates a coherent visual language across sections.
- Typography hierarchy (extrabold headings, muted body) is legible.
- The gradient-text and neon-text treatments add energy without being garish.
- The founder photo with drop-shadow glow in the hero is effective and humanizing.

### 9.2 What Fails

**PresenciaDigitalExpress is a foreign body.** The component uses hardcoded hex colors (`#1a0040`, `#100028`, `#7C3AED`), hardcoded `fontFamily` inline styles (`Space Grotesk`, `DM Sans`), and hardcoded `backgroundColor` on the section element — none of which use the Tailwind design system or CSS variables. Compare this to every other component on the site, which uses `hsl(var(--primary))` and `bg-glass-card`. The PresenciaDigitalExpress card looks like it was lifted from a different project and dropped in. It is visually jarring as the second thing a visitor sees.

**Font inconsistency.** `PresenciaDigitalExpress.tsx` references `'Space Grotesk', sans-serif` and `'DM Sans', sans-serif` in inline styles. Neither font is loaded in `index.html`. The rest of the site uses whatever font is in the CSS variables (likely a system font stack or a Lovable default). The browser will silently fall back to a sans-serif generic, meaning the carefully specified fonts are not rendering.

**`demo-constructora.png.jpeg` etc.** Dual-extension filenames are sloppy. These are public-facing URLs that business owners might share. `/demo-dental.png.jpeg` is not professional.

**The "Más Popular" badge on Plan Estándar is floating in the wrong DOM position.** It uses `absolute -top-3` which works on desktop grid but gets clipped on mobile because the parent `glass-card` doesn't have `overflow-visible` on mobile. (Visual regression risk from responsive breakpoints.)

**Zero visual differentiation between services.** The Offer section presents 6 bullet points: automations, AI agents, custom apps, integrations, SEO, training. These are all one color, one size, one weight. A visitor cannot identify which of these applies to them. A restaurant owner and a law firm see the same undifferentiated list.

**Hero CTA buttons compete equally.** "Ver Demos" (solid gradient) and "Ver Portafolio" (outlined) have similar visual weight. When two CTAs have similar prominence, click-through splits and conversion suffers. One should be primary, one should recede. Neither should be the WhatsApp path, yet the hero contains no WhatsApp CTA at all.

---

## 10. Copywriting Audit

### Hero
> "Sistemas que hacen crecer tu negocio. Más ventas. Menos trabajo."

**Problem:** "Sistemas" is technical. A restaurant owner does not think "I need a sistema." They think "I need more customers" or "I need to stop losing reservations." The word "sistemas" targets people who already know they want automation — not the cold-traffic business owner who doesn't know what they need.

> "Más de 10 negocios ya automatizan con nosotros. Los cupos se llenan rápido."

**Problem:** "10+ negocios" is a tiny number. Competitors will have "500+ clients" in their subheadline. Either don't mention the number, or replace it with a specific outcome: "La firma Vielma Group captura el 100% de sus citas online. ArKyTeK automatizó su onboarding completo en 2 semanas."

### Problem Section
> "Si tu negocio funciona a pulso, no escala."

This is the best line on the site. Sharp, colloquial, true. Keep it.

The four problem tiles are generic: "Pierdes clientes por procesos manuales lentos," "Tu negocio depende demasiado de ti," "Tu equipo pierde horas en tareas repetitivas," "No tienes visibilidad real." These are industry-generic. Every automation agency writes these exact four problems. Add one specific example per problem: "A law firm losing 3 consultations per week to missed callbacks."

### Promise Section
> "Más ventas. Más tiempo. Más control. Más escala."

Four "Más" promises in a row is a marketing cliché. These four outcomes are what every business tool in history has promised. There is no specific mechanism, no reason why PCL delivers this over any other vendor, no differentiation.

### Offer Section
> "Una solución llave en mano: estrategia, implementación y soporte continuo — sin coordinar múltiples proveedores."

Good. The "sin coordinar múltiples proveedores" is a real pain point and a real differentiator.

> "Implementación en días, no meses — con soporte continuo incluido."

Good. Specific and credible given the 3-day PresenciaDigitalExpress offer.

But the bullet list mixes high-level and low-level items without hierarchy. "Automatizaciones que conectan tus herramientas" and "Documentación y capacitación" are not at the same level of importance.

### FinalCTA
> "20 minutos para identificar qué sistema te dará el mayor retorno."

Good. This is specific and low-pressure.

### PricingCTA (Planes page)
Contains a link to `hello@purpleoryn.com` — an email address that does not appear in the Footer (which shows `gamal.jastram@purpleoryn.com` and `purplecoves@gmail.com`). There are now **three different contact email addresses** across the site.

---

## 11. Accessibility Audit

### Critical Issues

**`lang="en"` on a Spanish site.** `index.html` line 2: `<html lang="en">`. The entire site is in Spanish. Screen readers will read Spanish text with English pronunciation rules, making it unintelligible to blind Spanish-speaking users. WCAG 2.1 Level A failure (3.1.1 Language of Page). Fix: `<html lang="es">`.

**No `<title>` or `<meta name="description">` on Portafolio and Planes pages.** These pages use Helmet only on the Demos page. Portafolio and Planes have no per-page titles, so the browser tab and screen readers see the default `index.html` title ("Purple Cove Labs - B2B AI Systems") for every page.

**LanguageToggle has `aria-expanded` but no `aria-haspopup`.** The button that opens the language dropdown correctly uses `aria-expanded={isOpen}` but should also include `aria-haspopup="listbox"` to announce the dropdown type to screen readers.

**`Dialog` close button lacks visible label.** `DialogClose` in Portafolio's lightbox has `<X className="h-5 w-5" />` and a `<span className="sr-only">Cerrar</span>`. The sr-only text is correct, but the button's visual appearance at small sizes may not meet 3×3 tap target minimums (the button is styled with `min-h-[44px] min-w-[44px]`, which is acceptable).

**Focus management in lightbox.** When the lightbox opens, focus should move to the dialog. Radix Dialog handles this, so it is likely correct. Verify with keyboard navigation testing.

**`ScrollReveal` and `prefers-reduced-motion`.** The animation wrapper does not check `window.matchMedia('(prefers-reduced-motion: reduce)')`. For users who have opted out of animations (many users with vestibular disorders), content will still animate in.

**Alt text pattern in hero:** `alt="Gamal — Purple Cove Labs"` is acceptable but does not describe the image for screen reader users who don't know who Gamal is. Consider: `alt="Gamal Jastram, founder of Purple Cove Labs"`.

**Contrast:** The `text-muted-foreground` color on dark background appears to be approximately `hsl(270, 10%, 60%)` — needs verification against actual background to confirm 4.5:1 ratio. If background is `hsl(270, 50%, 8%)`, the contrast ratio is estimated at ~3.8:1, which fails WCAG AA for normal text.

### Missing
- Skip-navigation link
- Visible focus styles on custom interactive elements (glass-card as button in Demos)
- `role="status"` on loading states

---

## 12. SEO Audit

### Critical Failures

**Wrong canonical URL.** `index.html` line 14: `<link rel="canonical" href="https://purplecovelabs.com" />`. The site appears to serve from `purpleoryn.com`. Every page view is crediting `purplecovelabs.com` with the SEO value. If `purplecovelabs.com` is not owned or redirected, you are permanently donating your authority to a dead domain. If it is the intended domain, the deployment target needs to change.

**React SPA = no server-rendered HTML.** Google does crawl JavaScript, but: (a) it delays rendering by days/weeks, (b) Core Web Vitals for Googlebot will include JS parse time, (c) social share crawlers (Twitter, WhatsApp preview) do not execute JavaScript at all. A WhatsApp link preview for `purpleoryn.com` will show nothing — no title, no image, no description — because the OG tags are served by JS, not the HTML shell. `react-helmet-async` only injects tags after JS hydration.

**`lang="en"` on a Spanish site.** Already covered in Accessibility. This signals to Google that the site is English-language, suppressing it in Spanish-language search results in the Dominican Republic.

**No `sitemap.xml`.** No `Sitemap:` directive in `robots.txt`. Google has no structured list of URLs to crawl.

**`robots.txt` does not disallow sensitive routes.** `/admin` and `/auth` are crawlable. While Google won't index pages requiring auth, the URLs will appear in Googlebot's crawl log.

**OG image hosted on third-party infrastructure:**
```html
<meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/...">
```
This is GPT Engineer's Google Cloud Storage. If Lovable/GPT Engineer ever rotates, expires, or moves this bucket, every social share of the homepage loses its image. Host OG images on your own domain.

**OG tags incomplete:**
- `og:title` is filled in the HTML: "Purple Cove Labs - B2B AI Systems"
- `og:description` has a typo: "Web Develpment" (missing an 'o')
- `og:image` is third-party hosted
- `og:url` says `purplecovelabs.com`

**Twitter card is `summary_large_image` with `@PurpleCoveLabs`.** Verify this Twitter/X account exists. If not, the card renders with an orphaned @mention.

**Meta description typo.** `"AI-powered systems built for business scale. \nAutomation, AI Agents, Custom Tools, Web Develpment & Apps."` — "Develpment" is a typo. This appears in Google search results.

**Keywords meta tag.** `<meta name="keywords" content="AI automation, AI agents...">` — Google has ignored this tag since 2009. It is noise.

**Page titles on sub-pages.** Portafolio, Planes, Apps, and the 404 page all inherit the root `index.html` title ("Purple Cove Labs - B2B AI Systems") unless explicitly overridden by Helmet. Portafolio and Planes have no Helmet setup — they have the wrong title in the browser tab and in Google's index.

---

## 13. Security & Hygiene Audit

### Critical

**`.env` is tracked by git.** The `.gitignore` contains `*.local` but NOT `.env`. The file `/.env` (not `/.env.local`) contains:
```
VITE_SUPABASE_PROJECT_ID="cgalnrggnutkubmdwihg"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://cgalnrggnutkubmdwihg.supabase.co"
```
This file is committed to the repository and will appear in full on GitHub. While Supabase anon keys are designed to be client-side public (Row Level Security protects the data), the project ID and URL are now permanently in git history. Add `.env` to `.gitignore` immediately. Rotate the key if you consider the project ID sensitive.

Additionally: the `VITE_` prefix means these values are bundled into the client-side JavaScript and visible to any user who opens DevTools. This is by design for Supabase anon keys — but document it explicitly so future contributors don't accidentally add service role keys with a `VITE_` prefix.

### Moderate

**`/admin` route is unauthenticated at the URL level.** If `useAuth` redirects unauthenticated users, this is handled correctly at the component level. But the route exists, is crawlable, and reveals the shape of the application. Move the admin interface off the public marketing domain.

**Broken `href="#"` in production.** `Portafolio.tsx` ships a `target="_blank"` anchor pointing to `#`. This is both a UX failure and opens a tabnapping vector (though `rel="noopener noreferrer"` is correctly applied).

**No Content Security Policy.** No CSP header or `<meta http-equiv="Content-Security-Policy">`. Not critical, but standard hygiene for a site that loads third-party iframes (Demos page).

### Minor

**`lovable-tagger` in devDependencies.** This is a Lovable-proprietary tool. It instruments the code for Lovable's editing interface. Once you stop using Lovable as an editor, this tool is dead weight. It may also inject comments or attributes into your output.

**`console.log` presence?** Did not find explicit console.log statements in reviewed files. Acceptable.

---

## 14. Top 25 Issues Ranked by Impact

| # | Issue | Category | Impact |
|---|---|---|---|
| 1 | React SPA — no SSR/SSG — SEO near-zero for crawlers | Architecture/SEO | Critical |
| 2 | Canonical points to `purplecovelabs.com`, not `purpleoryn.com` | SEO | Critical |
| 3 | `lang="en"` on a Spanish site | SEO/Accessibility | Critical |
| 4 | 567 KB vendor bundle — mobile performance failure | Performance | Critical |
| 5 | `.env` tracked in git | Security | Critical |
| 6 | Hero has no WhatsApp CTA — primary lead channel absent from top of page | Conversion | Critical |
| 7 | PresenciaDigitalExpress placed before trust-building (position 2) | Conversion | Critical |
| 8 | Anonymous testimonials with no verifiable identity | Trust/Conversion | High |
| 9 | `href="#"` live Loom placeholder on Portafolio | Content/Trust | High |
| 10 | Two pricing systems with different currencies (RD$ vs USD) | Conversion/Trust | High |
| 11 | 12+ dead components and 1 dead page file | Maintainability | High |
| 12 | Language toggle exists but homepage is 100% hardcoded Spanish | UX/Conversion | High |
| 13 | `@calcom/embed-react` installed but BookingButton is a plain link | Performance | High |
| 14 | Four different contact mechanisms with no hierarchy | Conversion | High |
| 15 | OG image hosted on GPT Engineer's Google Cloud Storage | SEO/Brand | High |
| 16 | No sitemap.xml, no `Sitemap:` in robots.txt | SEO | High |
| 17 | HowItWorks and SocialProof built but absent from homepage | Conversion | High |
| 18 | Meta description typo "Develpment" | SEO | Medium |
| 19 | Fonts referenced in PresenciaDigitalExpress never loaded | Design | Medium |
| 20 | `ScrollReveal` ignores `prefers-reduced-motion` | Accessibility | Medium |
| 21 | `/admin` and `/auth` crawlable, no disallow in robots.txt | Security/SEO | Medium |
| 22 | `gmail.com` email in professional footer | Trust/Brand | Medium |
| 23 | Manufactured urgency ("Últimos cupos") used 4x on homepage | Conversion | Medium |
| 24 | Apps page has "Video demo próximamente" — empty page | Conversion | Medium |
| 25 | No per-page `<title>` on Portafolio or Planes | SEO | Medium |

---

## 15. Quick Wins

These can be shipped in under 1 hour each:

| Win | File(s) | Effort |
|---|---|---|
| Fix `lang="es"` in index.html | `index.html:2` | <5 min |
| Fix canonical to `purpleoryn.com` | `index.html:14` | <5 min |
| Fix OG description typo "Develpment" | `index.html:50` | <5 min |
| Add `.env` to `.gitignore` | `.gitignore` | <5 min |
| Add `Sitemap: https://purpleoryn.com/sitemap.xml` to robots.txt | `public/robots.txt` | <5 min |
| Add `Disallow: /admin` and `Disallow: /auth` to robots.txt | `public/robots.txt` | <5 min |
| Fix `href="#"` Loom placeholder — change to disabled state or remove | `Portafolio.tsx:351` | 15 min |
| Remove `purplecoves@gmail.com` from footer — use only professional email | `Footer.tsx:44–47` | 5 min |
| Remove `<Toaster>` duplicate — keep only Sonner | `App.tsx:3,27` | 5 min |
| Add `<Helmet>` with page-specific titles to Portafolio, Planes, Apps | Page files | 20 min |
| Delete dead page: `src/pages/Pricing.tsx` | — | 2 min |
| Delete 12 dead components | `src/components/*.tsx` | 10 min |
| Move OG image to `public/og-image.png` and update `index.html` | `index.html:37–38` | 15 min |
| Add `fetchpriority="high"` to hero founder image | `Hero.tsx:67` | 2 min |
| Add `width` and `height` to hero img to prevent layout shift | `Hero.tsx:67–70` | 5 min |

---

## 16. Major Refactors

| Refactor | Effort | Impact |
|---|---|---|
| Migrate to Astro (or Next.js) for SSR/SSG | Multi-Day | Critical SEO fix |
| Strip unused Radix primitives and dead dependencies | Half Day | ~300 KB JS reduction |
| Unify pricing — one currency, one source of truth | Half Day | Critical trust fix |
| Rebuild homepage section order (add HowItWorks, SocialProof) | 1 Day | Conversion improvement |
| Complete or remove the language system (pick one) | 1 Day | UX/polish fix |
| Move Admin to separate subdomain | 1 Day | Security + clarity |
| Replace anonymous testimonials with real attributed proof | Half Day | Trust critical fix |
| Fix PresenciaDigitalExpress to use Tailwind design tokens | Half Day | Design consistency |
| Load fonts properly in index.html or remove font references | Half Day | Design fix |
| Implement real sitemap generation | Half Day | SEO fix |

---

## 17. Recommended Information Architecture

**Recommended sitemap:**
```
/ (Homepage — single-scroll, 10 sections)
/portafolio (Case studies with real results)
/demos (Live demo browser by industry)
/planes (Retainer pricing — bottom funnel)
/contacto (dedicated contact page with WhatsApp + email + Cal.com)
```

**Remove completely:**
- `/apps` — hide until product video is ready
- `/pricing` redirect — it already redirects, just remove the route entry
- `/auth` — move to auth.purpleoryn.com or admin.purpleoryn.com
- `/admin` — same as above

---

## 18. Recommended Homepage Wireframe

```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Logo · Portafolio · Demos · Planes · [WhatsApp] │
├─────────────────────────────────────────────────────────┤
│ HERO                                                    │
│   Headline: "Automatizamos tu negocio para que funcione │
│   sin depender de ti."                                  │
│   Sub: "Sitios web, automatizaciones e IA para negocios │
│   en República Dominicana."                             │
│   CTA PRIMARY: [WhatsApp → Conversemos]                 │
│   CTA SECONDARY: [Ver casos de éxito]                   │
│   Photo: Gamal (right side)                             │
├─────────────────────────────────────────────────────────┤
│ PROBLEM (4 cards, pain points)                          │
├─────────────────────────────────────────────────────────┤
│ HOW IT WORKS (3 steps: Diagnóstico → Implementación →   │
│ Optimización) ← currently built but NOT on homepage     │
├─────────────────────────────────────────────────────────┤
│ SOCIAL PROOF: Stats + 3 testimonials WITH real names    │
│ ← currently built but NOT on homepage                   │
├─────────────────────────────────────────────────────────┤
│ OFFER: What we build (service menu)                     │
├─────────────────────────────────────────────────────────┤
│ RETAINERS PREVIEW: 3 plan cards                         │
├─────────────────────────────────────────────────────────┤
│ PRESENCIA DIGITAL EXPRESS: entry-level offer            │
│ (positioned as accessible first step, not sales pitch)  │
├─────────────────────────────────────────────────────────┤
│ FINAL CTA: WhatsApp PRIMARY · Cal.com secondary         │
├─────────────────────────────────────────────────────────┤
│ FOOTER: Professional email only · navigation · legal    │
└─────────────────────────────────────────────────────────┘
```

---

## 19. Component Refactor Plan

| Component | Action | Reason |
|---|---|---|
| `StickyMobileCTA.tsx` | Delete | Never used; branch confirms removal |
| `CaseStudy.tsx` | Delete | Never used |
| `CTA.tsx` | Delete | Never used |
| `NavLink.tsx` | Delete | Never used; Header duplicates logic |
| `Newsletter.tsx` | Delete | Never used |
| `OngoingBuilds.tsx` | Delete | Never used |
| `Process.tsx` | Delete | Never used |
| `Services.tsx` | Delete | Never used |
| `StrategySession.tsx` | Delete | Never used |
| `Testimonials.tsx` | Delete | Never used; SocialProof replaces it |
| `WhyUs.tsx` | Delete | Never used |
| `BookingButton.tsx` | Simplify | Remove `as` prop; just export the link |
| `WhatsAppButton.tsx` | Promote | Add to hero CTA |
| `ScrollReveal.tsx` | Fix | Add prefers-reduced-motion check |
| `PresenciaDigitalExpress.tsx` | Refactor | Replace hardcoded hex/fontFamily with design tokens |
| `Header.tsx` | Fix | Deduplicate badge JSX (duplicated in static/Link branches) |
| `Footer.tsx` | Fix | Remove gmail address; add one canonical email |

---

## 20. Codebase Refactor Plan

**Phase 1 — Immediate Cleanup (Half Day):**
1. Delete all dead components (12 files)
2. Delete `src/pages/Pricing.tsx`
3. Add `.env` to `.gitignore`
4. Fix `index.html`: lang, canonical, typo, OG image
5. Add page-specific Helmet to Portafolio, Planes, Apps
6. Fix robots.txt

**Phase 2 — Dependency Trim (Half Day to 1 Day):**
1. Remove: `@calcom/embed-react`, `cmdk`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-resizable-panels`, `vaul`
2. Audit `recharts`, `react-day-picker`, `react-hook-form`, `zod`, `date-fns` — move to admin-only bundle or remove
3. Remove all unused Radix UI packages (audit which shadcn/ui components are actually used)
4. Remove `lovable-tagger` if no longer using Lovable as an editor
5. Run `vite build --analyze` to verify bundle size improvements

**Phase 3 — Conversion Architecture (1 Day):**
1. Reorder Index.tsx sections: add HowItWorks, SocialProof; move PresenciaDigitalExpress to position 8
2. Add WhatsApp CTA to Hero
3. Unify pricing currency across RetainersPreview and Retainers
4. Fix or remove broken Loom placeholder
5. Replace anonymous testimonials with real names + company names + photos

**Phase 4 — Rendering Strategy (Multi-Day):**
1. Migrate to Astro (recommended) or Next.js for SSR/SSG
2. Pre-render all pages as static HTML
3. Implement proper sitemap.xml generation
4. Ensure OG tags are in the static HTML shell

---

## 21. Conversion Optimization Plan

**Priority 1: Put WhatsApp in the Hero (Quick Win)**
The single highest-impact change on this site. Replace one of the two hero CTAs with a WhatsApp button using the existing `WhatsAppButton` component.

**Priority 2: Reorder Homepage Sections**
Add HowItWorks before SocialProof. Move PresenciaDigitalExpress after RetainersPreview. Build the trust sequence before the ask.

**Priority 3: Fix Testimonials**
Contact ArKyTeK and the Vielma Group founders for attribution permission. Real names + faces + company names. If you cannot get attributed quotes from real clients, remove the testimonial section entirely and replace it with the Portafolio link.

**Priority 4: Unify Lead Capture**
One WhatsApp number. One email address. One calendar link. Remove Fluum.ai from PricingCTA unless it is replacing Cal.com entirely. Remove the Gmail address.

**Priority 5: Kill Fabricated Urgency**
The "últimos cupos" badge erodes trust with repeat visitors. Replace with a genuine signal: "Proyecto siguiente disponible en [month]" — updated once a month. Or remove it entirely.

---

## 22. Accessibility Roadmap

| Issue | Fix | Timeline |
|---|---|---|
| `lang="en"` on Spanish content | Change to `lang="es"` | Today |
| `ScrollReveal` ignores reduced-motion | Add media query check | Quick Win |
| Missing `aria-haspopup` on language toggle | Add attribute | Quick Win |
| No skip-to-main-content link | Add at top of each page | Quick Win |
| Missing page-level titles for screen readers | Add Helmet to all pages | This week |
| Contrast ratio verification | Audit muted-foreground on dark bg | 1 Day |
| Focus indicators on glass-card buttons (Demos page) | Add visible :focus-visible ring | Half Day |

---

## 23. Performance Roadmap

| Change | Expected Impact |
|---|---|
| Remove dead dependencies | –150–200 KB JS |
| Migrate to Astro/Next.js static | FCP <1s, no JS-blocking render |
| Add `fetchpriority="high"` to LCP image | –200–500ms LCP |
| Add explicit `width`/`height` to images | Eliminate layout shift |
| Load fonts in index.html or remove font references | Eliminate fallback flash |
| Replace ScrollReveal with CSS `@keyframes` + IntersectionObserver | Remove JS wrapper overhead |
| Move admin to separate route/app | Remove Supabase + React Query from marketing bundle |

**Target after full performance roadmap:**
- Vendor bundle: <100 KB (down from 567 KB)
- Total JS: <150 KB (down from 730 KB)
- Lighthouse mobile: 85+ (up from projected 30–45)
- LCP: <2.5s on 4G

---

## 24. Prioritized Implementation Roadmap

### Week 1 — Critical Fixes (No Feature Work)
- [ ] `lang="es"` in index.html
- [ ] Fix canonical URL
- [ ] Fix OG description typo
- [ ] Add `.env` to `.gitignore`
- [ ] Fix robots.txt (disallow /admin /auth, add Sitemap)
- [ ] Fix `href="#"` Loom placeholder in Portafolio
- [ ] Remove gmail from footer
- [ ] Delete 12 dead components + 1 dead page
- [ ] Add `fetchpriority="high"` and dimensions to hero image
- [ ] Move OG image to /public, update index.html
- [ ] Add Helmet titles to Portafolio, Planes, Apps

### Week 2 — Conversion Fixes
- [ ] Add WhatsApp button to hero
- [ ] Reorder homepage sections (HowItWorks, SocialProof, PresenciaDigitalExpress position)
- [ ] Unify pricing currency (pick RD$ or USD, apply everywhere)
- [ ] Fix or remove Apps page "Video demo próximamente"
- [ ] Begin real testimonial collection (contact ArKyTeK, Vielma Group)
- [ ] Audit and reduce urgency copy

### Week 3 — Technical Debt
- [ ] Remove unused npm packages
- [ ] Complete or remove the language toggle system
- [ ] Fix fonts in PresenciaDigitalExpress
- [ ] Unify contact channels
- [ ] Add sitemap.xml

### Month 2 — Rendering Migration
- [ ] Evaluate Astro vs Next.js
- [ ] Migrate to SSG
- [ ] Move /auth and /admin to separate subdomain
- [ ] Lighthouse audit post-migration

---

## 25. Final Verdict

**If Purple Cove Labs were paying premium rates for this website, would you approve it for launch?**

**No.** Not in its current state.

The site has bones worth keeping. The visual identity is coherent and distinctive. The copy has real moments of clarity. The case study content in Portafolio is genuinely impressive. The PresenciaDigitalExpress offer is clever as a product concept. The three-step HowItWorks is clean and credible.

But a premium agency website cannot ship:
- A 567 KB vendor bundle on a 10-section marketing page
- A canonical URL pointing to the wrong domain
- `lang="en"` on a Spanish-language site
- Supabase credentials in a git-tracked `.env` file
- Anonymous testimonials with no verifiable human behind them
- A live `href="#"` on the portfolio page
- Two pricing systems with two different currencies
- 12 dead components that prove the codebase was never cleaned after generation
- An admin panel crawlable from the same domain as the public marketing site
- Fonts that are referenced in inline styles but never loaded

Every one of these items would get caught in a basic code review. None of them are hard to fix. Together they tell a story: this site was launched fast, never audited, and never held to the standard it claims to set.

The bar is not arbitrary. Purple Cove Labs is selling premium web development and AI systems. Every visitor to this site is implicitly evaluating whether PCL can build them something better than this. Right now, the answer too many of them are walking away with is: probably not.

Fix the Week 1 critical items today. Implement the conversion changes next week. The site can become what it needs to be — a site that closes deals — in 3 weeks of focused work. The foundation is there. The execution is not.

---

*Audit generated: 2026-08-06 | auditor: elite multidisciplinary review panel | repository: GamalFJ/purpleoryn*
