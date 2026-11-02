import 'server-only';
import type { MarketConfig } from './types';

export const config: MarketConfig = {
  id: 'ca',
  name: 'Canada',
  host: 'ca.purpleoryn.com',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr'],
  currency: 'CAD',
  currencySymbol: 'CAD $',
  primaryChannel: 'booking',
  prices: {
    currency: 'CAD',
    currencySymbol: 'CAD $',
    presence: {
      setup: null,
      monthly: null,
      conversationsIncluded: 150,
      overageRate: null,
    },
    conversion: {
      setup: null,
      monthly: null,
      conversationsIncluded: 300,
      overageRate: null,
    },
    authority: {
      setup: null,
      monthly: null,
      conversationsIncluded: 600,
      overageRate: null,
    },
    voiceAddon: {
      setup: null,
      monthly: null,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: null,
    },
  },
  content: {
    en: {
      hero: {
        badge: 'Enterprise Digital Growth Infrastructure',
        title: 'Accelerate client acquisition with local search, modern web, and AI qualification.',
        subtitle: 'A high-performance conversion platform, Canadian local search visibility, and an intelligent assistant qualifying customer requests around the clock.',
        ctaText: 'Schedule a Strategy Session',
      },
      system: {
        sectionTitle: 'The Three-Part System',
        sectionSubtitle: 'An integrated growth model combining high-speed web architecture, local Google positioning, and intelligent lead qualification.',
        parts: [
          {
            step: '01',
            title: 'High-Performance Web Architecture',
            description: 'Ultra-fast loading speed and focused conversion architecture adapted to Canadian consumer habits.',
          },
          {
            step: '02',
            title: 'Canadian Local Search and SEO',
            description: 'Localized Google profile optimization, bilingual readiness, and structured data for regional search engine rankings.',
          },
          {
            step: '03',
            title: 'AI Qualification and Automated Routing',
            description: '24/7 client intake that screens requirements, answers inquiries, and delivers qualified leads directly to your team.',
          },
        ],
        demoNotice: 'Test the live conversational workflow on our interactive demonstration platform.',
        demoLinkText: 'Access Live Interactive Demo',
      },
      guarantee: {
        title: 'Delivery Guarantee, Capacity Limits, and Partner Bonuses',
        deliveryGuarantee: '7-business-day delivery guarantee: if project milestones are delayed on our end, your first month of ongoing management is free.',
        capacityLimit: 'Capacity control: strictly limited to 4 new client onboardings per month to guarantee executive-level execution.',
        bonuses: [
          {
            title: 'Bonus 1: Canadian Local SEO Launch Blueprint',
            description: 'A detailed execution framework for Google business verification, local review generation, and regional discovery.',
          },
          {
            title: 'Bonus 2: High-Velocity Sales Routing Playbook',
            description: 'Standard operating procedures for managing qualified inbound inquiries with zero latency.',
          },
        ],
      },
      faq: [
        {
          question: 'What makes this different from purchasing an off-the-shelf chatbot?',
          answer: 'We deploy an integrated commercial infrastructure: custom conversion web design, local search authority, and custom AI qualification tailored to your specific service catalogue.',
        },
        {
          question: 'Is bilingual English and French support available?',
          answer: 'Yes. Our systems support seamless English and French interfaces, ideal for businesses serving Quebec or nationwide Canadian markets.',
        },
        {
          question: 'How is pricing structured?',
          answer: 'Pricing is shared during your consultation based on your required volume, service scope, and technical integrations.',
        },
        {
          question: 'How is the 7-business-day timeline tracked?',
          answer: 'The deployment timeline starts upon receipt of the onboarding documentation. We build, configure, test, and hand over the live system within 7 business days.',
        },
      ],
      paymentNote: 'Payment rails: Canadian EFT bank transfers, Interac e-Transfer, and corporate credit cards. Custom invoicing available in CAD.',
      cta: {
        type: 'booking',
        label: 'Schedule a Consultation',
        destination: process.env.BOOKING_URL_CA || 'https://cal.com/purplecove/consultation-ca',
        note: 'Select an available time slot for your strategic discovery call.',
      },
      legal: {
        paymentNote: 'Payment terms: 50% upon engagement and 50% upon delivery sign-off. Add-on modules require 100% advance payment.',
        footerText: '© Purple Cove Labs. All rights reserved.',
      },
    },
    fr: {
      hero: {
        badge: 'Infrastructure numérique de croissance',
        title: 'Accélérez l acquisition de clients avec le référencement local et l intelligence artificielle.',
        subtitle: 'Une plateforme web ultra-rapide, une visibilité Google optimisée et un assistant d IA qui qualifie vos prospects 24 heures sur 24.',
        ctaText: 'Planifier une consultation',
      },
      system: {
        sectionTitle: 'Le système en trois volets',
        sectionSubtitle: 'Un modèle intégré alliant architecture web rapide, visibilité locale sur Google et qualification automatisée.',
        parts: [
          {
            step: '01',
            title: 'Site web haute performance',
            description: 'Conception axée sur la conversion, optimisée pour mobile et avec un temps de chargement immédiat.',
          },
          {
            step: '02',
            title: 'Référencement local et Google',
            description: 'Optimisation de la fiche d établissement Google, balisage structuré et autorité locale ciblée.',
          },
          {
            step: '03',
            title: 'Qualification par IA et transmission directe',
            description: 'Un assistant disponible 24/7 pour répondre aux questions courantes, filtrer les demandes et les transmettre à votre équipe.',
          },
        ],
        demoNotice: 'Découvrez le fonctionnement en direct sur notre démonstrateur interactif.',
        demoLinkText: 'Tester la démonstration en direct',
      },
      guarantee: {
        title: 'Garantie de livraison, places limitées et bonus exclusifs',
        deliveryGuarantee: 'Garantie de livraison en 7 jours ouvrables: si nous manquons le délai, votre premier mois de maintenance est sans frais.',
        capacityLimit: 'Capacité restreinte: un maximum de 4 nouveaux clients par mois afin de maintenir un standard rigoureux de qualité.',
        bonuses: [
          {
            title: 'Bonus 1: Guide de lancement et de visibilité Google',
            description: 'Les étapes concrètes pour maximiser la réputation et le classement de votre fiche dès son lancement.',
          },
          {
            title: 'Bonus 2: Protocole de conversion rapide des prospects',
            description: 'Modèles de communication pour convertir immédiatement les demandes transmises par l assistant.',
          },
        ],
      },
      faq: [
        {
          question: 'Pourquoi proposer un système complet plutôt qu un simple robot conversationnel?',
          answer: 'Un assistant virtuel sans trafic qualifié ne génère aucun revenu. En combinant un site optimisé, la visibilité Google et la qualification 24/7, votre entreprise capte et conclut chaque opportunité.',
        },
        {
          question: 'Le système prend-il en charge le français et l anglais?',
          answer: 'Oui, nos architectures sont entièrement bilingues et configurées selon les préférences linguistiques de vos clients au Québec et dans tout le Canada.',
        },
        {
          question: 'Comment les tarifs sont-ils établis?',
          answer: 'Les tarifs sont partagés lors de votre consultation en fonction des volumes prévus et des modules requis pour votre entreprise.',
        },
        {
          question: 'Comment s applique la garantie de livraison?',
          answer: 'Le compte à rebours de 7 jours ouvrables débute à la réception des documents nécessaires. Si le site n est pas livré à temps, le premier mois de gestion est offert.',
        },
      ],
      paymentNote: 'Modes de paiement acceptés: virements bancaires TEF canadiens, Virement Interac et cartes de crédit professionnelles.',
      cta: {
        type: 'booking',
        label: 'Planifier une consultation',
        destination: process.env.BOOKING_URL_CA || 'https://cal.com/purplecove/consultation-ca',
        note: 'Choisissez un créneau de 20 minutes sur notre calendrier.',
      },
      legal: {
        paymentNote: 'Modalités: 50% au démarrage et 50% à la livraison finale. Modules complémentaires réglés à 100% au départ.',
        footerText: '© Purple Cove Labs. Tous droits réservés.',
      },
    },
  },
};

export default config;
