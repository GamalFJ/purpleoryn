import type { Metadata } from "next";
import DemosClient from "./DemosClient";

const DEFAULT_TITLE = "Biblioteca de Demos — Purple Cove Labs";
const DEFAULT_DESCRIPTION =
  "Demos en vivo de sitios web y sistemas de automatización para negocios dominicanos. Explora ejemplos reales por industria: dental, contabilidad, veterinaria, construcción y más.";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/demos" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "https://purpleoryn.com/demos",
  },
};

export default function Demos() {
  return <DemosClient />;
}
