import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ChatLauncher } from "@/components/agent/ChatLauncher";
import { AttributionCapture } from "@/components/analytics/Attribution";
import { GoogleTagManagerNoScript, GoogleTagManagerScript } from "@/components/analytics/GoogleTagManager";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd, businessSchema, websiteSchema } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const searchConsoleToken = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Purple Cove Labs | Sitios web, SEO y agentes de IA en Santo Domingo",
    template: "%s | Purple Cove Labs",
  },
  description:
    "Sitios web, SEO local, Google Business Profile y agentes de IA para negocios en Santo Domingo. Tres planes con precio publicado.",
  applicationName: SITE.name,
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name },
  twitter: { card: "summary_large_image" },
  verification: searchConsoleToken ? { google: searchConsoleToken } : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4fa" },
    { media: "(prefers-color-scheme: dark)", color: "#140a1f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO" className={`${bricolage.variable} ${geist.variable}`}>
      <head>
        <GoogleTagManagerScript />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-[100dvh]">
        <GoogleTagManagerNoScript />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Saltar al contenido
        </a>
        <MotionProvider>{children}</MotionProvider>
        <AttributionCapture />
        <ChatLauncher />
        <JsonLd data={businessSchema()} />
        <JsonLd data={websiteSchema()} />
        <Analytics />
      </body>
    </html>
  );
}
