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
    // Frozen Packages
    starter: {
      setup: 1250.0,
      deposit: 875.0,
      balance: 375.0,
      monthly: 297.0,
      conversationsIncluded: 250,
      overageRate: '$0.50',
      year1Total: 4517.0, // 1250 + (297 * 11)
    },
    premium: {
      setup: 2500.0,
      deposit: 1750.0,
      balance: 750.0,
      monthly: 397.0,
      conversationsIncluded: 500,
      overageRate: '$0.45',
      year1Total: 6867.0, // 2500 + (397 * 11)
    },
    // Retained for backward-compatibility with generic market interfaces
    presence: {
      setup: 1250.0,
      deposit: 875.0,
      balance: 375.0,
      monthly: 297.0,
      conversationsIncluded: 250,
      overageRate: '$0.50',
      year1Total: 4517.0,
    },
    conversion: {
      setup: 2500.0,
      deposit: 1750.0,
      balance: 750.0,
      monthly: 397.0,
      conversationsIncluded: 500,
      overageRate: '$0.45',
      year1Total: 6867.0,
    },
    authority: {
      setup: 2500.0,
      deposit: 1750.0,
      balance: 750.0,
      monthly: 397.0,
      conversationsIncluded: 500,
      overageRate: '$0.45',
      year1Total: 6867.0,
    },
    voiceAddon: {
      setup: 0.0,
      monthly: 0.0,
      includedUnits: 0,
      unitLabel: 'minutes',
      overageRate: null,
      channelNote: 'Inbound voice receptionist workflow is built directly into the Premium package.',
    },
  },
  content: {
    en: {
      hero: {
        badge: 'Purple Oryn Lead Response System',
        title: "Your Next Customer Shouldn't Have to Wait.",
        subtitle:
          'Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.',
        ctaText: 'Book a Free 15-Minute Demo',
      },
      problemInsight: {
        tag: 'Operational Bottlenecks in Home Services',
        title: 'High-intent inquiries slip through when technicians are busy doing the work.',
        statCallout:
          'Common challenges across home-service businesses: missed calls during peak service hours, inquiries waiting hours for an email reply, and callbacks delayed until the customer has already contacted a competitor.',
        description:
          'When an emergency AC failure or burst pipe happens, homeowners reach out to multiple local providers. If an inquiry sits in an unmonitored inbox or goes to voicemail, the job usually goes to whoever answers first with clear, qualified answers.',
        hoursComparison: 'Continuous 24/7 lead capture vs. inquiries waiting for the morning office shift.',
      },
      system: {
        sectionTitle: 'A Practical Four-Step Response Workflow',
        sectionSubtitle:
          'Not a novelty chatbot or generic AI agency. The Lead Response System is a structured inquiry capture, qualification, and routing workflow built for home-service contractors.',
        parts: [
          {
            step: '01',
            title: 'Customer Contacts Your Business',
            description:
              'A potential customer reaches out via your website assistant or calls your dedicated inbound phone line seeking service.',
          },
          {
            step: '02',
            title: 'Assistant Responds & Collects Details',
            description:
              'The system answers immediately, greets the customer warmly, answers approved FAQs, and gathers essential service details.',
          },
          {
            step: '03',
            title: 'System Qualifies & Records Inquiry',
            description:
              'It identifies service type, job urgency, property location, and timeline, producing a clean, structured lead summary.',
          },
        ],
      },
      founderNote: {
        name: 'Purple Cove Labs',
        title: 'Implementation & Engineering Standards',
        text: 'Every Lead Response System implementation is configured, thoroughly tested against realistic customer questions, and verified with your approved business data before production launch.',
      },
      guarantee: {
        title: 'Implementation Process & Guardrails',
        hasDeliveryGuarantee: false,
        capacityLimit:
          'Each implementation is personally configured and tested with verified business information, service area constraints, and approved emergency escalation protocols.',
        bonuses: [
          {
            title: 'Approved FAQ & Knowledge Repository',
            description:
              'Custom knowledge base structured around your specific HVAC/plumbing service offerings, pricing guidance, and dispatch areas.',
          },
          {
            title: 'Urgent Dispatch Escalation Protocol',
            description:
              'Configured notification routing via SMS and email so emergency service requests immediately reach the right on-call technician or dispatcher.',
          },
        ],
      },
      faq: [
        {
          question: 'Does this replace my office staff?',
          answer:
            'No. The system is designed to support your office and field team, not replace them. It handles initial customer contact, repetitive qualification questions, and after-hours inquiries so your staff can focus on dispatch, scheduling confirmations, and delivering great on-site service.',
        },
        {
          question: 'Can it answer questions about my services?',
          answer:
            'Yes. The assistant is loaded exclusively with your approved business information, including your service list, covered service areas, typical diagnostic fees or policies, operating hours, and standard service FAQs. It does not invent policies or make unauthorized commitments.',
        },
        {
          question: 'Can it handle phone calls?',
          answer:
            'Yes, when you choose the Premium package. The Premium package includes an inbound voice receptionist workflow that answers incoming calls, asks qualification questions, summarizes the customer request, and routes the lead immediately. The Starter package focuses on website assistant and messaging capture.',
        },
        {
          question: 'Can it book appointments?',
          answer:
            'The system captures the customer’s preferred date and appointment window, qualifies urgency, and can route directly into an approved, supported calendar or CRM integration where technically available. If an automated confirmation integration is not connected, your staff confirms the final booking using the organized inquiry summary.',
        },
        {
          question: 'What happens when the assistant is uncertain?',
          answer:
            'When a customer asks a question outside the approved knowledge base or requests something requiring human judgment, the assistant transparently informs the customer that a team specialist will confirm the details. It logs the full inquiry and triggers an escalation notification directly to your team.',
        },
        {
          question: 'Are phone and messaging costs included?',
          answer:
            'No. Phone line minutes and text message (SMS) fees are billed directly at cost by the carrier based on your actual monthly usage. We never add any markup to phone or texting costs.',
        },
        {
          question: 'How long does implementation take?',
          answer:
            'Setup typically takes 7 to 14 business days once we receive your business information, FAQs, and phone line details. Both Starter and Premium systems are thoroughly tested with realistic customer scenarios and approved by your team before going live.',
        },
        {
          question: 'Do I need to replace my existing website?',
          answer:
            'No. The Lead Response System is designed to connect directly into your existing website. You do not need to rebuild or replace your current web presence. We provide a lightweight, clean snippet that embeds the assistant onto your site seamlessly.',
        },
      ],
      paymentNote:
        'Implementation pricing requires a deposit upfront to begin configuration, with the remaining balance due upon testing approval before production launch. Ongoing maintenance and support is billed monthly starting after launch. Third-party telecommunications and usage charges are billed separately.',
      cta: {
        type: 'booking',
        label: 'Book a Free 15-Minute Demo',
        destination: '#demo',
        note: 'Schedule a 15-minute live walkthrough of the Lead Response System.',
      },
      legal: {
        paymentNote:
          'Starter implementation: $1,250 ($875 deposit / $375 launch balance) + $297/mo. Premium implementation: $2,500 ($1,750 deposit / $750 launch balance) + $397/mo. Third-party provider and carrier usage charges billed separately.',
        footerText: '© Purple Cove Labs. All rights reserved. us.purpleoryn.com',
      },
      askOrynName: 'Ask Oryn',
      tierHighlights: {
        presence: [
          'One website assistant for customer inquiry capture',
          'Approved business information and FAQ repository',
          'Service and urgency qualification workflows',
          'Instant lead notifications via email and SMS',
          'One agreed follow-up workflow',
          'Basic lead tracking and dispatch logging',
        ],
        conversion: [
          'Everything in Starter, plus:',
          'One inbound voice receptionist workflow',
          'Automated call summaries and intelligent lead routing',
          'One supported calendar or CRM integration (where technically available)',
          'Human escalation workflow for complex or emergency inquiries',
          'Priority implementation review and ongoing system tuning',
        ],
        authority: [
          'Enterprise multi-trade configuration and multi-location routing',
          'Advanced CRM synchronization and dedicated SLA monitoring',
          'Custom after-hours emergency dispatch integrations',
        ],
      },
    },
  },
};

export default config;
