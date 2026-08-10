import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Purple Cove Labs",
    short_name: "Purple Cove Labs",
    description: "Sistemas que automatizan tu negocio y aumentan tus ingresos — sitios web, automatizaciones, agentes de IA y apps a medida.",
    start_url: "/",
    display: "standalone",
    background_color: "#140A1F",
    theme_color: "#7C3AED",
    icons: [
      { src: "/logo.png", sizes: "1024x1024", type: "image/png" },
    ],
  };
}
