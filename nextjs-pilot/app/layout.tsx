import type { Metadata } from "next";
import { Sora, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://purpleoryn.com"),
  title: "Purple Cove Labs — Automatización e IA para Negocios",
  description:
    "Construimos sistemas que automatizan tu negocio y aumentan tus ingresos. Sitios web, automatizaciones, agentes de IA y apps a medida — República Dominicana.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://purpleoryn.com",
    title: "Purple Cove Labs — Automatización e IA para Negocios",
    description:
      "Construimos sistemas que automatizan tu negocio y aumentan tus ingresos. Sitios web, automatizaciones, agentes de IA y apps a medida.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PurpleCoveLabs",
    title: "Purple Cove Labs — Automatización e IA para Negocios",
    description:
      "Construimos sistemas que automatizan tu negocio y aumentan tus ingresos. Sitios web, automatizaciones, agentes de IA y apps a medida.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
