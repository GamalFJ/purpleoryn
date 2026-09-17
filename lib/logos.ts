// Brand logos in public/media/logos. Sources: svgl (WhatsApp, Google Maps,
// Google Calendar, Google Analytics, Claude, Instagram), gilbarbara/logos
// (Google Tag Manager, Google Search Console, ElevenLabs), and the vendors'
// own sites for Retell AI and Vapi (not in any of the three libraries).
// `mono`: single dark color, so it is inverted in dark mode to stay visible.
export const LOGOS = {
  whatsapp: { name: "WhatsApp", src: "/media/logos/whatsapp.svg" },
  googleMaps: { name: "Google Maps", src: "/media/logos/google-maps.svg" },
  googleCalendar: { name: "Google Calendar", src: "/media/logos/google-calendar.svg" },
  googleAnalytics: { name: "Google Analytics", src: "/media/logos/google-analytics.svg" },
  googleTagManager: { name: "Google Tag Manager", src: "/media/logos/google-tag-manager.svg" },
  googleSearchConsole: { name: "Google Search Console", src: "/media/logos/google-search-console.svg" },
  claude: { name: "Claude", src: "/media/logos/claude.svg" },
  retell: { name: "Retell AI", src: "/media/logos/retell.svg", mono: true },
  vapi: { name: "Vapi", src: "/media/logos/vapi.svg" },
  elevenlabs: { name: "ElevenLabs", src: "/media/logos/elevenlabs.svg", mono: true },
  instagram: { name: "Instagram", src: "/media/logos/instagram.svg" },
} satisfies Record<string, { name: string; src: string; mono?: boolean }>;

export type LogoKey = keyof typeof LOGOS;
