import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Gift,
  UsersThree,
  ArrowUpRight,
  CheckCircle,
  DeviceMobile,
  CreditCard,
  ChatCircleText,
  CalendarCheck,
  Sparkle,
  TrendUp,
  Crown,
  Microphone,
  Globe,
  Robot,
} from '@phosphor-icons/react/dist/ssr';
import { buttonClass } from '@/components/ui/button';
import { IconTile } from '@/components/ui/IconTile';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { cn } from '@/lib/cn';
import { TONE } from '@/lib/tone';
import type { MarketConfig } from '@/markets/types';

interface MarketLandingProps {
  config: MarketConfig;
  showPrices: boolean;
  locale: string;
}

function formatPriceNumber(num: number | null | undefined, symbol: string): string {
  if (num === null || num === undefined) return '';
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Heights matching the Dominican TierStairs progression
const STEP_HEIGHT = ['md:min-h-[34rem]', 'md:min-h-[38rem]', 'md:min-h-[42rem]'];

export function MarketLanding({ config, showPrices, locale }: MarketLandingProps) {
  const content = config.content[locale] || config.content[config.defaultLocale] || Object.values(config.content)[0];
  const { hero, system, guarantee, faq, paymentNote, cta, legal } = content;
  const prices = config.prices;

  const hasAnyPrice =
    showPrices &&
    (prices.presence.monthly !== null ||
      prices.conversion.monthly !== null ||
      prices.authority.monthly !== null);

  const isFrench = locale.startsWith('fr');

  const copy = {
    demoBadge: isFrench ? 'Démonstrateur Interactif' : 'Live Interactive Demo',
    demoLinkText: isFrench ? 'Tester le démonstrateur en direct' : 'Test the live interactive demo',
    plansTitle: isFrench ? 'Plans et investissement' : 'Plans and Investment',
    plansSubtitle: isFrench
      ? 'Une infrastructure complète, sans frais cachés. Un paiement unique de mise en place et un abonnement mensuel d entretien.'
      : 'Complete infrastructure with zero hidden fees. One-time deployment fee and predictable monthly management.',
    consultationPricingText: isFrench
      ? 'Les tarifs sont partagés lors de votre consultation'
      : 'Pricing is shared during your consultation',
    consultationPricingSub: isFrench
      ? 'Nous analysons votre volume de demandes et configurons la solution adaptée à votre modèle commercial.'
      : 'We evaluate your inbound volume and configure the ideal setup for your business.',
    bookConsultationAction: isFrench ? 'Réserver une consultation' : 'Book a Consultation',
    recommendedBadge: isFrench ? 'Recommandé' : 'Recommended',
    setupLabel: isFrench ? 'Mise en place' : 'One-time setup',
    monthlyLabel: isFrench ? '/mois' : '/mo',
    convosLabel: isFrench ? 'conversations / mois incluses' : 'conversations / month included',
    overageLabel: isFrench ? 'Conversation supplémentaire:' : 'Extra conversation:',
    voiceAddonTitle: isFrench ? 'Module Agente de Voz IA' : 'AI Voice Agent Add-on',
    voiceAddonDesc: isFrench
      ? 'Prenez en charge les appels vocaux entrants 24h/24 avec une voix naturelle.'
      : 'Handle inbound customer voice calls 24/7 with human-grade natural speech.',
    voiceMinutes: isFrench ? '300 minutes / mois incluses' : '300 minutes / month included',
    voiceOverage: isFrench ? 'Minute supplémentaire:' : 'Extra minute:',
    faqTitle: isFrench ? 'Questions fréquentes' : 'Frequently Asked Questions',
    paymentHeading: isFrench ? 'Modalités de règlement' : 'Payment Rails and Terms',
    ctaSecondaryText: isFrench
      ? 'Accompagnement direct par nos fondateurs.'
      : 'Direct execution by senior technical founders.',
  };

  const channelIcon =
    cta.type === 'sms' ? (
      <ChatCircleText size={18} weight="bold" />
    ) : cta.type === 'whatsapp' ? (
      <ChatCircleText size={18} weight="bold" />
    ) : (
      <CalendarCheck size={18} weight="bold" />
    );

  const destination = cta.destination;

  return (
    <div className="min-h-screen bg-paper text-body selection:bg-accent selection:text-accent-ink">
      {/* ─── Sticky Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/media/logo.webp"
              alt="Purple Cove Labs"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
              priority
            />
            <div className="flex items-center gap-2">
              <span className="font-display text-[17px] font-semibold tracking-tight text-ink sm:inline">
                Purple Cove Labs
              </span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-mono font-medium text-accent">
                {config.name}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Multi-language switcher if supported */}
            {config.supportedLocales.length > 1 && (
              <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-xs">
                <Globe size={14} className="text-muted ml-1.5 mr-0.5" />
                {config.supportedLocales.map((loc) => (
                  <Link
                    key={loc}
                    href={`/?lang=${loc}`}
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all',
                      locale.startsWith(loc)
                        ? 'bg-gradient-action text-accent-ink shadow-xs'
                        : 'text-muted hover:text-ink',
                    )}
                  >
                    {loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}

            <a
              href={destination}
              target={destination.startsWith('http') ? '_blank' : undefined}
              rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={buttonClass('primary', 'sm')}
            >
              {channelIcon}
              <span>{cta.label}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden">
        {/* Ambient color wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <div className="animate-drift absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl" />
          <div className="animate-drift absolute -top-10 right-[8%] h-[22rem] w-[22rem] rounded-full bg-fuchsia/15 blur-3xl [--drift-x:-60px] [--drift-y:40px] [animation-duration:19s]" />
          <div className="animate-drift absolute bottom-[-8rem] left-[30%] h-[20rem] w-[20rem] rounded-full bg-warm/15 blur-3xl [--drift-x:50px] [--drift-y:-20px] [animation-duration:22s]" />
          <div className="animate-drift absolute bottom-[-6rem] right-[-4rem] h-[18rem] w-[18rem] rounded-full bg-teal/15 blur-3xl [--drift-x:-30px] [animation-duration:18s]" />
        </div>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 sm:px-6 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:pt-16">
          <div className="pb-4 md:pb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              <Sparkle size={14} weight="fill" />
              {hero.badge}
            </span>

            <h1 className="text-gradient-brand mt-4 pb-[0.1em] text-[2.25rem] font-semibold leading-[1.06] sm:text-[2.75rem] lg:text-[3.25rem]">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-body">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={destination}
                target={destination.startsWith('http') ? '_blank' : undefined}
                rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={buttonClass('primary', 'lg')}
              >
                {channelIcon}
                <span>{hero.ctaText}</span>
              </a>

              <a
                href="https://demo.purpleoryn.com"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('secondary', 'lg')}
              >
                <span>{copy.demoLinkText}</span>
                <ArrowUpRight size={16} weight="bold" />
              </a>
            </div>
          </div>

          {/* Hero Visual Card with Oryn Presence branding */}
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_50px_-20px_rgb(28_16_48/0.2)] md:max-w-none">
            <div className="flex items-center gap-4 border-b border-line pb-4">
              <Image
                src="/media/oryn-presence.webp"
                alt="Oryn Presence"
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 drop-shadow-[0_12px_24px_rgb(109_47_216/0.4)]"
                priority
              />
              <div>
                <p className="font-display text-lg font-semibold text-ink">Oryn Presence</p>
                <p className="text-xs text-muted">Complete Commercial Growth System</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-body">
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">Website Architecture</span>
                <span className="font-mono text-teal-ink font-semibold">Sub-second Next.js</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">Local Search Engine</span>
                <span className="font-mono text-accent font-semibold">Structured Geo-SEO</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">Lead Intake Channel</span>
                <span className="font-mono text-warm-ink font-semibold uppercase">{config.primaryChannel} 24/7</span>
              </div>
            </div>

            <a
              href="https://demo.purpleoryn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-between rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-xs font-semibold text-accent hover:border-accent hover:text-accent-hover transition-colors"
            >
              <span>{copy.demoBadge}</span>
              <span className="flex items-center gap-1 font-mono">
                demo.purpleoryn.com <ArrowUpRight size={14} weight="bold" />
              </span>
            </a>
          </div>
        </section>
      </div>

      {/* ─── The Three-Part System ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Architecture
          </span>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {system.sectionTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {system.sectionSubtitle}
          </p>
        </div>

        <ol className="mt-12 grid gap-0 md:grid-cols-3 md:gap-6">
          {system.parts.map((part, i) => {
            const tones = ['teal', 'violet', 'amber'] as const;
            const tone = tones[i % tones.length];
            const icons = [DeviceMobile, Globe, Robot];
            const PartIcon = icons[i % icons.length];
            const last = i === system.parts.length - 1;

            return (
              <li
                key={part.title}
                className={cn(
                  'group relative flex gap-4 pb-8 md:flex-col md:pb-0',
                  !last &&
                    'before:absolute before:bottom-1 before:left-6 before:top-15 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-accent/50 before:to-fuchsia/10 md:before:hidden md:after:absolute md:after:left-17 md:after:right-2 md:after:top-6 md:after:h-0.5 md:after:rounded-full md:after:bg-linear-to-r md:after:from-accent/50 md:after:to-fuchsia/10',
                )}
              >
                <span className="relative z-10 shrink-0 self-start">
                  <IconTile icon={PartIcon} tone={tone} />
                  <span className="tabular absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-accent to-fuchsia text-[11px] font-semibold text-accent-ink ring-2 ring-paper">
                    {part.step}
                  </span>
                </span>
                <div className="md:pr-6">
                  <h3 className="text-lg font-semibold leading-snug text-ink">{part.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-body">{part.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Realistic Interactive Phone Mock (SMS for US, Messaging for CA/HT) */}
        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <figure className="mx-auto w-full max-w-[22rem]">
            <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-[#1c1c1e] bg-[#1c1c1e] shadow-[0_32px_64px_-32px_rgb(28_16_48/0.55)]">
              {/* Phone Header */}
              <div className="flex items-center gap-3 bg-[#f5f5f7] px-4 py-3 text-ink dark:bg-[#1f1f23] dark:text-[#f1ecf8]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {config.primaryChannel === 'sms' ? 'US' : 'QC'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight">
                    {config.primaryChannel === 'sms' ? 'New Client Inquiry' : 'Demande Client'}
                  </p>
                  <p className="text-[10px] text-muted font-mono">
                    {config.primaryChannel === 'sms' ? 'SMS • Qualified by Oryn' : 'WhatsApp • Qualifié par Oryn'}
                  </p>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-3 bg-[#f0eff5] p-3 text-xs leading-relaxed dark:bg-[#121216]">
                <div className="text-center">
                  <span className="rounded-full bg-surface/70 px-2.5 py-0.5 text-[10px] font-medium text-muted">
                    {isFrench ? 'Hier, 21:38' : 'Yesterday, 9:38 PM'}
                  </span>
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink shadow-xs">
                  <p>
                    {isFrench
                      ? 'Bonjour, j ai trouvé votre site sur Google. Proposez-vous un rendez-vous cette semaine ?'
                      : 'Hi, I found your company on Google. Do you have availability for a consultation this week?'}
                  </p>
                  <span className="mt-1 block text-right text-[10px] text-muted">9:38 PM</span>
                </div>

                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                  <p>
                    {isFrench
                      ? 'Bonjour, avec plaisir! Nous avons des disponibilités mercredi à 14h ou jeudi à 10h. Quel créneau vous convient le mieux ?'
                      : 'Hi Michael, yes we do! We have openings Wednesday at 2:00 PM or Thursday at 10:00 AM. Which day works better for you?'}
                  </p>
                  <span className="mt-1 block text-right text-[10px] text-accent-ink/80">9:39 PM</span>
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink shadow-xs">
                  <p>
                    {isFrench ? 'Jeudi à 10h est parfait.' : 'Thursday at 10:00 AM works great for me.'}
                  </p>
                  <span className="mt-1 block text-right text-[10px] text-muted">9:40 PM</span>
                </div>

                <div className="rounded-xl border border-teal/30 bg-teal-soft p-2.5 text-[11px] text-teal-ink">
                  <p className="font-semibold">
                    {isFrench ? '✓ Demande qualifiée par Oryn IA' : '✓ Lead Qualified by Oryn AI'}
                  </p>
                  <p className="text-[10px] text-body mt-0.5">
                    {isFrench
                      ? 'Client: Michel D. • Créneau: Jeudi 10h00 • Canal: SMS'
                      : 'Client: Michael D. • Time: Thursday 10:00 AM • Channel: SMS'}
                  </p>
                </div>
              </div>
            </div>
          </figure>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-ink">
              Seamless Handoff
            </span>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
              {isFrench
                ? 'Ne laissez plus refroidir aucun prospect qualifié'
                : 'Never let a qualified prospective client go cold'}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-body">
              {isFrench
                ? 'Votre site web convertit immédiatement. L agent d intelligence artificielle engage chaque visiteur à toute heure du jour et de la nuit, valide leurs besoins spécifiques et vous transmet l opportunité directement.'
                : 'Your website captures instant intent. The AI agent engages visitors at any hour, collects the required project details, and hands over a hot lead ready for closing.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <IconTile icon={CheckCircle} tone="teal" size="sm" />
              <span className="text-sm font-medium text-ink">
                {isFrench ? 'Zéro friction pour vos prospects' : 'Zero friction for your buyers'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-ink">
            Investment
          </span>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {copy.plansTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {copy.plansSubtitle}
          </p>
        </div>

        {hasAnyPrice ? (
          <>
            {/* 3 Stepped Tiers (TierStairs style) */}
            <ol className="mt-12 grid gap-4 md:grid-cols-3 md:items-end">
              {/* Tier 1: Presence */}
              <li>
                <article
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7',
                    TONE['teal'].border,
                    STEP_HEIGHT[0],
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('absolute inset-x-0 top-0 h-1.5 bg-linear-to-r', TONE['teal'].bar)}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <IconTile icon={Sparkle} tone="teal" />
                  </div>
                  <h3 className={cn('mt-4 text-2xl font-semibold', TONE['teal'].text)}>
                    Oryn Presence
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">
                    {isFrench
                      ? 'Fondation numérique essentielle avec captation automatique.'
                      : 'Essential digital foundation with automatic lead intake.'}
                  </p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                      {copy.setupLabel}
                    </p>
                    <p className="tabular text-2xl font-semibold text-ink">
                      {formatPriceNumber(prices.presence.setup, prices.currencySymbol)}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                        Monthly retainer
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="tabular text-3xl font-bold text-ink">
                          {formatPriceNumber(prices.presence.monthly, prices.currencySymbol)}
                        </span>
                        <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                    <li className="flex gap-2.5">
                      <CheckCircle
                        size={20}
                        weight="duotone"
                        className={cn('mt-px shrink-0', TONE['teal'].text)}
                      />
                      <span>
                        {prices.presence.conversationsIncluded} {copy.convosLabel}
                      </span>
                    </li>
                    {prices.presence.overageRate && (
                      <li className="flex gap-2.5 text-xs text-muted">
                        <span>
                          {copy.overageLabel} {prices.presence.overageRate}
                        </span>
                      </li>
                    )}
                  </ul>

                  <a
                    href={destination}
                    target={destination.startsWith('http') ? '_blank' : undefined}
                    rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={buttonClass('secondary', 'md', 'mt-8 w-full')}
                  >
                    <span>{cta.label}</span>
                  </a>
                </article>
              </li>

              {/* Tier 2: Conversion (RECOMMENDED) */}
              <li>
                <article
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 border-glow shadow-[0_28px_56px_-30px_rgb(162_28_175/0.55)]',
                    STEP_HEIGHT[1],
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('absolute inset-x-0 top-0 h-1.5 bg-linear-to-r', TONE['violet'].bar)}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <IconTile icon={TrendUp} tone="violet" />
                    <span className="inline-flex w-fit items-center rounded-full bg-warm px-2.5 py-0.5 text-xs font-semibold text-on-warm">
                      {copy.recommendedBadge}
                    </span>
                  </div>
                  <h3 className={cn('mt-4 text-2xl font-semibold', TONE['violet'].text)}>
                    Oryn Conversion
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">
                    {isFrench
                      ? 'Pour les entreprises actives qui veulent dominer leur secteur local.'
                      : 'For active businesses aiming to lead their regional market.'}
                  </p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                      {copy.setupLabel}
                    </p>
                    <p className="tabular text-2xl font-semibold text-ink">
                      {formatPriceNumber(prices.conversion.setup, prices.currencySymbol)}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                        Monthly retainer
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="tabular text-3xl font-bold text-warm-ink">
                          {formatPriceNumber(prices.conversion.monthly, prices.currencySymbol)}
                        </span>
                        <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                    <li className="flex gap-2.5">
                      <CheckCircle
                        size={20}
                        weight="duotone"
                        className={cn('mt-px shrink-0', TONE['violet'].text)}
                      />
                      <span>
                        {prices.conversion.conversationsIncluded} {copy.convosLabel}
                      </span>
                    </li>
                    {prices.conversion.overageRate && (
                      <li className="flex gap-2.5 text-xs text-muted">
                        <span>
                          {copy.overageLabel} {prices.conversion.overageRate}
                        </span>
                      </li>
                    )}
                  </ul>

                  <a
                    href={destination}
                    target={destination.startsWith('http') ? '_blank' : undefined}
                    rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={buttonClass('primary', 'md', 'mt-8 w-full shadow-md')}
                  >
                    <span>{cta.label}</span>
                  </a>
                </article>
              </li>

              {/* Tier 3: Authority */}
              <li>
                <article
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7',
                    TONE['rose'].border,
                    STEP_HEIGHT[2],
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('absolute inset-x-0 top-0 h-1.5 bg-linear-to-r', TONE['rose'].bar)}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <IconTile icon={Crown} tone="rose" />
                  </div>
                  <h3 className={cn('mt-4 text-2xl font-semibold', TONE['rose'].text)}>
                    Oryn Authority
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">
                    {isFrench
                      ? 'Infrastructure de pointe, multi-secteurs et volume élevé.'
                      : 'Top-tier infrastructure for maximum scale and volume.'}
                  </p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                      {copy.setupLabel}
                    </p>
                    <p className="tabular text-2xl font-semibold text-ink">
                      {formatPriceNumber(prices.authority.setup, prices.currencySymbol)}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-muted uppercase tracking-wider font-semibold">
                        Monthly retainer
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="tabular text-3xl font-bold text-ink">
                          {formatPriceNumber(prices.authority.monthly, prices.currencySymbol)}
                        </span>
                        <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                    <li className="flex gap-2.5">
                      <CheckCircle
                        size={20}
                        weight="duotone"
                        className={cn('mt-px shrink-0', TONE['rose'].text)}
                      />
                      <span>
                        {prices.authority.conversationsIncluded} {copy.convosLabel}
                      </span>
                    </li>
                    {prices.authority.overageRate && (
                      <li className="flex gap-2.5 text-xs text-muted">
                        <span>
                          {copy.overageLabel} {prices.authority.overageRate}
                        </span>
                      </li>
                    )}
                  </ul>

                  <a
                    href={destination}
                    target={destination.startsWith('http') ? '_blank' : undefined}
                    rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={buttonClass('secondary', 'md', 'mt-8 w-full')}
                  >
                    <span>{cta.label}</span>
                  </a>
                </article>
              </li>
            </ol>

            {/* AI Voice Agent Addon (AddonSection style) */}
            {prices.voiceAddon && prices.voiceAddon.monthly !== null && (
              <div className="mt-10 overflow-hidden rounded-[var(--radius-panel)] border border-teal/30 bg-linear-to-br from-teal-soft via-surface to-accent-soft/60 p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-teal via-accent to-fuchsia"
                />
                <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
                  <div className="flex gap-4">
                    <IconTile icon={Microphone} tone="teal" size="lg" />
                    <div>
                      <h3 className="text-2xl font-semibold text-teal-ink">
                        {copy.voiceAddonTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-body">
                        {copy.voiceAddonDesc}
                      </p>
                      <p className="mt-3 text-sm font-medium text-ink">
                        {copy.voiceMinutes} • {copy.voiceOverage} {prices.voiceAddon.overageRate}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-muted">Powered by</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink">
                          <BrandLogo logo="elevenlabs" size={16} /> ElevenLabs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-surface p-5 text-right md:text-left">
                    <p className="text-xs text-muted uppercase font-semibold">
                      {copy.setupLabel}: {formatPriceNumber(prices.voiceAddon.setup, prices.currencySymbol)}
                    </p>
                    <div className="mt-1 flex items-baseline justify-end md:justify-start gap-1">
                      <span className="tabular text-3xl font-bold text-ink">
                        {formatPriceNumber(prices.voiceAddon.monthly, prices.currencySymbol)}
                      </span>
                      <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                    </div>
                    <a
                      href={destination}
                      target={destination.startsWith('http') ? '_blank' : undefined}
                      rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={buttonClass('primary', 'sm', 'mt-4 w-full')}
                    >
                      <span>Add Voice Agent</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Consultation Pricing Card when showPrices=false or prices null (CA or /choose pick) */
          <div className="mt-12 rounded-[var(--radius-panel)] border border-line bg-surface p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex justify-center">
              <IconTile icon={CalendarCheck} tone="violet" size="lg" />
            </div>
            <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-ink">
              {copy.consultationPricingText}
            </h3>
            <p className="mt-3 max-w-xl mx-auto text-base text-body leading-relaxed">
              {copy.consultationPricingSub}
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={destination}
                target={destination.startsWith('http') ? '_blank' : undefined}
                rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={buttonClass('primary', 'lg')}
              >
                {channelIcon}
                <span>{copy.bookConsultationAction}</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ─── Guarantee, Cap & Bonuses (OfferBlock style) ─────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          {guarantee.title}
        </h2>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <IconTile icon={ShieldCheck} tone="teal" size="lg" />
            <h3 className="mt-4 text-xl font-semibold text-ink">
              {isFrench ? 'Garantie de livraison 7 jours' : '7-Business-Day Delivery'}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              {guarantee.deliveryGuarantee}
            </p>
          </li>

          <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <IconTile icon={UsersThree} tone="amber" size="lg" />
            <h3 className="mt-4 text-xl font-semibold text-ink">
              {isFrench ? 'Limite stricte de 4 clients' : 'Strict 4-Client Monthly Cap'}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              {guarantee.capacityLimit}
            </p>
          </li>

          <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <IconTile icon={Gift} tone="violet" size="lg" />
            <h3 className="mt-4 text-xl font-semibold text-ink">
              {isFrench ? 'Deux bonus inclus' : 'Two Included Launch Bonuses'}
            </h3>
            <ul className="mt-2 space-y-1.5 text-[15px] text-body">
              {guarantee.bonuses.map((b) => (
                <li key={b.title} className="flex flex-col gap-0.5">
                  <span className="font-medium text-ink">• {b.title}</span>
                  <span className="text-xs text-muted pl-3">{b.description}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </section>

      {/* ─── FAQ Section ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <h2 className="text-3xl font-semibold sm:text-4xl">{copy.faqTitle}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faq.map((item) => (
            <div
              key={item.question}
              className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs"
            >
              <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-body">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Local Payment Rails Note ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex items-start gap-4 rounded-[var(--radius-panel)] border border-teal/30 bg-teal-soft p-6">
          <IconTile icon={CreditCard} tone="teal" />
          <div>
            <h3 className="text-base font-semibold text-teal-ink">{copy.paymentHeading}</h3>
            <p className="mt-1 text-sm text-body leading-relaxed">{paymentNote}</p>
          </div>
        </div>
      </section>

      {/* ─── Closing Deep Plum CTA Block ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-plum p-8 text-plum-ink shadow-2xl sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-plum-accent/20 blur-3xl"
          />
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-plum-ink leading-tight">
              {hero.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-plum-muted">
              {copy.ctaSecondaryText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={destination}
                target={destination.startsWith('http') ? '_blank' : undefined}
                rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={buttonClass('onPlum', 'lg')}
              >
                {channelIcon}
                <span>{cta.label}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface/50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 text-xs text-muted">
          <div className="flex items-center gap-2.5">
            <Image
              src="/media/logo.webp"
              alt="Purple Cove Labs"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
            />
            <span className="font-display text-sm font-semibold text-ink">Purple Cove Labs</span>
            <span>• {config.name}</span>
          </div>

          <p>{legal.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
