import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Oryn Presence Haïti | Croissance Commerciale et IA WhatsApp',
  description:
    'Site web haute performance, visibilité Google locale et agents d’IA sur WhatsApp 24h/24 pour entreprises en Haïti. L’entreprise qui répond la première remporte le client.',
  openGraph: {
    title: 'Oryn Presence Haïti | Croissance Commerciale et IA WhatsApp',
    description:
      'Site web haute performance, visibilité Google locale et agents d’IA sur WhatsApp 24h/24 pour entreprises en Haïti. L’entreprise qui répond la première remporte le client.',
    url: 'https://ht.purpleoryn.com',
    siteName: 'Purple Cove Labs',
    locale: 'fr_HT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oryn Presence Haïti | Croissance Commerciale et IA WhatsApp',
    description:
      'Site web haute performance, visibilité Google locale et agents d’IA sur WhatsApp 24h/24 pour entreprises en Haïti.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HtMarketPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const langParam = typeof resolved.lang === 'string' ? resolved.lang.toLowerCase() : null;
  const config = await getMarketConfig('ht');

  const locale = langParam && config.supportedLocales.includes(langParam) ? langParam : config.defaultLocale;

  return <MarketLanding config={config} showPrices={true} locale={locale} />;
}
