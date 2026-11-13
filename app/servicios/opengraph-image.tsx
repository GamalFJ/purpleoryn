import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Planes y alcance | Purple Cove Labs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Planes y alcance",
    subtitle: "Presencia, Conversión y Autoridad. Conozca el alcance y agende una asesoría para evaluar si su negocio califica.",
  });
}
