import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Portafolio | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Portafolio",
    subtitle: "Proyectos de sitios web, SEO local y agentes de IA para negocios en Santo Domingo.",
  });
}
