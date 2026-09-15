import { ClosingCta } from "@/components/layout/ClosingCta";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PortfolioEmpty, PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getPortfolio } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Portafolio",
  description: "Proyectos de sitios web, SEO local y agentes de IA de Purple Cove Labs para negocios en Santo Domingo.",
  path: "/portafolio",
});

export default async function PortafolioPage() {
  const items = await getPortfolio();

  return (
    <>
      <Header />
      <main id="contenido">
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
          <h1 className="text-[2.35rem] font-semibold leading-[1.06] sm:text-5xl">Portafolio</h1>
          <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-muted">
            Proyectos publicados con el permiso de cada cliente y con resultados verificables.
          </p>
          <div className="mt-12">{items.length > 0 ? <PortfolioGrid items={items} /> : <PortfolioEmpty headingLevel="h2" />}</div>
        </div>
        <ClosingCta location="portafolio_closing" />
      </main>
      <Footer />
    </>
  );
}
