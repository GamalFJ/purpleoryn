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
import { ProcesoTeaser } from "@/components/proceso/ProcesoTeaser";
import { getAddons, getPortfolio, getSiteSettings, getTiers } from "@/lib/content";
import { getCurrentMarket } from "@/lib/market";
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
  const [settings, tiers, addons, portfolio, currentMarket] = await Promise.all([
    getSiteSettings(),
    getTiers(),
    getAddons(),
    getPortfolio(2),
    getCurrentMarket(),
  ]);

  // Hero headline/subheadline are market-scoped (market_content); everything
  // else on SiteSettings (images, about bio) stays global for now. Falls
  // back to the existing site_settings-driven copy if a market has no
  // market_content rows yet.
  const heroSettings = {
    ...settings,
    heroHeadline: currentMarket.content.hero_headline || settings.heroHeadline,
    heroSubheadline: currentMarket.content.hero_subheadline || settings.heroSubheadline,
  };

  return (
    <>
      <Header />
      <main id="contenido">
        <Hero settings={heroSettings} />
        {/* Presentación → Dolor → Solución → proceso → planes → prueba → CTA */}
        <Pain />
        <Solution />
        <ProcesoTeaser />
        <TierStairs tiers={tiers} addons={addons} />
        <Stats />
        <PortfolioPreview items={portfolio} />
        <About settings={settings} marketId={currentMarket.market?.id ?? "do"} />
        <Faq />
        <ClosingCta location="home_closing" />
      </main>
      <Footer />
    </>
  );
}
