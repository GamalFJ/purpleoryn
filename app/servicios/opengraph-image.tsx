import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Planes y precios | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Planes y precios",
    subtitle: "Presencia, Conversión y Autoridad. Compara, calcula tu retorno y elige tu plan.",
  });
}
