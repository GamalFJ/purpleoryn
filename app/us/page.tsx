import 'server-only';
import type { Metadata } from 'next';
import { getMarketConfig } from '@/markets';
import { UsLeadResponseLanding } from '@/components/market/UsLeadResponseLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Purple Oryn | Lead Response System for U.S. Home-Service Businesses",
  description:
    "Your Next Customer Shouldn't Have to Wait. Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.",
  openGraph: {
    title: "Purple Oryn | Lead Response System for U.S. Home-Service Businesses",
    description:
      "Your Next Customer Shouldn't Have to Wait. Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.",
    url: 'https://us.purpleoryn.com',
    siteName: 'Purple Oryn',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Purple Oryn | Lead Response System for U.S. Home-Service Businesses",
    description:
      "Your Next Customer Shouldn't Have to Wait. Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function UsMarketPage() {
  const config = await getMarketConfig('us');
  return <UsLeadResponseLanding config={config} />;
}
