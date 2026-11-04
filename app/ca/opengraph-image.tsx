import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Cove Labs | Système commercial, visibilité Google et agents IA au Canada";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "L’entreprise qui répond la première remporte le client.",
    subtitle: "Développement web de conversion, visibilité Google locale et qualification par SMS 24h/24 pour entreprises canadiennes.",
    marketBadge: "🇨🇦 Marché Canadien (CAD)",
    domain: "ca.purpleoryn.com",
    features: "Bilingue Français & English · SMS IA 24/7 · SEO Local",
  });
}
