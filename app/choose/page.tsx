import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { ChooseClient } from './ChooseClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Choose Your Region | Purple Cove Labs',
  description: 'Select your region to explore Purple Cove Labs digital growth infrastructure.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChoosePage() {
  const reqHeaders = await headers();
  const acceptLang = reqHeaders.get('accept-language') || '';
  const initialLocale: 'en' | 'fr' = acceptLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://cal.com/purplecove/consultation';

  return <ChooseClient initialLocale={initialLocale} bookingUrl={bookingUrl} />;
}
