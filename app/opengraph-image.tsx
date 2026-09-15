import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Cove Labs | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Sitios web, SEO y agentes de IA en Santo Domingo",
    subtitle: "Tres planes con precio publicado para aparecer en Google y recibir clientes por WhatsApp.",
  });
}
