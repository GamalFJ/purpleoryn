import type { Metadata } from "next";
import PlanesClient from "./PlanesClient";

export const metadata: Metadata = {
  title: "Planes de Soporte Mensual — Purple Cove Labs",
  description: "Planes de soporte y mantenimiento continuo para tu sistema: Básico (RD$ 5,000), Estándar (RD$ 9,000) y AI Partner (RD$ 15,000). Cancelables en cualquier momento.",
  alternates: { canonical: "/planes" },
  openGraph: {
    title: "Planes de Soporte Mensual — Purple Cove Labs",
    description: "Planes de soporte y mantenimiento continuo para tu sistema digital. Básico, Estándar y AI Partner — cancelables en cualquier momento.",
    url: "https://purpleoryn.com/planes",
  },
};

export default function Planes() {
  return <PlanesClient />;
}
