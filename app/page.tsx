import { About } from "@/components/home/About";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Pain } from "@/components/home/Pain";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { Solution } from "@/components/home/Solution";
import { Stats } from "@/components/home/Stats";
import { TierStairs } from "@/components/home/TierStairs";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAddons, getPortfolio, getSiteSettings, getTiers } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// Admin edits call revalidatePath; this is the safety net.
export const revalidate = 300;

export const metadata = pageMetadata({
  // The root layout title template does not apply to its own segment.
  title: "Purple Cove Labs | Sitios web, SEO y agentes de IA en Santo Domingo",
  description:
    "Sitios web, SEO local, Google Business Profile y agentes de IA para negocios en Santo Domingo. Tres planes con precio publicado desde RD$15,499.99.",
  path: "/",
});

export default async function HomePage() {
  const [settings, tiers, addons, portfolio] = await Promise.all([getSiteSettings(), getTiers(), getAddons(), getPortfolio(2)]);

  return (
    <>
      <Header />
      <main id="contenido">
        <Hero settings={settings} />
        {/* Presentación → Dolor → Solución → planes → prueba → CTA */}
        <Pain />
        <Solution />
        <TierStairs tiers={tiers} addons={addons} />
        <Stats />
        <PortfolioPreview items={portfolio} />
        <About settings={settings} />
        <Faq />
        <ClosingCta location="home_closing" />
      </main>
      <Footer />
    </>
  );
}
