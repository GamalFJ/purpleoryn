import 'server-only';
import type { MarketConfig } from './types';

export const config: MarketConfig = {
  id: 'ht',
  name: 'Haïti',
  host: 'ht.purpleoryn.com',
  defaultLocale: 'fr',
  supportedLocales: ['fr'],
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
      overageRate: '$0.90',
      year1Total: 3759.87,
    },
    conversion: {
      setup: 1599.99,
      monthly: 429.99,
      conversationsIncluded: 300,
      overageRate: '$0.80',
      year1Total: 6759.87,
    },
    authority: {
      setup: 1999.99,
      monthly: 649.99,
      conversationsIncluded: 600,
      overageRate: '$0.65',
      year1Total: 9799.87,
    },
    voiceAddon: {
      setup: 500.0,
      monthly: 299.99,
      includedUnits: 300,
      unitLabel: 'minutes',
      overageRate: '$1.25/min',
      channelNote: 'Prend en charge les appels WhatsApp entrants 24h/24 directement sur le numéro existant de votre entreprise avec une voix naturelle, répond aux questions et prend des rendez-vous.',
    },
  },
  content: {
    fr: {
      hero: {
        badge: 'Le Système Commercial Complet',
        title: 'L’entreprise qui répond la première remporte le client.',
        subtitle: 'Un site web conçu pour convertir, une visibilité Google optimisée et des agents d’IA qui répondent instantanément sur WhatsApp 24h/24 pour transmettre des acheteurs qualifiés à votre équipe.',
        ctaText: 'Réserver votre formule',
      },
      problemInsight: {
        tag: 'Vitesse de Réponse',
        title: 'Répondre dans l’heure multiplie par près de 7 vos chances de qualifier un prospect.',
        statCallout: 'Selon la Harvard Business Review (2011), une entreprise qui répond à une demande dans l’heure a près de 7 fois plus de chances de qualifier son prospect qu’en attendant ne serait-ce qu’une heure de plus.',
        description: 'La plupart des entreprises perdent des contrats simplement parce que les demandes arrivent le soir, la fin de semaine ou pendant que l’équipe est occupée. Oryn répond en quelques secondes, qualifie précisément les besoins et transmet des opportunités concrètes.',
        hoursComparison: '168 heures de disponibilité chaque semaine contre environ 44 heures pour un employé.',
      },
      system: {
        sectionTitle: 'Le système en trois volets',
        sectionSubtitle: 'Oryn Presence est toujours déployé comme un ensemble commercial complet: site web moderne, présence Google et agents WhatsApp fonctionnant en synergie.',
        parts: [
          {
            step: '01',
            title: 'Site web haute conversion',
            description: 'Architecture professionnelle ultra-rapide sur mobile, pensée pour transformer vos visiteurs en demandes commerciales sérieuses.',
          },
          {
            step: '02',
            title: 'Visibilité et référencement Google',
            description: 'Création et optimisation de votre fiche Google Business Profile, référencement on-page et suivi analytique avec GA4 et Search Console.',
          },
          {
            step: '03',
            title: 'Agents d’IA sur le site et WhatsApp',
            description: 'Des agents intelligents qui accueillent sur le site et sur WhatsApp, répondent instantanément, posent les questions de qualification et vous transmettent les dossiers prêts.',
          },
        ],
      },
      founderNote: {
        name: 'Gamal',
        title: 'Fondateur et ingénieur principal, Purple Cove Labs',
        text: 'Chaque projet Oryn Presence est personnellement conçu et déployé par Gamal chez Purple Cove Labs. Nous ne vendons pas de simples robots conversationnels ni de sites isolés. Nous mettons en place un système complet de captation et de conversion commerciale pour votre entreprise.',
      },
      guarantee: {
        title: 'Garantie de livraison 14 jours, places limitées et bonus exclusifs',
        hasDeliveryGuarantee: true,
        deliveryGuarantee: 'Garantie de livraison en 14 jours ouvrables: système opérationnel dans les 14 jours ouvrables suivant la réception du premier paiement et du formulaire de configuration complété, ou votre premier mois d’abonnement est offert.',
        capacityLimit: 'Capacité strictement limitée à 4 nouvelles entreprises par mois. Gamal réalise chaque projet personnellement, au rythme d’un lancement par semaine.',
        bonuses: [
          {
            title: 'Bonus 1: Liste de Lancement Google',
            description: 'Une liste de contrôle client détaillée pour suivre chaque action technique menée sur votre visibilité Google, votre référencement et Search Console.',
          },
          {
            title: 'Bonus 2: Guide de Réponses Rapides pour WhatsApp',
            description: 'Un guide pratique pour votre équipe afin de répondre avec rapidité et conclure les ventes aux côtés de l’agent.',
          },
        ],
      },
      faq: [
        {
          question: 'Pourquoi Oryn Presence est-il proposé uniquement comme un système complet?',
          answer: 'Un assistant virtuel sans trafic qualifié ne produit aucune vente. Un site web sans réponse immédiate perd ses prospects au profit d’un concurrent plus réactif. En combinant un site optimisé, la présence Google et la qualification 24h/24 sur WhatsApp, votre entreprise convertit chaque contact.',
        },
        {
          question: 'Comment fonctionnent les agents d’IA sur WhatsApp en Haïti?',
          answer: 'Les agents opèrent directement dans WhatsApp sur le numéro existant de votre entreprise (coexistence WhatsApp Business). Vos employés conservent l’accès complet aux échanges et peuvent prendre le relais à tout moment.',
        },
        {
          question: 'L’agent d’IA remplace-t-il nos collaborateurs?',
          answer: 'Absolument pas. L’agent vient épauler votre équipe la nuit, les fins de semaine et lors des premières minutes décisives. Il filtre les demandes secondaires pour que vos collaborateurs se concentrent uniquement sur les clients prêts à commander.',
        },
        {
          question: 'Comment s’applique la garantie de livraison de 14 jours ouvrables?',
          answer: 'Le délai de 14 jours ouvrables commence dès que nous disposons à la fois du premier paiement et du formulaire de configuration d’intégration complété. Si le système n’est pas livré dans ce délai, votre premier mois d’abonnement est gratuit.',
        },
        {
          question: 'Quelles sont les modalités de paiement pour Haïti?',
          answer: 'Les règlements s’effectuent en USD par MonCash ou par virement bancaire. 50% sont réglés à la confirmation de la commande et 50% à la livraison. Le module vocal est réglé à 100% à la commande.',
        },
        {
          question: 'Quelles sont les 7 étapes du déroulement du projet?',
          answer: 'Notre processus comprend 7 étapes claires: présentation courte ou lecture du document PDF, choix de la formule, confirmation de commande et réception du formulaire de configuration, acompte de 50%, phase de développement, livraison finale, puis facturation de l’abonnement mensuel à compter du mois suivant.',
        },
      ],
      paymentNote: 'Conditions de règlement: 50% à la confirmation de la commande, 50% à la livraison. Le module vocal est réglé à 100% à la commande. Modes de paiement acceptés: MonCash ou virement bancaire. L’envoi du formulaire réserve votre créneau d’intégration pour 7 jours civils.',
      cta: {
        type: 'whatsapp',
        label: 'Choisir votre formule',
        destination: '#order',
        note: 'La confirmation formelle de commande réserve votre créneau pour 7 jours civils.',
      },
      legal: {
        paymentNote: 'Formules réglées 50% à la confirmation et 50% à la livraison. Modules complémentaires réglés à 100% d’avance. Abonnement facturé mensuellement à partir du mois suivant la mise en service.',
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
          'Transmission instantanée des fiches prospects qualifiées sur WhatsApp',
          '150 conversations par mois incluses',
          'Assistance par courriel et WhatsApp en jours ouvrables',
        ],
        conversion: [
          'Tout ce qui est inclus dans Présence, plus:',
          'Site multi-pages avec pages par service et réservations ou catalogue',
          '1 article de blog SEO par mois et inscriptions locales',
          'Publications mensuelles Google Business et réponses aux avis par IA',
          'Rapport de performance mensuel et analyse des contacts',
          'Agent commercial: notation des prospects et relance automatique sous 24h sur WhatsApp',
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
          'Rencontre stratégique trimestrielle et canal d’assistance prioritaire VIP',
        ],
      },
      serviceRows: [
        {
          label: 'Architecture du site web',
          presence: 'Site d’une page axé sur la conversion: accueil, présentation des services, labels de confiance et déclencheur WhatsApp',
          conversion: 'Site multi-pages: pages détaillées par service et module de réservation ou catalogue',
          authority: 'Tout ce qui est inclus dans Conversion, plus optimisation continue du taux de conversion avec tests A/B actifs',
        },
        {
          label: 'Visibilité Google et référencement',
          presence: 'SEO on-page essentiel: balises méta, données structurées (schema), sitemap XML et optimisation de vitesse',
          conversion: 'Tout ce qui est inclus dans Présence, plus inscriptions locales et 1 article de blog SEO par mois',
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
          presence: 'Réceptionniste ("Smart Qualifier"): répond 24h/24, pose 3 à 5 questions de qualification et transmet la fiche sur WhatsApp',
          conversion: 'Agent commercial: notation des prospects, séquence de relance automatique sous 24h sur WhatsApp et vue pipeline',
          authority: 'Agent de réservation complet: prise de rendez-vous sur Google Calendar, prise de commande et aperçu CRM léger',
        },
        {
          label: 'Conversations mensuelles incluses',
          presence: '150 conversations par mois incluses. Conversation supplémentaire: $0.90',
          conversion: '300 conversations par mois incluses. Conversation supplémentaire: $0.80',
          authority: '600 conversations par mois incluses. Conversation supplémentaire: $0.65',
        },
        {
          label: 'Canal d’assistance',
          presence: 'Assistance par courriel et WhatsApp pendant les heures normales d’affaires',
          conversion: 'Tout ce qui est inclus dans Présence, plus rencontre de suivi mensuelle',
          authority: 'Appel de conseil stratégique trimestriel et canal d’assistance prioritaire VIP',
        },
      ],
    },
  },
};

export default config;
