'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, ArrowRight, CalendarBlank, MapPin } from '@phosphor-icons/react';
import { buttonClass } from '@/components/ui/button';
import { IconTile } from '@/components/ui/IconTile';

interface ChooseClientProps {
  initialLocale: 'en' | 'fr';
  bookingUrl: string;
}

const REGIONS = [
  {
    id: 'dr',
    flag: '🇩🇴',
    nameEn: 'Dominican Republic',
    nameFr: 'République Dominicaine',
    descEn: 'Full digital system with local search ranking and WhatsApp AI qualification.',
    descFr: 'Système complet avec référencement local et qualification WhatsApp par IA.',
    href: 'https://purpleoryn.com/?region=dr',
  },
  {
    id: 'us',
    flag: '🇺🇸',
    nameEn: 'United States',
    nameFr: 'États-Unis',
    descEn: 'High-speed website, local search SEO, and 24/7 SMS qualification.',
    descFr: 'Site web haute vitesse, référencement local et qualification SMS 24/7.',
    href: 'https://us.purpleoryn.com/?region=us',
  },
  {
    id: 'ca',
    flag: '🇨🇦',
    nameEn: 'Canada',
    nameFr: 'Canada',
    descEn: 'Bilingual Canadian architecture with automated lead intake.',
    descFr: 'Architecture bilingue canadienne avec qualification automatisée.',
    href: 'https://ca.purpleoryn.com/?region=ca',
  },
  {
    id: 'ht',
    flag: '🇭🇹',
    nameEn: 'Haiti',
    nameFr: 'Haïti',
    descEn: 'Commercial web presence with 24/7 WhatsApp AI qualification.',
    descFr: 'Présence commerciale complète avec qualification WhatsApp par IA 24/7.',
    href: 'https://ht.purpleoryn.com/?region=ht',
  },
];

export function ChooseClient({ initialLocale, bookingUrl }: ChooseClientProps) {
  const [locale, setLocale] = useState<'en' | 'fr'>(initialLocale);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }, []);

  const t = {
    en: {
      tag: 'Global Access',
      headline: 'Complete digital growth systems: high-converting web, local search authority, and 24/7 AI qualification.',
      bookConsultation: 'Book a Consultation',
      bookSub: 'Discuss custom deployment timelines, integrations, and service volumes.',
      chooseRegion: 'Choose your region',
      chooseRegionSub: 'Select your market to explore regional specifications and local workflows.',
      pricingNote: 'Pricing is shared during your consultation.',
      viewRegion: 'View Overview',
    },
    fr: {
      tag: 'Accès International',
      headline: 'Systèmes complets de croissance numérique: web haute performance, visibilité locale et qualification par IA 24/7.',
      bookConsultation: 'Planifier une consultation',
      bookSub: 'Échangez sur les délais de déploiement, les intégrations et les volumes adaptés.',
      chooseRegion: 'Choisissez votre région',
      chooseRegionSub: 'Sélectionnez votre marché pour découvrir les fonctionnalités régionales.',
      pricingNote: 'Les tarifs sont partagés lors de votre consultation.',
      viewRegion: 'Consulter l aperçu',
    },
  }[locale];

  return (
    <div className="min-h-screen bg-paper text-body selection:bg-accent selection:text-accent-ink flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src="/media/logo.webp" alt="Purple Cove Labs" width={36} height={36} className="h-9 w-9 rounded-full" priority />
            <div>
              <span className="font-display text-[17px] font-semibold tracking-tight text-ink block leading-tight">
                Purple Cove Labs
              </span>
              <span className="text-[11px] text-muted block font-mono">Oryn Presence</span>
            </div>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-xs">
            <Globe size={16} className="text-muted ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                locale === 'en'
                  ? 'bg-gradient-action text-accent-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('fr')}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                locale === 'fr'
                  ? 'bg-gradient-action text-accent-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex-1 flex flex-col justify-center relative isolate overflow-hidden">
        {/* Ambient color wash */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <div className="animate-drift absolute -left-24 -top-32 h-[24rem] w-[24rem] rounded-full bg-accent/15 blur-3xl" />
          <div className="animate-drift absolute -top-10 right-[8%] h-[20rem] w-[20rem] rounded-full bg-fuchsia/10 blur-3xl [--drift-x:-50px] [--drift-y:30px] [animation-duration:19s]" />
          <div className="animate-drift absolute bottom-[-6rem] left-[30%] h-[18rem] w-[18rem] rounded-full bg-teal/10 blur-3xl [--drift-x:40px] [--drift-y:-20px] [animation-duration:22s]" />
        </div>

        {/* Value Statement */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-accent-soft text-accent border border-accent/20 mb-5">
            {t.tag}
          </span>
          <h1 className="text-gradient-brand pb-[0.1em] text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.08]">
            {t.headline}
          </h1>
        </div>

        {/* Action 1: Book Consultation */}
        <div className="max-w-2xl mx-auto w-full mb-14">
          <div className="p-8 sm:p-10 rounded-[var(--radius-panel)] border border-line bg-surface shadow-[0_16px_40px_-20px_rgb(28_16_48/0.15)] text-center relative overflow-hidden">
            <div className="mx-auto mb-4 flex justify-center">
              <IconTile icon={CalendarBlank} tone="violet" size="lg" />
            </div>
            <h2 className="text-2xl font-semibold text-ink mb-2">{t.bookConsultation}</h2>
            <p className="text-sm text-body mb-6 max-w-md mx-auto leading-relaxed">{t.bookSub}</p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("primary", "lg", "shadow-md")}
            >
              <span>{t.bookConsultation}</span>
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
        </div>

        {/* Action 2: Choose Your Region */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-ink flex items-center justify-center gap-2">
              <MapPin size={22} className="text-accent" />
              <span>{t.chooseRegion}</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">{t.chooseRegionSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGIONS.map((r) => {
              const regionName = locale === 'fr' ? r.nameFr : r.nameEn;
              const regionDesc = locale === 'fr' ? r.descFr : r.descEn;

              return (
                <Link
                  key={r.id}
                  href={isLocalhost ? `/?preview=${r.id}` : r.href}
                  className="group p-6 rounded-[var(--radius-panel)] bg-surface hover:bg-surface border border-line hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">{r.flag}</div>
                    <h3 className="font-semibold text-ink text-base group-hover:text-accent transition-colors">
                      {regionName}
                    </h3>
                    <p className="text-xs text-body mt-2 leading-relaxed">{regionDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-accent font-medium">
                    <span>{t.viewRegion}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-muted">
            <span>{t.pricingNote}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface/50 py-8 text-center text-xs text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/media/logo.webp" alt="Purple Cove Labs" width={20} height={20} className="h-5 w-5 rounded-full" />
          <span className="font-display font-medium text-ink">Purple Cove Labs</span>
        </div>
        <p>© Purple Cove Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
