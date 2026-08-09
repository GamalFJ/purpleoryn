import type { Metadata } from "next";
import PlanesClient from "./PlanesClient";

export const metadata: Metadata = {
  title: "Planes de Soporte Mensual — Purple Cove Labs",
  description: "Planes de soporte y mantenimiento continuo para tu sistema: Básico (RD$ 10,675), Estándar (RD$ 18,000) y AI Partner (RD$ 35,000). Cancelables en cualquier momento.",
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
