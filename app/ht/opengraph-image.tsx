import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Cove Labs | Kwasans komèsyal, vizibilite Google ak ajan IA WhatsApp an Ayiti";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "L’entreprise qui répond la première remporte le client.",
    subtitle: "Site web haute performance, visibilité Google et agents d’IA sur WhatsApp 24h/24 pour entreprises en Haïti.",
    marketBadge: "🇭🇹 Marché Haïtien · Mache Ayisyen",
    domain: "ht.purpleoryn.com",
    features: "WhatsApp IA 24/7 · Google SEO · Vitesse Commerciale",
  });
}
