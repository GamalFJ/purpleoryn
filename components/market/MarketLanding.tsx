import Link from 'next/link';
import {
  ShieldCheck,
  Gift,
  UsersThree,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  DeviceMobile,
  MagnifyingGlass,
  Robot,
  CreditCard,
  ChatCircleText,
  CalendarCheck,
} from '@phosphor-icons/react/dist/ssr';
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
    demoBadge: isFrench ? 'Démonstrateur Interactif' : 'Interactive Demo',
    plansTitle: isFrench ? 'Plans et investissement' : 'Plans and Investment',
    plansSubtitle: isFrench
      ? 'Une infrastructure complète, sans frais cachés.'
      : 'Complete infrastructure with transparent monthly management.',
    consultationPricingText: isFrench
      ? 'Les tarifs sont partagés lors de votre consultation'
      : 'Pricing is shared during your consultation',
    consultationPricingSub: isFrench
      ? 'Nous analysons votre volume de demandes et concevons la solution adaptée à votre modèle commercial.'
      : 'We evaluate your inbound volume and configure the ideal setup for your business.',
    recommendedBadge: isFrench ? 'Recommandé' : 'Recommended',
    setupLabel: isFrench ? 'Mise en place initiale' : 'One-time setup',
    monthlyLabel: isFrench ? '/mois' : '/month',
    convosLabel: isFrench ? 'conversations / mois incluses' : 'conversations / month included',
    overageLabel: isFrench ? 'Par conversation supplémentaire:' : 'Extra conversation rate:',
    voiceAddonTitle: isFrench ? 'Module Agente de Voz IA' : 'AI Voice Agent Add-on',
    voiceAddonDesc: isFrench
      ? 'Prenez en charge les appels vocaux entrants 24 heures sur 24 avec une voix naturelle.'
      : 'Handle inbound customer voice calls 24/7 with human-grade natural speech.',
    voiceMinutes: isFrench ? '300 minutes / mois incluses' : '300 minutes / month included',
    voiceOverage: isFrench ? 'Par minute supplémentaire:' : 'Extra minute rate:',
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

  return (
    <div className="min-h-screen bg-[var(--paper,#f7f7f8)] dark:bg-[#111114] text-[var(--ink,#1c1030)] dark:text-[#f1ecf8] selection:bg-violet-600 selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--paper,#f7f7f8)]/80 dark:bg-[#111114]/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 font-bold text-white shadow-md shadow-violet-600/20">
              P
            </div>
            <div>
              <span className="block text-base font-semibold tracking-tight text-[var(--ink,#1c1030)] dark:text-white leading-tight">
                Purple Cove Labs
              </span>
              <span className="block text-xs font-mono text-[var(--muted,#6b7280)] dark:text-zinc-400">
                {config.name}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Bilingual toggle if supported */}
            {config.supportedLocales.length > 1 && (
              <div className="flex items-center rounded-full border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-1 text-xs">
                {config.supportedLocales.map((loc) => (
                  <Link
                    key={loc}
                    href={`?lang=${loc}`}
                    className={`rounded-full px-2.5 py-1 font-semibold uppercase transition-all ${
                      loc === locale
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-[var(--muted,#6b7280)] dark:text-zinc-400 hover:text-[var(--ink,#1c1030)] dark:hover:text-white'
                    }`}
                  >
                    {loc}
                  </Link>
                ))}
              </div>
            )}

            {/* Single CTA in Header */}
            <a
              href={cta.destination}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-all"
            >
              <span>{cta.label}</span>
              <ArrowRight size={14} weight="bold" />
            </a>
          </div>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-300 uppercase mb-6">
            {hero.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--ink,#1c1030)] dark:text-white leading-[1.12]">
            {hero.title}
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--body,#3a3742)] dark:text-zinc-300 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={cta.destination}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/35 transition-all"
            >
              {channelIcon}
              <span>{cta.label}</span>
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
          {cta.note && (
            <p className="mt-3 text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400">{cta.note}</p>
          )}
        </div>
      </section>

      {/* Section 2: The Three-Part System */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            01 / 02 / 03
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
            {system.sectionTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--body,#3a3742)] dark:text-zinc-300">
            {system.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {system.parts.map((part, index) => {
            const Icon = index === 0 ? DeviceMobile : index === 1 ? MagnifyingGlass : Robot;
            return (
              <div
                key={part.step}
                className="group relative rounded-2xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-8 shadow-sm transition-all hover:border-violet-500/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <span className="font-mono text-sm font-bold text-[var(--muted,#6b7280)] dark:text-zinc-500">
                    {part.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--ink,#1c1030)] dark:text-white mb-2">
                  {part.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--body,#3a3742)] dark:text-zinc-300">
                  {part.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Live Demo Link */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-slate-900/40 to-violet-950/20 p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {copy.demoBadge}
            </span>
            <p className="text-base font-semibold text-[var(--ink,#1c1030)] dark:text-white">
              {system.demoNotice}
            </p>
          </div>
          <a
            href="https://demo.purpleoryn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-600/10 px-6 py-2.5 text-sm font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-600/20 transition-all shrink-0"
          >
            <span>{system.demoLinkText}</span>
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      </section>

      {/* Section 4: Price Card (only when showPrices && prices exist) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
            {copy.plansTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--body,#3a3742)] dark:text-zinc-300">
            {copy.plansSubtitle}
          </p>
        </div>

        {hasAnyPrice ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Presence Tier */}
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-8 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink,#1c1030)] dark:text-white">Presence</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-[var(--ink,#1c1030)] dark:text-white">
                      {formatPriceNumber(prices.presence.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-[var(--muted,#6b7280)] dark:text-zinc-400">
                      {' '}
                      {copy.monthlyLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400">
                    {copy.setupLabel}: {formatPriceNumber(prices.presence.setup, prices.currencySymbol)}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] space-y-3 text-sm text-[var(--body,#3a3742)] dark:text-zinc-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-violet-500 shrink-0 mt-0.5" weight="fill" />
                      <span>{prices.presence.conversationsIncluded} {copy.convosLabel}</span>
                    </div>
                    {prices.presence.overageRate && (
                      <p className="text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400 pl-6">
                        {copy.overageLabel} {prices.presence.overageRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
                  <a
                    href={cta.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-500/40 bg-violet-600/10 px-4 py-2.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-600/20 transition-all"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight size={14} weight="bold" />
                  </a>
                </div>
              </div>

              {/* Conversion Tier (Recommended) */}
              <div className="relative flex flex-col justify-between rounded-2xl border-2 border-violet-600 bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-8 shadow-xl shadow-violet-950/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-0.5 text-xs font-bold text-white shadow-sm">
                  {copy.recommendedBadge}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[var(--ink,#1c1030)] dark:text-white">Conversion</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-[var(--ink,#1c1030)] dark:text-white">
                      {formatPriceNumber(prices.conversion.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-[var(--muted,#6b7280)] dark:text-zinc-400">
                      {' '}
                      {copy.monthlyLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400">
                    {copy.setupLabel}: {formatPriceNumber(prices.conversion.setup, prices.currencySymbol)}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] space-y-3 text-sm text-[var(--body,#3a3742)] dark:text-zinc-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-violet-500 shrink-0 mt-0.5" weight="fill" />
                      <span>{prices.conversion.conversationsIncluded} {copy.convosLabel}</span>
                    </div>
                    {prices.conversion.overageRate && (
                      <p className="text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400 pl-6">
                        {copy.overageLabel} {prices.conversion.overageRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
                  <a
                    href={cta.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-600/30 hover:bg-violet-500 transition-all"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight size={14} weight="bold" />
                  </a>
                </div>
              </div>

              {/* Authority Tier */}
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-8 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-[var(--ink,#1c1030)] dark:text-white">Authority</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-[var(--ink,#1c1030)] dark:text-white">
                      {formatPriceNumber(prices.authority.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-[var(--muted,#6b7280)] dark:text-zinc-400">
                      {' '}
                      {copy.monthlyLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400">
                    {copy.setupLabel}: {formatPriceNumber(prices.authority.setup, prices.currencySymbol)}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] space-y-3 text-sm text-[var(--body,#3a3742)] dark:text-zinc-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-violet-500 shrink-0 mt-0.5" weight="fill" />
                      <span>{prices.authority.conversationsIncluded} {copy.convosLabel}</span>
                    </div>
                    {prices.authority.overageRate && (
                      <p className="text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400 pl-6">
                        {copy.overageLabel} {prices.authority.overageRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
                  <a
                    href={cta.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-500/40 bg-violet-600/10 px-4 py-2.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-600/20 transition-all"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight size={14} weight="bold" />
                  </a>
                </div>
              </div>
            </div>

            {/* Voice Add-on Card */}
            {prices.voiceAddon.monthly !== null && (
              <div className="rounded-2xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase text-violet-600 dark:text-violet-400 tracking-wider">
                    Add-on
                  </span>
                  <h4 className="text-lg font-bold text-[var(--ink,#1c1030)] dark:text-white mt-1">
                    {copy.voiceAddonTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--body,#3a3742)] dark:text-zinc-300 mt-1 max-w-xl">
                    {copy.voiceAddonDesc}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400">
                    <span>{copy.voiceMinutes}</span>
                    {prices.voiceAddon.overageRate && (
                      <span>
                        {copy.voiceOverage} {prices.voiceAddon.overageRate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-2xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
                    {formatPriceNumber(prices.voiceAddon.monthly, prices.currencySymbol)}
                    <span className="text-xs font-normal text-[var(--muted,#6b7280)] dark:text-zinc-400">
                      {' '}
                      {copy.monthlyLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted,#6b7280)] dark:text-zinc-400 mt-0.5">
                    {copy.setupLabel}: {formatPriceNumber(prices.voiceAddon.setup, prices.currencySymbol)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* showPrices = false OR prices null mode */
          <div className="rounded-2xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-10 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-2xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
              {copy.consultationPricingText}
            </h3>
            <p className="mt-3 text-sm text-[var(--body,#3a3742)] dark:text-zinc-300">
              {copy.consultationPricingSub}
            </p>
            <div className="mt-8">
              <a
                href={cta.destination}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all"
              >
                {channelIcon}
                <span>{cta.label}</span>
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Section 5: Delivery Guarantee & Bonuses */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
            {guarantee.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 7-Day Guarantee */}
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4 border border-teal-500/20">
                <ShieldCheck size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-base text-[var(--ink,#1c1030)] dark:text-white">
                {isFrench ? 'Garantie de livraison' : 'Delivery Guarantee'}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--body,#3a3742)] dark:text-zinc-300">
                {guarantee.deliveryGuarantee}
              </p>
            </div>
          </div>

          {/* Client Capacity Cap */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 border border-amber-500/20">
                <UsersThree size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-base text-[var(--ink,#1c1030)] dark:text-white">
                {isFrench ? 'Capacité mensuelle' : 'Monthly Capacity Limit'}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--body,#3a3742)] dark:text-zinc-300">
                {guarantee.capacityLimit}
              </p>
            </div>
          </div>

          {/* Bonuses */}
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-4 border border-violet-500/20">
                <Gift size={22} weight="duotone" />
              </div>
              <h3 className="font-bold text-base text-[var(--ink,#1c1030)] dark:text-white mb-2">
                {isFrench ? 'Deux bonus inclus' : 'Two Included Bonuses'}
              </h3>
              <div className="space-y-3">
                {guarantee.bonuses.map((bonus, idx) => (
                  <div key={idx} className="text-xs text-[var(--body,#3a3742)] dark:text-zinc-300">
                    <span className="font-semibold text-[var(--ink,#1c1030)] dark:text-white block">
                      {bonus.title}
                    </span>
                    <span className="text-[var(--muted,#6b7280)] dark:text-zinc-400">{bonus.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: FAQ and Objection Handling */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--ink,#1c1030)] dark:text-white">
            {copy.faqTitle}
          </h2>
        </div>

        <div className="space-y-4">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-[var(--surface,#ffffff)] dark:bg-[#1a1a1f] p-6"
            >
              <h3 className="font-bold text-base text-[var(--ink,#1c1030)] dark:text-white">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--body,#3a3742)] dark:text-zinc-300">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Local Payment Note */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] bg-slate-900/40 p-6 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400 shrink-0">
            <CreditCard size={20} weight="duotone" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--ink,#1c1030)] dark:text-white">
              {copy.paymentHeading}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted,#6b7280)] dark:text-zinc-300 leading-relaxed">
              {paymentNote}
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Single CTA Banner */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33]">
        <div className="rounded-3xl bg-gradient-to-b from-violet-950/80 to-slate-900 border border-violet-500/30 p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-violet-950/30">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {hero.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mb-8">{copy.ctaSecondaryText}</p>
            <a
              href={cta.destination}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-8 py-4 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-600/40"
            >
              {channelIcon}
              <span>{cta.label}</span>
              <ArrowRight size={16} weight="bold" />
            </a>
            {cta.note && <p className="mt-4 text-xs text-zinc-400">{cta.note}</p>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--line,#e4e4e7)] dark:border-[#2c2c33] py-10 text-center text-xs text-[var(--muted,#6b7280)] dark:text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{legal.footerText}</p>
          <p className="text-zinc-500">{legal.paymentNote}</p>
        </div>
      </footer>
    </div>
  );
}
