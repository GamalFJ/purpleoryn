import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Cove Labs | Sitios web, SEO y agentes de IA en República Dominicana";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Sitios web, SEO y agentes de IA en Santo Domingo",
    subtitle: "Tres planes con precio publicado para aparecer en Google y recibir clientes por WhatsApp.",
    marketBadge: "🇩🇴 República Dominicana",
    domain: "www.purpleoryn.com",
    features: "WhatsApp AI 24/7 · SEO Local · Precios Transparentes",
  });
}
