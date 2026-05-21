import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";

type NicheKey = "contable" | "dental" | "veterinaria" | "construccion";

interface Niche {
  key: NicheKey;
  label: string;
  subtitle: string;
  emoji: string;
  url: string;
  og?: {
    title: string;
    description: string;
    image: string;
  };
}

const niches: Niche[] = [
  {
    key: "contable",
    label: "Contabilidad",
    subtitle: "Asesores Contables del Caribe",
    emoji: "📊",
    url: "https://demos.purpleoryn.com/contable",
    og: {
      title: "Demo Contabilidad — Asesores Contables del Caribe",
      description:
        "Sistema contable y tributario para empresas dominicanas. Demo en vivo por Purple Cove Labs.",
      image:
        "https://demos.purpleoryn.com/brand/og-image (Asesores del Caribe).png",
    },
  },
  {
    key: "dental",
    label: "Dental",
    subtitle: "Clínica Dental",
    emoji: "🦷",
    url: "https://demos.purpleoryn.com/dental",
  },
  {
    key: "veterinaria",
    label: "Veterinaria",
    subtitle: "Clínica Veterinaria",
    emoji: "🐾",
    url: "https://demos.purpleoryn.com/veterinaria",
  },
  {
    key: "construccion",
    label: "Construcción",
    subtitle: "Empresa Constructora",
    emoji: "🏗️",
    url: "https://demos.purpleoryn.com/construccion",
  },
];

const DEFAULT_TITLE = "Biblioteca de Demos — Purple Cove Labs";
const DEFAULT_DESCRIPTION = "Demos en vivo para negocios dominicanos.";

const Demos = () => {
  const [activeNiche, setActiveNiche] = useState<NicheKey | null>(null);

  const active = niches.find((n) => n.key === activeNiche) ?? null;

  const helmetTitle = active?.og?.title ?? DEFAULT_TITLE;
  const helmetDescription = active?.og?.description ?? DEFAULT_DESCRIPTION;
  const helmetImage = active?.og?.image;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta property="og:title" content={helmetTitle} />
        <meta property="og:description" content={helmetDescription} />
        <meta property="og:url" content="https://purpleoryn.com/demos" />
        {helmetImage ? (
          <meta property="og:image" content={helmetImage} />
        ) : null}
      </Helmet>

      <Header />

      <main className="relative z-10 pt-24 sm:pt-28">
        {/* Hero */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              Biblioteca de Demos
            </div>
            <h1 className="font-extrabold mb-4">
              Ve el sistema{" "}
              <span className="gradient-text">funcionando</span> en tu
              industria.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Demos en vivo para negocios dominicanos — selecciona tu nicho y
              explora el sistema completo.
            </p>
          </div>
        </section>

        {/* Niche cards */}
        <section className="py-6 sm:py-8 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {niches.map((n) => (
                <button
                  key={n.key}
                  onClick={() =>
                    setActiveNiche(activeNiche === n.key ? null : n.key)
                  }
                  className={`glass-card p-5 sm:p-6 flex flex-col items-center text-center gap-3 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                    activeNiche === n.key
                      ? "border-primary/70 bg-primary/10 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.35)]"
                      : "hover:border-primary/40"
                  }`}
                >
                  <span className="text-3xl">{n.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {n.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {n.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Ver biblioteca completa — position A (below cards, always visible) */}
            <div className="mt-6 flex justify-center">
              <a
                href="https://demos.purpleoryn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                Ver biblioteca completa
              </a>
            </div>
          </div>
        </section>

        {/* Iframe section */}
        {active && (
          <section className="py-4 sm:py-6 px-4 sm:px-6 pb-10 sm:pb-14">
            <div className="container mx-auto max-w-6xl">
              {/* Iframe header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-glass-bg/60 border border-border/40 border-b-0 backdrop-blur-md">
                <span className="text-sm font-semibold text-foreground">
                  {active.emoji} {active.label} — {active.subtitle}
                </span>
                {/* Position B: open active demo in new tab */}
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Abrir demo completo ↗
                </a>
              </div>

              <div className="rounded-b-xl overflow-hidden border border-border/40 border-t-0">
                <iframe
                  key={active.key}
                  src={active.url}
                  title={`Demo ${active.label} — ${active.subtitle}`}
                  className="w-full h-[600px] sm:h-[750px] lg:h-[900px]"
                  loading="lazy"
                  allow="fullscreen"
                />
              </div>
            </div>
          </section>
        )}

        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Demos;
