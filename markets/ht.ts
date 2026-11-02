import 'server-only';
import type { MarketConfig } from './types';

export const config: MarketConfig = {
  id: 'ht',
  name: 'Haïti',
  host: 'ht.purpleoryn.com',
  defaultLocale: 'fr',
  supportedLocales: ['fr', 'en'],
  currency: 'USD',
  currencySymbol: '$',
  primaryChannel: 'whatsapp',
  prices: {
    currency: 'USD',
    currencySymbol: '$',
    presence: {
      setup: 999.99,
      monthly: 229.99,
      conversationsIncluded: 150,
      overageRate: '$0.20',
    },
    conversion: {
      setup: 1599.99,
      monthly: 429.99,
      conversationsIncluded: 300,
      overageRate: '$0.18',
    },
    authority: {
      setup: 1999.99,
      monthly: 649.99,
      conversationsIncluded: 600,
      overageRate: '$0.15',
    },
    voiceAddon: {
      setup: 500.0,
      monthly: 299.99,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: '$0.45',
    },
  },
  content: {
    fr: {
      hero: {
        badge: 'Système numérique complet pour entreprises',
        title: 'Votre entreprise visible sur Google et captant des clients sur WhatsApp.',
        subtitle: 'Un site web ultra-rapide, un référencement local solide et un agent d intelligence artificielle qui qualifie les demandes 24 heures sur 24.',
        ctaText: 'Demander une proposition',
      },
      system: {
        sectionTitle: 'Le système en trois parties',
        sectionSubtitle: 'Une solution complète combinant site moderne, visibilité sur Google et automatisation commerciale.',
        parts: [
          {
            step: '01',
            title: 'Site web haute performance',
            description: 'Conception professionnelle optimisée pour mobile et navigation rapide, prête pour la conversion.',
          },
          {
            step: '02',
            title: 'Google et visibilité locale',
            description: 'Fiche d établissement configurée et optimisée pour capter les recherches stratégiques de votre secteur.',
          },
          {
            step: '03',
            title: 'Agent d IA et WhatsApp',
            description: 'Un assistant disponible 24/7 qui répond aux clients, qualifie leurs besoins et transmet les dossiers sur WhatsApp.',
          },
        ],
        demoNotice: 'Testez le système en temps réel grâce à notre démonstrateur interactif.',
        demoLinkText: 'Essayer la démonstration en direct',
      },
      guarantee: {
        title: 'Garantie de livraison, disponibilité et bonus',
        deliveryGuarantee: 'Garantie de livraison en 7 jours ouvrables: si nous manquons le délai, votre premier mois de maintenance est 100% offert.',
        capacityLimit: 'Capacité limitée: nous acceptons un maximum de 4 nouveaux clients par mois pour assurer un accompagnement d excellence.',
        bonuses: [
          {
            title: 'Bonus 1: Guide pratique de lancement Google',
            description: 'Les directives clés pour accélérer la notoriété et les avis positifs sur votre fiche dès son activation.',
          },
          {
            title: 'Bonus 2: Manuel de réponses rapides WhatsApp',
            description: 'Modèles de messages prêts à l emploi pour convertir rapidement les prospects qualifiés par l agent.',
          },
        ],
      },
      faq: [
        {
          question: 'Que comprend exactement la mise en place du système?',
          answer: 'La création du site web, le paramétrage technique de votre fiche Google, les outils d analyse de trafic et l agent d intelligence artificielle configuré avec les offres de votre entreprise.',
        },
        {
          question: 'Comment s applique la garantie de 7 jours ouvrables?',
          answer: 'Le délai démarre dès la réception de vos informations et contenus. Si votre projet n est pas déployé en 7 jours ouvrés, le premier mois de gestion est totalement gratuit.',
        },
        {
          question: 'Comment mes prospects sont-ils acheminés?',
          answer: 'L agent engage la conversation sur votre site, pose les questions nécessaires pour qualifier la demande, puis vous envoie la fiche complète directement sur WhatsApp.',
        },
        {
          question: 'Quelles sont les modalités pour les appels et la voix?',
          answer: 'Le module complémentaire Agente de Voz IA permet de gérer les appels vocaux entrants sur WhatsApp avec une voix naturelle 24 heures sur 24.',
        },
      ],
      paymentNote: 'Modalités de paiement: virements bancaires internationaux (USD), virements bancaires locaux en Haïti (Unibank, Sogebank) ou paiement par carte de crédit.',
      cta: {
        type: 'whatsapp',
        label: 'Contacter sur WhatsApp',
        destination: process.env.WHATSAPP_HT || 'https://wa.me/18293417129',
        note: 'Réponse rapide garantie pendant les heures de bureau.',
      },
      legal: {
        paymentNote: 'Règlement: 50% au début des travaux et 50% à la livraison finale. Modules complémentaires réglés à 100% à la commande.',
        footerText: '© Purple Cove Labs. Tous droits réservés.',
      },
    },
    en: {
      hero: {
        badge: 'Enterprise Growth Infrastructure',
        title: 'Expand your business with Google discovery and WhatsApp AI qualification.',
        subtitle: 'A high-speed modern website, local Google presence, and an AI conversational agent qualifying customer leads 24/7.',
        ctaText: 'Request a Proposal',
      },
      system: {
        sectionTitle: 'The Three-Part System',
        sectionSubtitle: 'A complete commercial engine connecting website authority, Google presence, and automated WhatsApp routing.',
        parts: [
          {
            step: '01',
            title: 'High-Converting Website',
            description: 'Built for instant mobile speed, professional brand credibility, and clear conversion pathways.',
          },
          {
            step: '02',
            title: 'Google and Search Visibility',
            description: 'Optimized presence designed to capture regional buyer searches and build verified trust.',
          },
          {
            step: '03',
            title: 'AI Qualification and WhatsApp',
            description: '24/7 conversational intake that filters inquiries and forwards actionable lead profiles to your WhatsApp.',
          },
        ],
        demoNotice: 'Test the live conversational flow on our interactive demonstration.',
        demoLinkText: 'Try Live Interactive Demo',
      },
      guarantee: {
        title: 'Delivery Guarantee, Client Onboarding Cap, and Bonuses',
        deliveryGuarantee: '7-business-day delivery guarantee: if we miss the promised launch, your first month of service management is free.',
        capacityLimit: 'Capacity cap: strictly limited to 4 new client onboardings each month to ensure dedicated implementation.',
        bonuses: [
          {
            title: 'Bonus 1: Google Local Authority Checklist',
            description: 'Proven strategies to gather reviews and establish immediate credibility in your market.',
          },
          {
            title: 'Bonus 2: WhatsApp Quick-Reply Guide',
            description: 'Sales communication templates to close prospects instantly once handed off by the AI.',
          },
        ],
      },
      faq: [
        {
          question: 'What is included in the implementation?',
          answer: 'Complete responsive web development, Google Business setup, search analytics integration, and full configuration of the Oryn AI agent.',
        },
        {
          question: 'How does the 7-day guarantee work?',
          answer: 'The countdown begins once onboarding assets are received. If we do not deliver within 7 business days, your first month of maintenance is free.',
        },
        {
          question: 'How are leads delivered?',
          answer: 'The AI assistant chats with visitors, qualifies their budget and interest, and delivers structured client details straight to your WhatsApp.',
        },
        {
          question: 'What payment methods are supported?',
          answer: 'We accept wire transfers in USD, local Haitian commercial bank transfers, and major credit cards.',
        },
      ],
      paymentNote: 'Payment rails: wire transfer in USD, domestic commercial bank transfers (Unibank, Sogebank), or credit card.',
      cta: {
        type: 'whatsapp',
        label: 'Connect via WhatsApp',
        destination: process.env.WHATSAPP_HT || 'https://wa.me/18293417129',
        note: 'Quick response during regular business hours.',
      },
      legal: {
        paymentNote: 'Terms: 50% upon project kickoff and 50% upon milestone sign-off. Modules are paid 100% upfront.',
        footerText: '© Purple Cove Labs. All rights reserved.',
      },
    },
  },
};

export default config;
