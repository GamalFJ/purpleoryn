'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, CalendarBlank, MapPin } from '@phosphor-icons/react';

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
    descEn: 'Full system in Dominican Spanish with WhatsApp qualification.',
    descFr: 'Système complet en espagnol avec qualification WhatsApp.',
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
    descEn: 'Complete commercial presence with 24/7 WhatsApp AI qualification.',
    descFr: 'Présence commerciale complète avec qualification WhatsApp par IA 24/7.',
    href: 'https://ht.purpleoryn.com/?region=ht',
  },
];

export function ChooseClient({ initialLocale, bookingUrl }: ChooseClientProps) {
  const [locale, setLocale] = useState<'en' | 'fr'>(initialLocale);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/30">
              P
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight text-white block leading-tight">
                Purple Cove Labs
              </span>
              <span className="text-xs text-slate-400 block font-mono">Oryn Presence</span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <Globe size={18} className="text-slate-400 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                locale === 'en'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('fr')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                locale === 'fr'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex-1 flex flex-col justify-center">
        {/* Value Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-violet-950/80 text-violet-300 border border-violet-800/50 mb-6">
            {t.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight md:leading-tight">
            {t.headline}
          </h1>
        </div>

        {/* Action 1: Book Consultation Highlight */}
        <div className="max-w-2xl mx-auto w-full mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-violet-500/30 shadow-xl shadow-violet-950/20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex p-3 rounded-xl bg-violet-600/10 text-violet-400 mb-4 border border-violet-500/20">
              <CalendarBlank size={28} weight="duotone" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.bookConsultation}</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">{t.bookSub}</p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40"
            >
              <span>{t.bookConsultation}</span>
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
        </div>

        {/* Action 2: Choose Your Region */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
              <MapPin size={22} className="text-violet-400" />
              <span>{t.chooseRegion}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">{t.chooseRegionSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REGIONS.map((r) => {
              const regionName = locale === 'fr' ? r.nameFr : r.nameEn;
              const regionDesc = locale === 'fr' ? r.descFr : r.descEn;

              return (
                <Link
                  key={r.id}
                  href={r.href}
                  className="group p-6 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-3xl mb-3">{r.flag}</div>
                    <h3 className="font-semibold text-white text-base group-hover:text-violet-300 transition-colors">
                      {regionName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{regionDesc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-violet-400 group-hover:text-violet-300 font-medium">
                    <span>{t.viewRegion}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <span>{t.pricingNote}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© Purple Cove Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
