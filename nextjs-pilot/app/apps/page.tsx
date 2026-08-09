import type { Metadata } from "next";
import AppsClient from "./AppsClient";

export const metadata: Metadata = {
  title: "Productos & Apps — Purple Cove Labs",
  description: "Software real que hemos construido: una app de pedidos en producción, un sistema de páginas de captura y las herramientas internas que usamos para operar.",
  alternates: { canonical: "/apps" },
  openGraph: {
    title: "Productos & Apps — Purple Cove Labs",
    description: "Software real que hemos construido: una app de pedidos en producción, un sistema de páginas de captura y las herramientas internas que usamos para operar.",
    url: "https://purpleoryn.com/apps",
  },
};

export default function Apps() {
  return <AppsClient />;
}
