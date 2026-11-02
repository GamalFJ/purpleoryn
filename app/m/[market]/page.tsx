import 'server-only';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import type { MarketId } from '@/markets/types';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ market: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: { params: Promise<{ market: string }> }): Promise<Metadata> {
  const { market } = await params;
  const titles: Record<string, string> = {
    us: 'Purple Cove Labs USA | Turn Search Into Inbound Clients',
    ca: 'Purple Cove Labs Canada | Digital Growth Infrastructure',
    ht: 'Purple Cove Labs Haïti | Croissance Numérique et IA',
  };

  return {
    title: titles[market] || 'Purple Cove Labs',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function MarketPage({ params, searchParams }: PageProps) {
  const { market } = await params;

  if (market !== 'us' && market !== 'ca' && market !== 'ht') {
    notFound();
  }

  const reqHeaders = await headers();
  const rawHost = (reqHeaders.get('x-forwarded-host') || reqHeaders.get('host') || '').toLowerCase();
  const isLocalhost = rawHost.includes('localhost') || rawHost.includes('127.0.0.1');

  const resolvedSearchParams = await searchParams;
  const isDevPreview =
    Boolean(resolvedSearchParams.preview) ||
    Boolean(resolvedSearchParams.dev) ||
    resolvedSearchParams.show_prices === 'true' ||
    resolvedSearchParams.prices === 'true';

  const showPricesHeader = reqHeaders.get('x-show-prices');

  // On localhost (developer computer) or dev preview query, show prices!
  const showPrices = isLocalhost || isDevPreview || showPricesHeader === 'true';

  const defaultLocaleHeader = reqHeaders.get('x-market-locale') || 'en';
  const requestedLang = typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : null;

  const config = await getMarketConfig(market as MarketId);

  // Validate locale against supported locales
  const activeLocale =
    requestedLang && config.supportedLocales.includes(requestedLang)
      ? requestedLang
      : config.supportedLocales.includes(defaultLocaleHeader)
      ? defaultLocaleHeader
      : config.defaultLocale;

  return <MarketLanding config={config} showPrices={showPrices} locale={activeLocale} />;
}
