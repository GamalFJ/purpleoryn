'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Gift,
  UsersThree,
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
  UserCheck,
  Clock,
  ArrowDown,
} from '@phosphor-icons/react';
import { buttonClass } from '@/components/ui/button';
import { IconTile } from '@/components/ui/IconTile';
import { cn } from '@/lib/cn';
import { TONE } from '@/lib/tone';
import type { MarketConfig } from '@/markets/types';
import { MarketRoiCalculator } from './MarketRoiCalculator';
import { MarketOrderForm } from './MarketOrderForm';

interface MarketLandingProps {
  config: MarketConfig;
  showPrices?: boolean;
  locale: string;
}

function formatPriceNumber(num: number | null | undefined, symbol: string): string {
  if (num === null || num === undefined) return '';
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function MarketLanding({ config, locale }: MarketLandingProps) {
  const content = config.content[locale] || config.content[config.defaultLocale] || Object.values(config.content)[0];
  const { hero, problemInsight, system, guarantee, founderNote, faq, paymentNote, cta, legal } = content;
  const prices = config.prices;

  const [selectedPlan, setSelectedPlan] = useState<'presence' | 'conversion' | 'authority'>('conversion');
  const [averageSaleValue, setAverageSaleValue] = useState<number | null>(null);

  const isFrench = locale.startsWith('fr');

  const copy = {
    plansTitle: isFrench ? 'Plans et investissement' : 'Plans and Investment',
    plansSubtitle: isFrench
      ? 'Une infrastructure complète, sans frais cachés. Un paiement initial de mise en place et un abonnement mensuel d’entretien.'
      : 'Complete commercial infrastructure with zero hidden fees. One-time deployment fee and predictable monthly management.',
    recommendedBadge: isFrench ? 'Recommandé' : 'Recommended',
    setupLabel: isFrench ? 'Mise en place' : 'One-time setup',
    monthlyLabel: isFrench ? '/mois' : '/mo',
    convosLabel: isFrench ? 'conversations / mois incluses' : 'conversations / month included',
    overageLabel: isFrench ? 'Conversation supplémentaire:' : 'Extra conversation:',
    year1Label: isFrench ? 'Total An 1:' : 'Year 1 Total:',
    explorePlans: isFrench ? 'Consulter les formules' : 'Explore Plans & Pricing',
    voiceAddonTitle: isFrench ? 'Module Agence Vocale IA' : 'AI Voice Agent Add-on',
    voiceAddonDesc: isFrench
      ? 'Prenez en charge les appels vocaux entrants 24h/24 avec une voix naturelle, répondez aux questions et prenez des rendez-vous.'
      : 'Handle inbound customer voice calls 24/7 with human-grade conversational voice, answer customer questions, and book appointments.',
    voiceMinutes: isFrench ? '300 minutes / mois incluses' : '300 minutes / month included',
    voiceOverage: isFrench ? 'Minute supplémentaire:' : 'Extra minute:',
    voiceLineType: isFrench
      ? config.id === 'ht'
        ? 'Appels WhatsApp sur votre numéro d’entreprise'
        : 'Ligne téléphonique professionnelle dédiée'
      : config.id === 'ht'
      ? 'WhatsApp calling on your business number'
      : 'Dedicated regular business phone line',
    faqTitle: isFrench ? 'Questions fréquentes' : 'Frequently Asked Questions',
    paymentHeading: isFrench ? 'Modalités de règlement' : 'Payment Rails and Terms',
    ctaSecondaryText: isFrench
      ? 'Chaque projet est personnellement conçu et déployé par Gamal chez Purple Cove Labs.'
      : 'Every project is personally built and directed by Gamal at Purple Cove Labs.',
    selectTierBtn: isFrench ? 'Choisir cette formule' : 'Select This Plan',
    guaranteeTitle: guarantee.title,
    capTitle: isFrench ? 'Limite stricte de 4 entreprises par mois' : 'Strict 4-Client Monthly Cap',
    bonusesTitle: isFrench ? 'Deux bonus de lancement inclus' : 'Two Included Launch Bonuses',
    walkthroughLabel: isFrench ? 'Réserver un échange de 20 minutes' : 'Book a 20-Minute Walkthrough',
  };

  const channelIcon =
    config.primaryChannel === 'sms' ? (
      <ChatCircleText size={18} weight="bold" />
    ) : config.primaryChannel === 'whatsapp' ? (
      <ChatCircleText size={18} weight="bold" />
    ) : (
      <CalendarCheck size={18} weight="bold" />
    );

  const scrollToOrder = (plan?: 'presence' | 'conversion' | 'authority') => {
    if (plan) setSelectedPlan(plan);
    const el = document.getElementById('order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                    href={`?lang=${loc}`}
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

            <button
              type="button"
              onClick={() => scrollToOrder('conversion')}
              className={buttonClass('primary', 'sm')}
            >
              {channelIcon}
              <span>{cta.label}</span>
            </button>
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
              <button
                type="button"
                onClick={() => scrollToOrder('conversion')}
                className={buttonClass('primary', 'lg')}
              >
                {channelIcon}
                <span>{hero.ctaText}</span>
              </button>

              <a
                href="#pricing"
                className={buttonClass('secondary', 'lg')}
              >
                <span>{copy.explorePlans}</span>
                <ArrowDown size={16} weight="bold" />
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
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
                <p className="text-xs text-muted">Complete Commercial Client Engine</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-body">
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">Website Architecture</span>
                <span className="font-mono text-teal-ink font-semibold">Conversion Next.js</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">Google Local Engine</span>
                <span className="font-mono text-accent font-semibold">Profile + Geo-SEO</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper px-3 py-2">
                <span className="font-medium text-ink">24/7 AI Qualification</span>
                <span className="font-mono text-warm-ink font-semibold uppercase">{config.primaryChannel} + Web</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-paper/70 px-4 py-3 text-xs font-semibold text-ink">
              <span className="text-muted">{isFrench ? 'Exécution technique' : 'Implementation'}</span>
              <span className="font-mono text-accent font-medium">
                {isFrench ? 'Personnellement par Gamal' : 'Personally Built by Gamal'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Problem Insight Section (Challenger Pitch) ───────────────── */}
      {problemInsight && (
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-28">
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-8 sm:p-12 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warm-ink">
                  <Clock size={16} weight="bold" />
                  {problemInsight.tag}
                </span>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl text-ink leading-tight">
                  {problemInsight.title}
                </h2>
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent-soft/30 p-4 text-sm font-medium text-ink">
                  {problemInsight.statCallout}
                </div>
                <p className="mt-4 text-base leading-relaxed text-body">
                  {problemInsight.description}
                </p>
              </div>

              <div className="space-y-4 rounded-2xl border border-line bg-paper/60 p-6 text-xs text-body">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-teal-soft p-2 text-teal-ink">
                    <UserCheck size={20} weight="bold" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">
                      {isFrench ? 'Soutien direct de votre équipe' : 'Staff Support, Not Replacement'}
                    </p>
                    <p className="mt-1 leading-relaxed text-muted">
                      {isFrench
                        ? 'Les agents filtrent les demandes secondaires et qualifient les besoins pour que vos collaborateurs n’échangent qu’avec des acheteurs prêts.'
                        : 'The agents handle nights, weekends, and initial minutes, qualifying buyer criteria so your team only spends time closing ready buyers.'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-line/60 pt-4">
                  <p className="font-mono text-xs font-semibold text-accent">
                    {problemInsight.hoursComparison}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── The Three-Part System ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Architecture
          </span>
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl text-ink">
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

        {/* Realistic Interactive Phone Mock (SMS for US/CA, WhatsApp for HT) */}
        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <figure className="mx-auto w-full max-w-[22rem]">
            <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-[#1c1c1e] bg-[#1c1c1e] shadow-[0_32px_64px_-32px_rgb(28_16_48/0.55)]">
              {/* Phone Header */}
              <div className="flex items-center gap-3 bg-[#f5f5f7] px-4 py-3 text-ink dark:bg-[#1f1f23] dark:text-[#f1ecf8]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {config.primaryChannel === 'sms' ? 'SMS' : 'WA'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight">
                    {isFrench ? 'Nouvelle Demande Client' : 'New Inbound Client Inquiry'}
                  </p>
                  <p className="text-[10px] text-muted font-mono">
                    {config.primaryChannel === 'sms'
                      ? 'SMS • Qualified by Oryn'
                      : 'WhatsApp • Qualifié par Oryn'}
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
                      ? 'Bonjour, j’ai trouvé votre entreprise sur Google. Avez-vous une disponibilité cette semaine?'
                      : 'Hi, I found your business on Google. Do you have availability for a consultation this week?'}
                  </p>
                  <span className="mt-1 block text-right text-[10px] text-muted">9:38 PM</span>
                </div>

                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                  <p>
                    {isFrench
                      ? 'Bonjour! Oui tout à fait. Nous avons des ouvertures mercredi à 14h ou jeudi à 10h. Quel créneau vous convient le mieux?'
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
                      ? `Client: Michel D. • Créneau: Jeudi 10h00 • Canal: ${config.primaryChannel.toUpperCase()}`
                      : `Client: Michael D. • Time: Thursday 10:00 AM • Channel: ${config.primaryChannel.toUpperCase()}`}
                  </p>
                </div>
              </div>
            </div>
          </figure>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-ink">
              Seamless Handoff
            </span>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl text-ink">
              {isFrench
                ? 'Ne laissez plus refroidir aucun prospect qualifié'
                : 'Never let a qualified prospective buyer go cold'}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-body">
              {isFrench
                ? 'Votre site web convertit immédiatement. L’agent d’intelligence artificielle engage chaque visiteur à toute heure du jour et de la nuit, valide leurs besoins spécifiques et vous transmet l’opportunité directement.'
                : 'Your website captures instant intent. The AI agent engages visitors at any hour, asks 3 to 5 key qualifying questions, and hands over a hot lead ready for closing.'}
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
          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl text-ink">
            {copy.plansTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {copy.plansSubtitle}
          </p>
        </div>

        {/* 3 Stepped Tiers */}
        <ol className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
          {/* Tier 1: Presence */}
          <li className="flex">
            <article
              className={cn(
                'group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 shadow-xs',
                TONE['teal'].border,
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
                {isFrench ? 'Oryn Présence' : 'Oryn Presence'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">
                {isFrench
                  ? 'Fondation numérique essentielle avec captation et qualification automatique.'
                  : 'Essential digital foundation with automatic lead intake and qualification.'}
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
                    {isFrench ? 'Abonnement mensuel' : 'Monthly retainer'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="tabular text-3xl font-bold text-ink">
                      {formatPriceNumber(prices.presence.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                  </div>
                </div>

                {prices.presence.year1Total && (
                  <p className="mt-3 text-xs text-muted font-mono">
                    <span className="font-semibold text-ink">{copy.year1Label}</span> {formatPriceNumber(prices.presence.year1Total, prices.currencySymbol)}
                  </p>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                <li className="flex gap-2.5">
                  <CheckCircle
                    size={20}
                    weight="duotone"
                    className={cn('mt-px shrink-0', TONE['teal'].text)}
                  />
                  <span className="font-medium text-ink">
                    {prices.presence.conversationsIncluded} {copy.convosLabel}
                  </span>
                </li>
                {prices.presence.overageRate && (
                  <li className="flex gap-2.5 text-xs text-muted pl-7">
                    <span>
                      {copy.overageLabel} {prices.presence.overageRate}
                    </span>
                  </li>
                )}
                {content.tierHighlights?.presence.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-body">
                    <CheckCircle
                      size={18}
                      weight="bold"
                      className={cn('mt-0.5 shrink-0', TONE['teal'].text)}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => scrollToOrder('presence')}
                className={buttonClass('secondary', 'md', 'mt-8 w-full')}
              >
                <span>{copy.selectTierBtn}</span>
              </button>
            </article>
          </li>

          {/* Tier 2: Conversion (RECOMMENDED) */}
          <li className="flex">
            <article
              className={cn(
                'group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 border-glow shadow-[0_28px_56px_-30px_rgb(162_28_175/0.55)]',
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
                {isFrench ? 'Oryn Conversion' : 'Oryn Conversion'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">
                {isFrench
                  ? 'Pour les entreprises actives qui veulent dominer leur secteur et convertir chaque demande.'
                  : 'For active businesses aiming to lead their regional market and systematically close leads.'}
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
                    {isFrench ? 'Abonnement mensuel' : 'Monthly retainer'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="tabular text-3xl font-bold text-warm-ink">
                      {formatPriceNumber(prices.conversion.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                  </div>
                </div>

                {prices.conversion.year1Total && (
                  <p className="mt-3 text-xs text-muted font-mono">
                    <span className="font-semibold text-ink">{copy.year1Label}</span> {formatPriceNumber(prices.conversion.year1Total, prices.currencySymbol)}
                  </p>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                <li className="flex gap-2.5">
                  <CheckCircle
                    size={20}
                    weight="duotone"
                    className={cn('mt-px shrink-0', TONE['violet'].text)}
                  />
                  <span className="font-medium text-ink">
                    {prices.conversion.conversationsIncluded} {copy.convosLabel}
                  </span>
                </li>
                {prices.conversion.overageRate && (
                  <li className="flex gap-2.5 text-xs text-muted pl-7">
                    <span>
                      {copy.overageLabel} {prices.conversion.overageRate}
                    </span>
                  </li>
                )}
                {content.tierHighlights?.conversion.map((h, i) => {
                  const isInheritLine = h.startsWith('Everything in') || h.startsWith('Tout ce qui est inclus');
                  return (
                    <li key={i} className={cn('flex gap-2.5 text-sm', isInheritLine ? 'font-semibold text-ink pt-2 border-t border-line/60 mt-1' : 'text-body')}>
                      {!isInheritLine && (
                        <CheckCircle
                          size={18}
                          weight="bold"
                          className={cn('mt-0.5 shrink-0', TONE['violet'].text)}
                        />
                      )}
                      <span>{h}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => scrollToOrder('conversion')}
                className={buttonClass('primary', 'md', 'mt-8 w-full shadow-md')}
              >
                <span>{copy.selectTierBtn}</span>
              </button>
            </article>
          </li>

          {/* Tier 3: Authority */}
          <li className="flex">
            <article
              className={cn(
                'group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7 shadow-xs',
                TONE['rose'].border,
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
                {isFrench ? 'Oryn Autorité' : 'Oryn Authority'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">
                {isFrench
                  ? 'Infrastructure complète de haute performance avec réservation automatique et CRM léger.'
                  : 'Top-tier infrastructure with autonomous booking, order handling, and continuous testing.'}
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
                    {isFrench ? 'Abonnement mensuel' : 'Monthly retainer'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="tabular text-3xl font-bold text-ink">
                      {formatPriceNumber(prices.authority.monthly, prices.currencySymbol)}
                    </span>
                    <span className="text-sm text-muted">{copy.monthlyLabel}</span>
                  </div>
                </div>

                {prices.authority.year1Total && (
                  <p className="mt-3 text-xs text-muted font-mono">
                    <span className="font-semibold text-ink">{copy.year1Label}</span> {formatPriceNumber(prices.authority.year1Total, prices.currencySymbol)}
                  </p>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 text-[15px] flex-1">
                <li className="flex gap-2.5">
                  <CheckCircle
                    size={20}
                    weight="duotone"
                    className={cn('mt-px shrink-0', TONE['rose'].text)}
                  />
                  <span className="font-medium text-ink">
                    {prices.authority.conversationsIncluded} {copy.convosLabel}
                  </span>
                </li>
                {prices.authority.overageRate && (
                  <li className="flex gap-2.5 text-xs text-muted pl-7">
                    <span>
                      {copy.overageLabel} {prices.authority.overageRate}
                    </span>
                  </li>
                )}
                {content.tierHighlights?.authority.map((h, i) => {
                  const isInheritLine = h.startsWith('Everything in') || h.startsWith('Tout ce qui est inclus');
                  return (
                    <li key={i} className={cn('flex gap-2.5 text-sm', isInheritLine ? 'font-semibold text-ink pt-2 border-t border-line/60 mt-1' : 'text-body')}>
                      {!isInheritLine && (
                        <CheckCircle
                          size={18}
                          weight="bold"
                          className={cn('mt-0.5 shrink-0', TONE['rose'].text)}
                        />
                      )}
                      <span>{h}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => scrollToOrder('authority')}
                className={buttonClass('secondary', 'md', 'mt-8 w-full')}
              >
                <span>{copy.selectTierBtn}</span>
              </button>
            </article>
          </li>
        </ol>

        {/* AI Voice Agent Addon (Secondary add-on) */}
        {prices.voiceAddon && (
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
                  <p className="mt-2 text-xs text-muted font-medium">
                    {copy.voiceLineType}
                  </p>
                  <p className="mt-3 text-sm font-medium text-ink">
                    {prices.voiceAddon.includedUnits || 300} {copy.voiceMinutes}
                    {prices.voiceAddon.overageRate && ` • ${copy.voiceOverage} ${prices.voiceAddon.overageRate}`}
                  </p>
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
                <button
                  type="button"
                  onClick={() => scrollToOrder('conversion')}
                  className={buttonClass('primary', 'sm', 'mt-4 w-full')}
                >
                  <span>{isFrench ? 'Ajouter l’option vocale' : 'Configure with Voice'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Detailed Service Comparison Table ─────────────────────── */}
        {content.serviceRows && content.serviceRows.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {isFrench ? 'Comparaison détaillée des services' : 'Detailed Service Comparison'}
              </h3>
              <p className="mt-2 text-sm text-muted max-w-xl mx-auto">
                {isFrench
                  ? 'Tous les composants inclus dans chaque formule, configurés pour votre marché.'
                  : 'Every component included across all three tiers, fully configured for your market.'}
              </p>
            </div>

            {/* Desktop side-by-side table */}
            <div className="hidden overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface md:block shadow-xs">
              <table className="w-full table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[26%]" />
                  <col className="w-[28%]" />
                  <col className="w-[26%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-line bg-paper/60">
                    <th scope="col" className="p-5 text-xs font-semibold text-muted uppercase tracking-wider">
                      {isFrench ? 'Composant' : 'Service Component'}
                    </th>
                    <th scope="col" className="p-5 border-l border-line">
                      <span className={cn('font-display text-lg font-semibold', TONE['teal'].text)}>
                        {isFrench ? 'Oryn Présence' : 'Oryn Presence'}
                      </span>
                    </th>
                    <th scope="col" className="p-5 border-l border-line bg-accent-soft/30">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-display text-lg font-semibold', TONE['violet'].text)}>
                          {isFrench ? 'Oryn Conversion' : 'Oryn Conversion'}
                        </span>
                        <span className="rounded-full bg-warm px-2 py-0.5 text-[10px] font-semibold text-on-warm">
                          {copy.recommendedBadge}
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="p-5 border-l border-line">
                      <span className={cn('font-display text-lg font-semibold', TONE['rose'].text)}>
                        {isFrench ? 'Oryn Autorité' : 'Oryn Authority'}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {content.serviceRows.map((row) => (
                    <tr key={row.label} className="align-top hover:bg-paper/30 transition-colors">
                      <th scope="row" className="p-5 text-sm font-semibold text-ink">
                        {row.label}
                      </th>
                      <td className="p-5 border-l border-line text-sm leading-relaxed text-body">
                        {row.presence}
                      </td>
                      <td className="p-5 border-l border-line text-sm leading-relaxed text-body bg-accent-soft/15 font-medium text-ink">
                        {row.conversion}
                      </td>
                      <td className="p-5 border-l border-line text-sm leading-relaxed text-body">
                        {row.authority}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile accordion-like stacked cards */}
            <div className="space-y-4 md:hidden">
              {content.serviceRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-line bg-surface p-4 shadow-xs">
                  <p className="font-semibold text-ink text-base">{row.label}</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="rounded-lg bg-paper p-3 border border-line/50">
                      <p className="font-semibold text-teal-ink mb-1">Presence</p>
                      <p className="text-body leading-relaxed">{row.presence}</p>
                    </div>
                    <div className="rounded-lg bg-accent-soft/50 p-3 border border-accent/20">
                      <p className="font-semibold text-accent mb-1">Conversion (Recommended)</p>
                      <p className="text-body leading-relaxed">{row.conversion}</p>
                    </div>
                    <div className="rounded-lg bg-paper p-3 border border-line/50">
                      <p className="font-semibold text-rose-ink mb-1">Authority</p>
                      <p className="text-body leading-relaxed">{row.authority}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── Guarantee, Cap & Bonuses ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <h2 className="text-3xl font-semibold sm:text-4xl text-ink">
          {copy.guaranteeTitle}
        </h2>

        <ul className={cn(
          'mt-8 grid gap-4',
          guarantee.hasDeliveryGuarantee ? 'md:grid-cols-3' : 'md:grid-cols-2'
        )}>
          {/* Delivery Guarantee ONLY shown when hasDeliveryGuarantee is true (Haiti) */}
          {guarantee.hasDeliveryGuarantee && guarantee.deliveryGuarantee && (
            <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
              <IconTile icon={ShieldCheck} tone="teal" size="lg" />
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {isFrench ? 'Garantie de livraison 14 jours' : '14-Business-Day Delivery'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">
                {guarantee.deliveryGuarantee}
              </p>
            </li>
          )}

          {/* Strict 4-Client Capacity Cap */}
          <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <IconTile icon={UsersThree} tone="amber" size="lg" />
            <h3 className="mt-4 text-xl font-semibold text-ink">
              {copy.capTitle}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              {guarantee.capacityLimit}
            </p>
          </li>

          {/* Two Included Bonuses */}
          <li className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <IconTile icon={Gift} tone="violet" size="lg" />
            <h3 className="mt-4 text-xl font-semibold text-ink">
              {copy.bonusesTitle}
            </h3>
            <ul className="mt-2 space-y-2 text-[15px] text-body">
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

      {/* ─── Founder Note ────────────────────────────────────────────── */}
      {founderNote && (
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-display text-xl font-bold">
              G
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-accent tracking-wider">
                {founderNote.title}
              </p>
              <p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-body">
                {founderNote.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── ROI Calculator Section ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <MarketRoiCalculator
          prices={prices}
          locale={locale}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          averageSaleValue={averageSaleValue}
          onAverageSaleChange={setAverageSaleValue}
        />
      </section>

      {/* ─── Order Form Section (Formal Intake) ───────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <MarketOrderForm
          config={config}
          locale={locale}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          averageSaleValue={averageSaleValue}
        />
      </section>

      {/* ─── FAQ Section ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <h2 className="text-3xl font-semibold sm:text-4xl text-ink">{copy.faqTitle}</h2>

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

      {/* ─── Closing Deep Plum CTA Block (Secondary Walkthrough CTA) ─── */}
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
              <button
                type="button"
                onClick={() => scrollToOrder('conversion')}
                className={buttonClass('onPlum', 'lg')}
              >
                {channelIcon}
                <span>{cta.label}</span>
              </button>

              <a
                href="https://cal.com/purple-cove-labs/20-min-cafe-virtual"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-plum-line bg-plum-surface px-6 py-3.5 text-base font-semibold text-plum-ink hover:border-plum-accent hover:text-white transition-colors"
              >
                <CalendarCheck size={18} weight="bold" />
                <span>{copy.walkthroughLabel}</span>
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

          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/18096034113"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <ChatCircleText size={15} />
              <span>WhatsApp: +1 809 603 4113</span>
            </a>
            <p>{legal.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
