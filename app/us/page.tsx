import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Purple Cove Labs USA | Turn Search Into Inbound Clients',
  description:
    'Dedicated web development, local SEO, and AI phone agents for US businesses. Fixed packages and verified pricing.',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function UsMarketPage() {
  const config = await getMarketConfig('us');
  // Standalone US site: English, pricing permanently visible
  return <MarketLanding config={config} showPrices={true} locale="en" />;
}
