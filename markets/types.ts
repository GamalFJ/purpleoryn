export type MarketId = 'dr' | 'us' | 'ca' | 'ht';

export interface TierPricing {
  setup: number | null;
  monthly: number | null;
  conversationsIncluded?: number | null;
  overageRate?: number | string | null;
}

export interface AddonPricing {
  setup: number | null;
  monthly: number | null;
  includedUnits?: number | null;
  unitLabel?: string;
  overageRate?: number | string | null;
}

export interface MarketPrices {
  currency: string;
  currencySymbol: string;
  presence: TierPricing;
  conversion: TierPricing;
  authority: TierPricing;
  voiceAddon: AddonPricing;
}

export interface MarketHero {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface MarketSystemPart {
  step: string;
  title: string;
  description: string;
}

export interface MarketSystem {
  sectionTitle: string;
  sectionSubtitle: string;
  parts: [MarketSystemPart, MarketSystemPart, MarketSystemPart];
  demoNotice: string;
  demoLinkText: string;
}

export interface MarketBonus {
  title: string;
  description: string;
}

export interface MarketGuarantee {
  title: string;
  deliveryGuarantee: string;
  capacityLimit: string;
  bonuses: MarketBonus[];
}

export interface MarketFaqItem {
  question: string;
  answer: string;
}

export interface MarketCta {
  type: 'whatsapp' | 'sms' | 'booking';
  label: string;
  destination: string;
  note?: string;
}

export interface MarketLegal {
  paymentNote: string;
  footerText: string;
}

export interface MarketContent {
  hero: MarketHero;
  system: MarketSystem;
  guarantee: MarketGuarantee;
  faq: MarketFaqItem[];
  paymentNote: string;
  cta: MarketCta;
  legal: MarketLegal;
}

export interface MarketConfig {
  id: MarketId;
  name: string;
  host: string;
  defaultLocale: string;
  supportedLocales: string[];
  currency: string;
  currencySymbol: string;
  primaryChannel: 'whatsapp' | 'sms' | 'booking';
  prices: MarketPrices;
  content: Record<string, MarketContent>;
}
