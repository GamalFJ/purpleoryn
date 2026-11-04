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
      overageRate: '$0.80',
      year1Total: 3865.87,
    },
    conversion: {
      setup: 2489.0,
      monthly: 347.99,
      conversationsIncluded: 300,
      overageRate: '$0.65',
      year1Total: 6664.88,
    },
    authority: {
      setup: 3989.99,
      monthly: 697.99,
      conversationsIncluded: 600,
      overageRate: '$0.65',
      year1Total: 12365.87,
    },
    voiceAddon: {
      setup: 989.99,
      monthly: 197.99,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: '$0.85/min',
      channelNote: 'Answers inbound calls 24/7 on a dedicated business phone line with natural conversational speech, answers questions, and books appointments.',
    },
  },
  content: {
    en: {
      hero: {
        badge: 'The Complete Commercial System',
        title: 'The business that answers first wins the customer.',
        subtitle: 'A high-conversion website, verified Google local visibility, and 24/7 AI agents that qualify leads instantly by text message and hand ready buyers to your team.',
        ctaText: 'Reserve Your Plan',
      },
      problemInsight: {
        tag: 'Speed to Lead',
        title: 'Responding within an hour makes qualifying a lead nearly 7x more likely.',
        statCallout: 'Harvard Business Review (2011) verified that companies responding to queries within an hour are nearly 7 times more likely to qualify the buyer than those waiting even one hour longer.',
        description: 'Most businesses lose high-intent buyers simply because customer inquiries arrive when staff is busy, after hours, or during weekends. Oryn responds in seconds, qualifies buyer requirements, and keeps opportunities warm.',
        hoursComparison: '168 hours of coverage every week versus roughly 44 hours for a single staff member.',
      },
      system: {
        sectionTitle: 'The Three-Part System',
        sectionSubtitle: 'Oryn Presence is always deployed as one integrated commercial engine: website, Google visibility, and AI messaging agents working in synergy.',
        parts: [
          {
            step: '01',
            title: 'High-Converting Website',
            description: 'Ultra-fast mobile architecture built on modern web standards to convert incoming visitors into verified client inquiries.',
          },
          {
            step: '02',
            title: 'Google and Search Visibility',
            description: 'Google Business Profile setup and upkeep, on-page SEO, GA4 and Search Console tracking, and consistent local search presence.',
          },
          {
            step: '03',
            title: 'AI Agents on Web and SMS',
            description: 'Intelligent agents running on your website chat and business SMS number that respond instantly, qualify leads, and dispatch ready buyers to your staff.',
          },
        ],
      },
      founderNote: {
        name: 'Gamal',
        title: 'Founder and Lead Engineer, Purple Cove Labs',
        text: 'Every Oryn Presence system is personally built and directed by Gamal at Purple Cove Labs. We do not sell simple chat widgets or disjointed websites. We deliver an end-to-end commercial client acquisition system built to turn search traffic into booked revenue.',
      },
      guarantee: {
        title: 'Onboarding Capacity and Exclusive Launch Bonuses',
        hasDeliveryGuarantee: false,
        capacityLimit: 'Capacity is strictly capped at 4 new businesses per month. Gamal builds every project personally, with one build start per week.',
        bonuses: [
          {
            title: 'Bonus 1: Google Launch Checklist',
            description: 'A client-facing checklist covering every single technical step executed for your Google presence, on-page SEO, and Search Console setup.',
          },
          {
            title: 'Bonus 2: SMS Quick-Reply Playbook',
            description: 'High-converting messaging templates for your team to communicate rapidly and close qualified leads alongside the AI agent.',
          },
        ],
      },
      faq: [
        {
          question: 'Why is Oryn Presence sold only as a complete system?',
          answer: 'An AI assistant without high-intent web traffic has no one to qualify. A website without instant response loses hot leads to faster competitors. By unifying conversion web design, Google visibility, and 24/7 SMS qualification, your business captures and converts every inquiry.',
        },
        {
          question: 'How do the agents interact with our prospective clients?',
          answer: 'The same agent answers both the website chat and text messages sent to your business line. It greets visitors immediately, answers FAQs, asks 3 to 5 qualifying questions, and hands qualified buyer notes straight to your team by text message.',
        },
        {
          question: 'Does the AI agent replace our current staff?',
          answer: 'Never. The agent is built to support your staff during nights, weekends, and high-volume moments when fast response is critical. It filters out spam and tire-kickers so your team only spends time with serious, qualified buyers.',
        },
        {
          question: 'How does the SMS channel function for US businesses?',
          answer: 'Your agent texts from a dedicated business phone number set up for your company. Your staff has full visibility into the conversation at all times and can take over the text thread whenever ready.',
        },
        {
          question: 'What are the ongoing monthly maintenance terms and overages?',
          answer: 'The monthly fee begins the month after your system goes live. It includes managed hosting, ongoing Google optimization, AI inference, and included monthly conversations. Extra conversations are billed at $0.80 (Presence), $0.65 (Conversion), and $0.65 (Authority).',
        },
        {
          question: 'What are the steps from order to launch?',
          answer: 'Our process follows 7 clear steps: short live walkthrough or PDF review, plan selection, order confirmation with setup form, 50% initial payment, build phase, final delivery sign-off, and monthly maintenance commencing the following month.',
        },
      ],
      paymentNote: 'Payment terms: 50% upon order confirmation, 50% on milestone delivery. Voice add-on is 100% upfront. Payment methods: bank transfer or PayPal. Submitting your order reserves your onboarding spot for 7 calendar days.',
      cta: {
        type: 'sms',
        label: 'Select Your Plan',
        destination: '#order',
        note: 'Order formal submission reserves your spot for 7 calendar days.',
      },
      legal: {
        paymentNote: 'Plans require 50% upon order confirmation and 50% on final delivery. Add-on modules require 100% upfront payment. Maintenance billed monthly from the month after go-live.',
        footerText: '© Purple Cove Labs. All rights reserved. Visit purpleoryn.com.',
      },
      askOrynName: 'Ask Oryn',
      tierHighlights: {
        presence: [
          'One-page conversion website with fast mobile architecture',
          'Basic on-page SEO: metadata, schema markup, and XML sitemap',
          'Complete Google Business Profile setup and upkeep',
          'GA4 and Google Search Console conversion tracking',
          'Receptionist agent ("Smart Qualifier"): answers inquiries 24/7, asks 3 to 5 qualifying questions',
          'Instant lead dispatch to SMS and email with structured details',
          '150 agent conversations per month included',
          'Email and SMS support with standard business hours response',
        ],
        conversion: [
          'Everything in Presence, plus:',
          'Multi-page website with dedicated service pages and bookings or catalog',
          '1 targeted SEO blog article per month and local citation building',
          'Monthly Google Business Profile posts and AI-assisted review replies',
          'Monthly executive performance report and lead insights',
          'Sales agent: lead scoring and automated 24-hour SMS follow-up sequence',
          'Simple commercial pipeline view to track opportunities',
          '300 agent conversations per month included',
          'Monthly strategic follow-up review meeting',
        ],
        authority: [
          'Everything in Conversion, plus:',
          'Continuous conversion rate optimization (CRO) with active A/B testing',
          'Competitor search monitoring and quarterly content calendar',
          'Weekly Google Business Profile posts and review generation campaign',
          'Booking agent (full agent): autonomous Google Calendar scheduling and customer order handling',
          'Lightweight CRM dashboard',
          '600 agent conversations per month included',
          'Quarterly leadership strategy call and dedicated priority VIP support line',
        ],
      },
      serviceRows: [
        {
          label: 'Website Architecture',
          presence: 'One-page site: hero, service highlights, trust indicators, and SMS contact trigger',
          conversion: 'Multi-page site: dedicated service pages plus bookings or structured product/service presentation',
          authority: 'Everything in Conversion, plus continuous conversion rate optimization with active A/B testing',
        },
        {
          label: 'Google Visibility & SEO',
          presence: 'Basic on-page SEO: metadata, schema markup, XML sitemap, and mobile Core Web Vitals tuning',
          conversion: 'Everything in Presence, plus local citation building and 1 targeted SEO blog article per month',
          authority: 'Everything in Conversion, plus continuous competitor monitoring and a quarterly content calendar',
        },
        {
          label: 'Google Business Profile',
          presence: 'Full setup and upkeep: categories, operating hours, business details, and launch posts',
          conversion: 'Everything in Presence, plus monthly Google Business posts and AI-assisted customer review replies',
          authority: 'Everything in Conversion, plus weekly Google Business posts and proactive review campaigns',
        },
        {
          label: 'Analytics & Reporting',
          presence: 'GA4 and Google Search Console integration with fundamental conversion tracking',
          conversion: 'Everything in Presence, plus monthly performance report and lead insights',
          authority: 'Everything in Conversion, plus deep strategic analytics and quarterly executive review call',
        },
        {
          label: 'AI Agent Role',
          presence: 'Receptionist ("Smart Qualifier"): answers inquiries 24/7, asks 3 to 5 qualifying questions, and hands lead notes to staff',
          conversion: 'Sales Agent: lead scoring, automatic 24-hour SMS follow-up sequence, and simple pipeline view',
          authority: 'Booking Agent (Full Agent): autonomous Google Calendar booking, customer orders, and lightweight CRM overview',
        },
        {
          label: 'Included Conversations',
          presence: '150 conversations per month included. Extra conversation: $0.80',
          conversion: '300 conversations per month included. Extra conversation: $0.65',
          authority: '600 conversations per month included. Extra conversation: $0.65',
        },
        {
          label: 'Support Channel',
          presence: 'Email and SMS support, standard business hours response',
          conversion: 'Everything in Presence, plus monthly follow-up review meeting',
          authority: 'Quarterly strategic advisory call and dedicated priority VIP support line',
        },
      ],
    },
  },
};

export default config;
