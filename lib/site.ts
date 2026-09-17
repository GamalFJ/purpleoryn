// Business identity. NAP (name, phone) and category must match the Google
// Business Profile exactly — it is set up as a Service-Area Business, so no
// street address is published anywhere on the site.
export const SITE = {
  name: "Purple Cove Labs",
  url: "https://www.purpleoryn.com",
  gbpCategory: "Website Designer",
  phoneDisplay: "+1 809-603-4113",
  phoneE164: "+18096034113",
  email: "gamal.jastram@purpleoryn.com",
  founder: "Gamal Jastram",
  serviceAreas: ["Santo Domingo", "Santo Domingo Este", "Santo Domingo Oeste"],
  locale: "es_DO",
  instagram: "https://www.instagram.com/purplecovelabs.ai/",
  instagramHandle: "@purplecovelabs.ai",
} as const;

export const CAL_URL = "https://cal.com/purple-cove-labs/20-min-cafe-virtual";

// Link to paste into the Google Business Profile "website" field so GA4 can
// attribute Business Profile traffic. Canonical tags ignore the query string.
export const GBP_WEBSITE_URL = `${SITE.url}/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing`;

export const NAV_LINKS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/#preguntas", label: "Preguntas" },
] as const;

// One label per intent, used identically everywhere on the site.
export const CTA = {
  plan: "Elige tu plan",
  call: "Agenda una llamada gratis",
  whatsapp: "Escríbenos por WhatsApp",
} as const;
