import 'server-only';
import { DEFAULT_TIERS } from '@/lib/tiers';
import { DEFAULT_ADDONS } from '@/lib/addons';
import type { MarketConfig } from './types';

const presencia = DEFAULT_TIERS.find((t) => t.slug === 'presencia') ?? DEFAULT_TIERS[0];
const conversion = DEFAULT_TIERS.find((t) => t.slug === 'conversion') ?? DEFAULT_TIERS[1];
const autoridad = DEFAULT_TIERS.find((t) => t.slug === 'autoridad') ?? DEFAULT_TIERS[2];
const voiceAddon = DEFAULT_ADDONS.find((a) => a.slug === 'agente-de-voz') ?? DEFAULT_ADDONS[0];

export const config: MarketConfig = {
  id: 'dr',
  name: 'República Dominicana',
  host: 'purpleoryn.com',
  defaultLocale: 'es',
  supportedLocales: ['es'],
  currency: 'DOP',
  currencySymbol: 'RD$',
  primaryChannel: 'whatsapp',
  prices: {
    currency: 'DOP',
    currencySymbol: 'RD$',
    presence: {
      setup: presencia.oneTime,
      monthly: presencia.monthly,
      conversationsIncluded: presencia.conversationsIncluded,
      overageRate: presencia.conversationOverage,
    },
    conversion: {
      setup: conversion.oneTime,
      monthly: conversion.monthly,
      conversationsIncluded: conversion.conversationsIncluded,
      overageRate: conversion.conversationOverage,
    },
    authority: {
      setup: autoridad.oneTime,
      monthly: autoridad.monthly,
      conversationsIncluded: autoridad.conversationsIncluded,
      overageRate: autoridad.conversationOverage,
    },
    voiceAddon: {
      setup: voiceAddon.oneTime,
      monthly: voiceAddon.monthly,
      includedUnits: voiceAddon.includedUnits,
      unitLabel: voiceAddon.unitLabel,
      overageRate: voiceAddon.overageRate,
    },
  },
  content: {
    es: {
      hero: {
        badge: 'Sistema digital completo para empresas',
        title: 'Su negocio visible en Google y captando clientes por WhatsApp.',
        subtitle: 'Un sitio web de alta velocidad, posicionamiento local y un agente de inteligencia artificial que califica prospectos las 24 horas.',
        ctaText: 'Solicitar propuesta',
      },
      system: {
        sectionTitle: 'El sistema de tres partes',
        sectionSubtitle: 'Un ecosistema integrado, diseñado para transformar visitantes en clientes reales.',
        parts: [
          {
            step: '01',
            title: 'Sitio web de alta velocidad',
            description: 'Estructura enfocada en conversión, optimizada para celulares y con carga instantánea.',
          },
          {
            step: '02',
            title: 'Google y posicionamiento local',
            description: 'Perfil de empresa verificado, optimización local y estructura técnica para búsquedas clave.',
          },
          {
            step: '03',
            title: 'Agente de IA y WhatsApp',
            description: 'Atención 24/7 que califica las consultas de sus clientes y las entrega organizadas en WhatsApp.',
          },
        ],
        demoNotice: 'Vea el sistema en funcionamiento con nuestro demostrador en vivo.',
        demoLinkText: 'Probar demostración en vivo',
      },
      guarantee: {
        title: 'Garantía, cupos y bonos',
        deliveryGuarantee: 'Garantía de entrega en 7 días laborables: si no entregamos a tiempo, su primer mes de mantenimiento es gratis.',
        capacityLimit: 'Límite de capacidad: máximo 4 nuevos clientes por mes para mantener un estándar estricto de calidad.',
        bonuses: [
          {
            title: 'Bono 1: Lista de verificación para lanzamiento en Google',
            description: 'Paso a paso para maximizar la visibilidad y reputación de su perfil de empresa desde el primer día.',
          },
          {
            title: 'Bono 2: Guía de respuestas rápidas para WhatsApp',
            description: 'Plantillas y protocolos comerciales para cerrar más ventas con los prospectos que califica el agente.',
          },
        ],
      },
      faq: [
        {
          question: '¿Qué incluye la implementación completa?',
          answer: 'Incluye el desarrollo del sitio web, configuración técnica de Google Business Profile, GA4, Search Console y el agente conversacional configurado con los datos de su negocio.',
        },
        {
          question: '¿Cómo funciona la garantía de 7 días laborables?',
          answer: 'El conteo inicia una vez recibida la información requerida de su empresa. Si no entregamos en 7 días hábiles, su primer mes de servicio es totalmente gratuito.',
        },
        {
          question: '¿Cómo se maneja el soporte y mantenimiento?',
          answer: 'Monitoreamos la infraestructura de forma continua. Puede solicitar ajustes y soporte directo por correo y WhatsApp.',
        },
      ],
      paymentNote: 'Aceptamos transferencias bancarias locales (Banco BHD, Banco Popular, Banreservas) y tarjetas de crédito vía pasarela segura.',
      cta: {
        type: 'whatsapp',
        label: 'Conversar por WhatsApp',
        destination: 'https://wa.me/18293417129',
        note: 'Respuesta promedio en horario laboral: menos de 15 minutos.',
      },
      legal: {
        paymentNote: 'Planes: 50% al inicio y 50% contra entrega. Módulos adicionales se pagan 100% por adelantado.',
        footerText: '© Purple Cove Labs. Todos los derechos reservados.',
      },
    },
  },
};

export default config;
