import type { Metadata } from "next";
import PortafolioClient from "./PortafolioClient";

export const metadata: Metadata = {
  title: "Portafolio — Purple Cove Labs",
  description:
    "Casos de éxito reales: sitios web, automatizaciones e IA implementados para negocios en la República Dominicana. Ve el sistema, el problema que resolvimos y los resultados medibles.",
  alternates: { canonical: "/portafolio" },
  openGraph: {
    title: "Portafolio — Purple Cove Labs",
    description: "Casos de éxito reales: sitios web, automatizaciones e IA implementados para negocios dominicanos.",
    url: "https://purpleoryn.com/portafolio",
  },
};

export default function Portafolio() {
  return <PortafolioClient />;
}
