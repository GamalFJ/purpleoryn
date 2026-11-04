import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Oryn Presence Canada | Système Commercial et Croissance Numérique',
  description:
    'Développement web de conversion, visibilité Google locale et qualification par SMS 24h/24 pour entreprises canadiennes. Bilingue français et anglais.',
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CaMarketPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const langParam = typeof resolved.lang === 'string' ? resolved.lang.toLowerCase() : null;
  const config = await getMarketConfig('ca');

  const locale = langParam && config.supportedLocales.includes(langParam) ? langParam : config.defaultLocale;

  return <MarketLanding config={config} showPrices={true} locale={locale} />;
}
