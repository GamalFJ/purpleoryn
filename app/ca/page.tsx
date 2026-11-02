import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Purple Cove Labs Canada | Digital Growth Infrastructure',
  description:
    'Web development, SEO, and AI phone agents for Canadian businesses. Bilingual execution in English and French.',
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

  // Standalone CA site: CAD, consultation pricing, bilingual toggle
  return <MarketLanding config={config} showPrices={true} locale={locale} />;
}
