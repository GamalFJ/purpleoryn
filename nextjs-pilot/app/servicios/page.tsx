import type { Metadata } from "next";
import ServiciosClient from "./ServiciosClient";

export const metadata: Metadata = {
  title: "Servicios — Purple Cove Labs",
  description:
    "Sitios web, apps a medida, automatización e inteligencia artificial para negocios dominicanos. Conoce lo que construimos antes de armar tu cotización.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios — Purple Cove Labs",
    description:
      "Sitios web, apps a medida, automatización e inteligencia artificial para negocios dominicanos. Conoce lo que construimos antes de armar tu cotización.",
    url: "https://purpleoryn.com/servicios",
  },
};

export default function Servicios() {
  return <ServiciosClient />;
}
