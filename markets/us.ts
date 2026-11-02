import 'server-only';
import type { MarketConfig } from './types';

export const config: MarketConfig = {
  id: 'us',
  name: 'United States',
  host: 'us.purpleoryn.com',
  defaultLocale: 'en',
  supportedLocales: ['en'],
  currency: 'USD',
  currencySymbol: '$',
  primaryChannel: 'sms',
  prices: {
    currency: 'USD',
    currencySymbol: '$',
    presence: {
      setup: 1489.99,
      monthly: 197.99,
      conversationsIncluded: 150,
      overageRate: '$0.20',
    },
    conversion: {
      setup: 2489.0,
      monthly: 347.99,
      conversationsIncluded: 300,
      overageRate: '$0.18',
    },
    authority: {
      setup: 3989.99,
      monthly: 697.99,
      conversationsIncluded: 600,
      overageRate: '$0.15',
    },
    voiceAddon: {
      setup: 989.99,
      monthly: 197.99,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: '$0.45',
    },
  },
  content: {
    en: {
      hero: {
        badge: 'Complete Digital Growth System',
        title: 'Turn local search into scheduled clients through SMS automation.',
        subtitle: 'A high-speed conversion site, optimized Google search presence, and an AI agent that qualifies leads 24/7 and delivers them directly to text message.',
        ctaText: 'Book a Consultation',
      },
      system: {
        sectionTitle: 'The Three-Part System',
        sectionSubtitle: 'We deliver an integrated engine: website, local search visibility, and AI automation working in harmony.',
        parts: [
          {
            step: '01',
            title: 'High-Converting Website',
            description: 'Lightning-fast mobile architecture built to capture customer intent and build instant authority.',
          },
          {
            step: '02',
            title: 'Google and Local Search Engine Optimization',
            description: 'Targeted keyword architecture, verified business profile optimization, and local citation authority.',
          },
          {
            step: '03',
            title: 'AI Qualification and SMS Handoff',
            description: 'An AI assistant that answers questions 24/7, qualifies prospective buyers, and forwards full notes straight to SMS.',
          },
        ],
        demoNotice: 'Experience the full conversational workflow on our live interactive demo.',
        demoLinkText: 'Test Live Interactive Demo',
      },
      guarantee: {
        title: 'Delivery Guarantee, Client Cap, and Exclusive Bonuses',
        deliveryGuarantee: '7-business-day delivery guarantee: if we miss the deployment deadline, your first month of maintenance is 100% free.',
        capacityLimit: 'Strict capacity limit: we onboard a maximum of 4 new clients per month to maintain dedicated execution.',
        bonuses: [
          {
            title: 'Bonus 1: Google Local Authority Checklist',
            description: 'Our proprietary playbook to capture reviews, rank in the map pack, and secure high-intent local inbound calls.',
          },
          {
            title: 'Bonus 2: SMS Quick-Reply Playbook',
            description: 'High-converting message templates to close qualified leads immediately upon SMS delivery.',
          },
        ],
      },
      faq: [
        {
          question: 'Why is this offered as a three-part system rather than just an AI chatbot?',
          answer: 'An AI assistant without high-intent traffic generates no revenue. A website without instant qualification loses leads to competitors. By pairing conversion design, local Google visibility, and 24/7 qualification into one unified workflow, your business captures and closes every opportunity.',
        },
        {
          question: 'How does the SMS qualification workflow operate?',
          answer: 'When a visitor lands on your site, the AI assistant answers inquiries, asks key qualification questions, and instantly texts your team the prospective client details so you can close them immediately.',
        },
        {
          question: 'What is the 7-business-day delivery guarantee?',
          answer: 'Once onboarding assets and business information are submitted, your complete system goes live within 7 business days. If we miss that schedule, your first month of maintenance is free.',
        },
        {
          question: 'What are the ongoing monthly costs?',
          answer: 'Monthly retainers cover high-speed hosting, ongoing search maintenance, AI inference, and support. Extra usage beyond your tier is billed at standard per-conversation and per-minute rates.',
        },
      ],
      paymentNote: 'Payment rails: major corporate credit cards, ACH bank transfers, and Stripe electronic billing. 50% upon contract initiation and 50% upon delivery approval.',
      cta: {
        type: 'booking',
        label: 'Schedule a Consultation',
        destination: process.env.BOOKING_URL_US || 'https://cal.com/purplecove/consultation',
        note: 'Select an available 20-minute strategy slot on our calendar.',
      },
      legal: {
        paymentNote: 'Plans are billed 50% upfront and 50% on final milestone delivery. Add-on modules are billed 100% upfront.',
        footerText: '© Purple Cove Labs. All rights reserved.',
      },
    },
  },
};

export default config;
