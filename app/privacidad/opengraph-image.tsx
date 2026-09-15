import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Política de privacidad | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Política de privacidad",
    subtitle: "Qué datos recopilamos, para qué los usamos y cómo pedir su eliminación.",
  });
}
