import 'server-only';
import type { MarketConfig } from './types';

export const config: MarketConfig = {
  id: 'ca',
  name: 'Canada',
  host: 'ca.purpleoryn.com',
  defaultLocale: 'fr',
  supportedLocales: ['fr', 'en'],
  currency: 'CAD',
  currencySymbol: 'CA$',
  primaryChannel: 'sms',
  prices: {
    currency: 'CAD',
    currencySymbol: 'CA$',
    presence: {
      setup: 1989.99,
      monthly: 267.99,
      conversationsIncluded: 150,
      overageRate: 'CA$1.05',
      year1Total: 5205.87,
    },
    conversion: {
      setup: 3389.99,
      monthly: 477.99,
      conversationsIncluded: 300,
      overageRate: 'CA$0.90',
      year1Total: 9125.87,
    },
    authority: {
      setup: 5489.99,
      monthly: 897.99,
      conversationsIncluded: 600,
      overageRate: 'CA$0.90',
      year1Total: 16265.87,
    },
    voiceAddon: {
      setup: 1389.99,
      monthly: 267.99,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: 'CA$1.10/min',
      channelNote: 'Prend en charge les appels entrants 24h/24 sur une ligne téléphonique professionnelle canadienne avec une voix naturelle, répond aux questions et prend des rendez-vous.',
    },
  },
  content: {
    fr: {
      hero: {
        badge: 'Le Système Commercial Complet',
        title: 'L’entreprise qui répond la première remporte le client.',
        subtitle: 'Un site web conçu pour convertir, une visibilité Google optimisée et des agents d’IA qui qualifient vos prospects 24h/24 par SMS pour transmettre des clients prêts à votre équipe.',
        ctaText: 'Réserver votre formule',
      },
      problemInsight: {
        tag: 'Vitesse de Réponse',
        title: 'Répondre dans l’heure multiplie par près de 7 vos chances de qualifier un prospect.',
        statCallout: 'Une étude de la Harvard Business Review (2011) démontre qu’une entreprise qui répond à une demande dans l’heure a près de 7 fois plus de chances de qualifier son prospect qu’en attendant ne serait-ce qu’une heure supplémentaire.',
        description: 'La majorité des entreprises perdent des clients qualifiés parce que les demandes arrivent en soirée, la fin de semaine ou pendant les heures d’affluence. Oryn répond en quelques secondes, valide les besoins et garde vos prospects actifs.',
        hoursComparison: '168 heures de disponibilité chaque semaine contre environ 44 heures pour un employé.',
      },
      system: {
        sectionTitle: 'Le système en trois volets',
        sectionSubtitle: 'Oryn Presence est toujours déployé comme un moteur commercial complet: site web, référencement Google et agents d’IA fonctionnant en parfaite harmonie.',
        parts: [
          {
            step: '01',
            title: 'Site web haute conversion',
            description: 'Architecture moderne ultra-rapide sur mobile, pensée pour transformer les visiteurs en demandes commerciales concrètes.',
          },
          {
            step: '02',
            title: 'Visibilité et référencement Google',
            description: 'Configuration et maintenance de votre fiche Google Business Profile, SEO on-page, balisage structuré et suivi GA4 et Search Console.',
          },
          {
            step: '03',
            title: 'Agents d’IA sur le web et par SMS',
            description: 'Des agents intelligents sur votre site et votre numéro SMS d’entreprise qui accueillent instantanément, qualifient les demandes et orientent les acheteurs vers votre équipe.',
          },
        ],
      },
      founderNote: {
        name: 'Gamal',
        title: 'Fondateur et ingénieur principal, Purple Cove Labs',
        text: 'Chaque projet Oryn Presence est personnellement conçu et réalisé par Gamal chez Purple Cove Labs. Nous ne vendons pas de simples robots conversationnels ni de sites isolés. Nous mettons en place un système complet de captation et de conversion commerciale pour votre entreprise.',
      },
      guarantee: {
        title: 'Capacité d’accueil et bonus exclusifs de lancement',
        hasDeliveryGuarantee: false,
        capacityLimit: 'Capacité strictement limitée à 4 nouvelles entreprises par mois. Gamal réalise chaque projet personnellement, au rythme d’un lancement par semaine.',
        bonuses: [
          {
            title: 'Bonus 1: Liste de Lancement Google',
            description: 'Une liste de contrôle client détaillée pour suivre chaque action technique menée sur votre visibilité Google, votre SEO et Search Console.',
          },
          {
            title: 'Bonus 2: Guide de Réponses Rapides par SMS',
            description: 'Des modèles de messages optimisés pour permettre à votre équipe de répondre avec rapidité et conclure les ventes aux côtés de l’agent.',
          },
        ],
      },
      faq: [
        {
          question: 'Pourquoi Oryn Presence est-il vendu uniquement comme un système complet?',
          answer: 'Un assistant virtuel sans trafic web qualifié ne génère aucun revenu. Un site web sans réponse instantanée perd ses prospects au profit de concurrents plus rapides. En réunissant un site optimisé, la visibilité Google et la qualification 24h/24 par SMS, votre entreprise capte et conclut chaque opportunité.',
        },
        {
          question: 'Comment fonctionnent les agents d’IA avec nos clients?',
          answer: 'Le même agent prend en charge le clavardage sur votre site et les textos envoyés à votre numéro d’affaires. Il accueille immédiatement, répond aux questions fréquentes, pose 3 à 5 questions de qualification et transmet le dossier qualifié à votre équipe par texto.',
        },
        {
          question: 'L’agent d’IA remplace-t-il nos employés actuels?',
          answer: 'Absolument pas. L’agent vient soutenir votre personnel les soirs, les fins de semaine et dès les premières minutes où la réactivité fait toute la différence. Il filtre les demandes non pertinentes pour que votre équipe se consacre uniquement aux acheteurs prêts à passer à l’action.',
        },
        {
          question: 'Comment s’organise le canal SMS au Canada?',
          answer: 'Les messages sont envoyés depuis un numéro d’affaires vérifié configuré pour votre entreprise, respectant les normes de télécommunication canadiennes et le consentement CASL. Votre personnel conserve une visibilité totale et peut intervenir à tout moment dans la conversation.',
        },
        {
          question: 'Quelles sont les modalités de maintenance et d’utilisation supplémentaire?',
          answer: 'L’abonnement mensuel commence le mois suivant la mise en service. Il couvre l’hébergement performant, l’optimisation continue sur Google, les calculs d’IA et les conversations incluses. Les conversations supplémentaires sont facturées CA$1.05 (Présence), CA$0.90 (Conversion) et CA$0.90 (Autorité).',
        },
        {
          question: 'Quelles sont les étapes du projet, de la commande à la livraison?',
          answer: 'Notre méthode se déroule en 7 étapes simples: présentation courte ou lecture du document PDF, sélection de la formule, confirmation de commande et réception du formulaire de configuration, acompte de 50%, phase de développement, livraison finale, puis démarrage de l’abonnement mensuel le mois suivant.',
        },
      ],
      paymentNote: 'Conditions de règlement: 50% à la confirmation de la commande, 50% à la livraison. Le module vocal est réglé à 100% à la commande. Modes de paiement: virement bancaire ou PayPal. L’envoi du formulaire réserve votre créneau d’intégration pendant 7 jours civils.',
      cta: {
        type: 'sms',
        label: 'Choisir votre formule',
        destination: '#order',
        note: 'La confirmation formelle de commande réserve votre créneau pour 7 jours civils.',
      },
      legal: {
        paymentNote: 'Formules réglées 50% à la confirmation et 50% à la livraison. Modules complémentaires réglés à 100% d’avance. Abonnement facturé mensuellement à partir du mois suivant la mise en ligne.',
        footerText: '© Purple Cove Labs. Tous droits réservés. Visitez purpleoryn.com.',
      },
      askOrynName: 'Demandez à Oryn',
      tierHighlights: {
        presence: [
          'Site web d’une page axé sur la conversion avec vitesse mobile optimisée',
          'SEO on-page essentiel: balises méta, balisage structuré et sitemap XML',
          'Configuration et maintenance intégrale de Google Business Profile',
          'Suivi analytique GA4 et Google Search Console',
          'Agent réceptionniste ("Smart Qualifier"): répond 24h/24 et pose 3 à 5 questions de qualification',
          'Transmission instantanée des fiches prospects qualifiées par SMS et courriel',
          '150 conversations par mois incluses',
          'Assistance par courriel et SMS en jours ouvrables',
        ],
        conversion: [
          'Tout ce qui est inclus dans Présence, plus:',
          'Site multi-pages avec pages détaillées et réservations ou catalogue',
          '1 article de blog SEO par mois et citations locales canadiennes',
          'Publications mensuelles Google Business et réponses aux avis par IA',
          'Rapport de performance mensuel et analyse des contacts',
          'Agent commercial: notation des prospects et relance automatique par texto sous 24h',
          'Vue simple du pipeline commercial',
          '300 conversations par mois incluses',
          'Rencontre de suivi stratégique mensuelle',
        ],
        authority: [
          'Tout ce qui est inclus dans Conversion, plus:',
          'Optimisation continue du taux de conversion (CRO) avec tests A/B actifs',
          'Veille concurrentielle et calendrier éditorial trimestriel',
          'Publications hebdomadaires Google Business et campagne d’avis clients',
          'Agent de réservation complet: synchronisation Google Calendar et gestion des commandes',
          'Tableau de bord CRM léger',
          '600 conversations par mois incluses',
          'Rencontre stratégique trimestrielle et ligne de support prioritaire VIP',
        ],
      },
      serviceRows: [
        {
          label: 'Architecture du site web',
          presence: 'Site d’une page axé sur la conversion: accueil, présentation des services, éléments de réassurance et déclencheur SMS',
          conversion: 'Site multi-pages: pages détaillées par service et module de réservation ou catalogue',
          authority: 'Tout ce qui est inclus dans Conversion, plus optimisation continue du taux de conversion avec tests A/B actifs',
        },
        {
          label: 'Visibilité Google et référencement',
          presence: 'SEO on-page essentiel: balises méta, données structurées (schema), sitemap XML et optimisation de vitesse',
          conversion: 'Tout ce qui est inclus dans Présence, plus inscriptions locales canadiennes et 1 article de blog SEO par mois',
          authority: 'Tout ce qui est inclus dans Conversion, plus veille concurrentielle approfondie et calendrier éditorial trimestriel',
        },
        {
          label: 'Fiche Google Business Profile',
          presence: 'Configuration et entretien: catégories, horaires, renseignements commerciaux et publications initiales',
          conversion: 'Tout ce qui est inclus dans Présence, plus publications mensuelles et réponses aux avis assistées par IA',
          authority: 'Tout ce qui est inclus dans Conversion, plus publications hebdomadaires et campagne proactive d’avis clients',
        },
        {
          label: 'Rapports et analytique',
          presence: 'Intégration GA4 et Search Console avec suivi rigoureux des conversions de base',
          conversion: 'Tout ce qui est inclus dans Présence, plus rapport de performance mensuel détaillé',
          authority: 'Tout ce qui est inclus dans Conversion, plus analyse stratégique et rencontre d’évaluation trimestrielle',
        },
        {
          label: 'Rôle des agents d’IA',
          presence: 'Réceptionniste ("Smart Qualifier"): répond 24h/24, pose 3 à 5 questions de qualification et transmet la fiche à votre équipe',
          conversion: 'Agent commercial: notation des prospects, séquence de relance automatique par texto sous 24h et vue pipeline',
          authority: 'Agent de réservation complet: prise de rendez-vous sur Google Calendar, prise de commande et aperçu CRM léger',
        },
        {
          label: 'Conversations mensuelles incluses',
          presence: '150 conversations par mois incluses. Conversation supplémentaire: CA$1.05',
          conversion: '300 conversations par mois incluses. Conversation supplémentaire: CA$0.90',
          authority: '600 conversations par mois incluses. Conversation supplémentaire: CA$0.90',
        },
        {
          label: 'Canal d’assistance',
          presence: 'Assistance par courriel et SMS pendant les heures normales d’affaires',
          conversion: 'Tout ce qui est inclus dans Présence, plus rencontre de suivi mensuelle',
          authority: 'Appel de conseil stratégique trimestriel et ligne de support prioritaire VIP',
        },
      ],
    },
    en: {
      hero: {
        badge: 'The Complete Commercial System',
        title: 'The business that answers first wins the customer.',
        subtitle: 'A high-conversion website, verified Canadian local Google visibility, and 24/7 AI agents that qualify customer inquiries by SMS and hand ready buyers to your team.',
        ctaText: 'Reserve Your Plan',
      },
      problemInsight: {
        tag: 'Speed to Lead',
        title: 'Responding within an hour makes qualifying a lead nearly 7x more likely.',
        statCallout: 'Harvard Business Review (2011) verified that businesses responding to customer queries within an hour are nearly 7 times more likely to qualify the buyer than those waiting even one hour longer.',
        description: 'Most Canadian businesses lose valuable buyers simply because inquiries arrive after hours, on weekends, or during peak work hours. Oryn responds in seconds, collects requirements, and keeps prospective buyers engaged.',
        hoursComparison: '168 hours of active coverage every week versus roughly 44 hours for a single employee.',
      },
      system: {
        sectionTitle: 'The Three-Part System',
        sectionSubtitle: 'Oryn Presence is delivered as a unified commercial infrastructure: website, Canadian Google search positioning, and AI messaging agents operating together.',
        parts: [
          {
            step: '01',
            title: 'High-Converting Website',
            description: 'Fast modern architecture tailored to Canadian buyers, converting website visits into qualified customer inquiries.',
          },
          {
            step: '02',
            title: 'Google Visibility & SEO',
            description: 'Google Business Profile setup, local citations, bilingual readiness, on-page SEO, and GA4 tracking.',
          },
          {
            step: '03',
            title: 'AI Agents on Web and SMS',
            description: 'Intelligent agents answering website chat and your dedicated SMS business line 24/7, qualifying needs, and routing warm buyers to your staff.',
          },
        ],
      },
      founderNote: {
        name: 'Gamal',
        title: 'Founder and Lead Engineer, Purple Cove Labs',
        text: 'Every Oryn Presence system is personally engineered and deployed by Gamal at Purple Cove Labs. We do not sell standalone chat widgets or disjointed sites. We build an integrated commercial acquisition engine designed to transform local search visits into booked clients.',
      },
      guarantee: {
        title: 'Client Capacity and Exclusive Partner Bonuses',
        hasDeliveryGuarantee: false,
        capacityLimit: 'Capacity is strictly capped at 4 new client onboardings per month. Gamal builds every project personally, with one build start per week.',
        bonuses: [
          {
            title: 'Bonus 1: Google Launch Checklist',
            description: 'A client-facing checklist covering every technical step executed across your Google profile, on-page SEO, and Search Console setup.',
          },
          {
            title: 'Bonus 2: SMS Quick-Reply Playbook',
            description: 'High-converting messaging templates for your team to communicate rapidly and close qualified leads alongside the agent.',
          },
        ],
      },
      faq: [
        {
          question: 'Why is Oryn Presence sold exclusively as a complete system?',
          answer: 'An AI assistant without high-intent web traffic has no buyers to qualify. A website without instant response loses customers to faster competitors. By unifying conversion design, Canadian Google visibility, and 24/7 SMS qualification, your business captures every opportunity.',
        },
        {
          question: 'How do the agents interact with our prospective clients?',
          answer: 'The same agent operates across your website chat and your business SMS line. It greets visitors immediately, answers FAQs, asks 3 to 5 qualifying questions, and hands qualified buyer notes straight to your team by text message.',
        },
        {
          question: 'Does the AI agent replace our current staff?',
          answer: 'Never. The agent supports your staff during nights, weekends, and high-volume moments when fast response determines who wins the customer. It filters tire-kickers so your team only spends time with qualified, serious buyers.',
        },
        {
          question: 'How does the SMS channel function in Canada?',
          answer: 'The agent texts from a verified Canadian business number configured for your company, fully compliant with Canadian carrier guidelines and CASL requirements. Your team can view conversations and take over anytime.',
        },
        {
          question: 'What are the ongoing monthly maintenance terms and overages?',
          answer: 'Monthly retainers begin the month after go-live. They cover fast cloud hosting, ongoing Google optimization, AI inference, and included monthly conversations. Extra conversations are billed at CA$1.05 (Presence), CA$0.90 (Conversion), and CA$0.90 (Authority).',
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
          '1 targeted SEO blog article per month and Canadian local citation building',
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
          'Weekly Google Business Profile posts and customer review campaign',
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
          conversion: 'Everything in Presence, plus Canadian local citations and 1 targeted SEO blog article per month',
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
          presence: '150 conversations per month included. Extra conversation: CA$1.05',
          conversion: '300 conversations per month included. Extra conversation: CA$0.90',
          authority: '600 conversations per month included. Extra conversation: CA$0.90',
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
