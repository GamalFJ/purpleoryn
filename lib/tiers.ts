// Tier data shape + the launch content. Once Supabase is connected the admin
// panel owns this data (table `tiers`); DEFAULT_TIERS is only the seed and the
// fallback when the database is unreachable.
export type TierSlug = "presencia" | "conversion" | "autoridad";

export interface Tier {
  slug: TierSlug;
  name: string;
  oneTime: number;
  monthly: number;
  website: string;
  seo: string;
  gbp: string;
  analytics: string;
  aiAgent: string;
  conversationCap: string;
  support: string;
  // Condensed home-page preview, editable in the admin panel.
  tagline: string;
  highlights: string[];
}

export const TIER_ROWS: { key: keyof Omit<Tier, "slug" | "name" | "oneTime" | "monthly" | "tagline" | "highlights">; label: string }[] = [
  { key: "website", label: "Sitio web" },
  { key: "seo", label: "SEO" },
  { key: "gbp", label: "Google Business Profile" },
  { key: "analytics", label: "Analítica" },
  { key: "aiAgent", label: "Agente de IA" },
  { key: "conversationCap", label: "Conversaciones del agente" },
  { key: "support", label: "Soporte" },
];

export const DEFAULT_TIERS: Tier[] = [
  {
    slug: "presencia",
    name: "Presencia",
    oneTime: 15499.99,
    monthly: 1499.99,
    website: "Sitio de una página enfocado en conversión: portada, servicios, sellos de confianza, testimonios y botón de WhatsApp",
    seo: "SEO on-page básico: meta etiquetas, datos estructurados (schema), sitemap y velocidad",
    gbp: "Configuración completa: categorías, horario, fotos y publicaciones iniciales",
    analytics: "GA4 y Search Console con seguimiento básico de conversiones",
    aiAgent: "Smart Qualifier: responde preguntas frecuentes, hace de 3 a 5 preguntas de calificación y pasa el cliente a WhatsApp con la información organizada",
    conversationCap: "300 al mes",
    support: "Correo y WhatsApp, atención estándar",
    tagline: "Para aparecer en Google y empezar a recibir clientes por WhatsApp.",
    highlights: ["Sitio de una página", "Google Business Profile configurado", "GA4 y Search Console", "Agente que califica y pasa a WhatsApp"],
  },
  {
    slug: "conversion",
    name: "Conversión",
    oneTime: 21999.99,
    monthly: 1999.99,
    website: "Sitio de varias páginas: agrega páginas por servicio y una página de reservas o catálogo",
    seo: "Todo lo de Presencia, más citaciones locales, datos estructurados para resultados enriquecidos y 1 artículo de blog al mes",
    gbp: "Todo lo de Presencia, más publicaciones mensuales en Google y respuestas a reseñas asistidas por IA",
    analytics: "Todo lo de Presencia, más reporte mensual de rendimiento",
    aiAgent: "Todo lo de Presencia, más puntuación de prospectos, seguimiento automático a las 24 horas y vista simple del pipeline",
    conversationCap: "800 al mes",
    support: "Todo lo de Presencia, más reunión de seguimiento mensual",
    tagline: "Para convertir más visitas con páginas por servicio y seguimiento automático.",
    highlights: ["Sitio de varias páginas con reservas o catálogo", "1 artículo de blog al mes", "Reporte mensual de rendimiento", "Seguimiento automático a las 24 horas"],
  },
  {
    slug: "autoridad",
    name: "Autoridad",
    oneTime: 28999.99,
    monthly: 2999.99,
    website: "Todo lo de Conversión, más optimización continua de conversión con pruebas A/B",
    seo: "Todo lo de Conversión, más monitoreo de competidores, calendario de contenido completo e indexación prioritaria",
    gbp: "Todo lo de Conversión, más campaña para generar reseñas y publicaciones semanales",
    analytics: "Todo lo de Conversión, más recomendaciones en el reporte mensual y llamada trimestral",
    aiAgent: "Agente de IA completo: agenda citas en Google Calendar, toma pedidos y panel real de prospectos (CRM ligero)",
    conversationCap: "2,000 al mes (límite flexible)",
    support: "Llamada trimestral y canal prioritario",
    tagline: "Para crecer con contenido constante y un agente que agenda y toma pedidos.",
    highlights: ["Pruebas A/B continuas", "Campaña de reseñas y publicaciones semanales", "Agente que agenda en Google Calendar", "Panel de prospectos (CRM ligero)"],
  },
];

export function isTierSlug(value: unknown): value is TierSlug {
  return value === "presencia" || value === "conversion" || value === "autoridad";
}
