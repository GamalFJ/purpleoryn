import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Purple Cove Labs Haïti | Croissance Numérique et IA',
  description:
    'Développement web de haute performance, SEO et agents téléphoniques IA pour entreprises en Haïti et dans la diaspora.',
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

  // Standalone HT site: USD, approved pricing visible, French default
  return <MarketLanding config={config} showPrices={true} locale={locale} />;
}
