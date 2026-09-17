import { ClosingCta } from "@/components/layout/ClosingCta";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd, offerCatalogSchema } from "@/components/seo/JsonLd";
import { AddonSection } from "@/components/servicios/AddonSection";
import { LeadForm } from "@/components/servicios/LeadForm";
import { PlanSelectionProvider } from "@/components/servicios/PlanSelection";
import { RoiCalculator } from "@/components/servicios/RoiCalculator";
import { TierComparison } from "@/components/servicios/TierComparison";
import { getAddons, getTiers } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Planes y precios",
  description:
    "Compara los planes Presencia, Conversión y Autoridad: sitio web, SEO local, Google Business Profile, analítica y agente de IA. Calcula tu retorno y elige tu plan.",
  path: "/servicios",
});

export default async function ServiciosPage() {
  const [tiers, addons] = await Promise.all([getTiers(), getAddons()]);

  return (
    <>
      <Header />
      <main id="contenido">
        <PlanSelectionProvider>
          <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
            <h1 className="text-gradient-brand pb-[0.1em] text-[2.35rem] font-semibold leading-[1.06] sm:text-5xl">Planes y precios</h1>
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-body">
              Cada plan tiene un pago único y una mensualidad, y cada uno incluye todo lo del anterior. Precios en pesos dominicanos.
            </p>
          </div>
          <TierComparison tiers={tiers} />
          <AddonSection addons={addons} />
          <RoiCalculator tiers={tiers} />
          <LeadForm tiers={tiers} />
        </PlanSelectionProvider>
        <ClosingCta location="servicios_closing" />
      </main>
      <Footer />
      <JsonLd data={offerCatalogSchema(tiers, addons)} />
    </>
  );
}
