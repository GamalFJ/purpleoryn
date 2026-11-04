import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { MarketLanding } from '@/components/market/MarketLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Oryn Presence USA | Turn Search Into Inbound Clients',
  description:
    'High-conversion web development, Google search visibility, and 24/7 SMS AI agents for US businesses. The business that answers first wins the customer.',
  openGraph: {
    title: 'Oryn Presence USA | Turn Search Into Inbound Clients',
    description:
      'High-conversion web development, Google search visibility, and 24/7 SMS AI agents for US businesses. The business that answers first wins the customer.',
    url: 'https://us.purpleoryn.com',
    siteName: 'Purple Cove Labs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oryn Presence USA | Turn Search Into Inbound Clients',
    description:
      'High-conversion web development, Google search visibility, and 24/7 SMS AI agents for US businesses. The business that answers first wins the customer.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function UsMarketPage() {
  const config = await getMarketConfig('us');
  return <MarketLanding config={config} showPrices={true} locale="en" />;
}
