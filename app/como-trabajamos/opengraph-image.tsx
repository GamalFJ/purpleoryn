import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Cómo trabajamos | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Cómo trabajamos",
    subtitle: "Siete pasos, sin sorpresas. Del diagnóstico gratis a la salida en vivo de tu sistema.",
  });
}
