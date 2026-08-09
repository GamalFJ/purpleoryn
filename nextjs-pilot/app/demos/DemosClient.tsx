"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import { useLanguage } from "@/contexts/LanguageContext";

type NicheKey = "contable" | "dental" | "veterinaria" | "construccion";

const nicheMeta: Array<{ key: NicheKey; emoji: string; url: string }> = [
  { key: "contable", emoji: "📊", url: "https://demos.purpleoryn.com/contable" },
  { key: "dental", emoji: "🦷", url: "https://demos.purpleoryn.com/dental" },
  { key: "veterinaria", emoji: "🐾", url: "https://demos.purpleoryn.com/veterinaria" },
  { key: "construccion", emoji: "🏗️", url: "https://demos.purpleoryn.com/construccion" },
];

const DEFAULT_TITLE = "Biblioteca de Demos — Purple Cove Labs";

interface NicheContent {
  label: string;
  subtitle: string;
}

const DemosClient = () => {
  const { t, raw } = useLanguage();
  const niches = raw("demos.niches") as NicheContent[];
  const [activeNiche, setActiveNiche] = useState<NicheKey | null>(null);

  const activeMeta = nicheMeta.find((n) => n.key === activeNiche) ?? null;
  const activeIndex = nicheMeta.findIndex((n) => n.key === activeNiche);
  const activeContent = activeIndex >= 0 ? niches[activeIndex] : null;

  useEffect(() => {
    document.title = activeContent ? `${activeContent.label} — Purple Cove Labs` : DEFAULT_TITLE;
  }, [activeContent]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />

      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              {t("demos.badge")}
            </div>
            <h1 className="font-extrabold mb-4">
              {t("demos.titlePart1")} <span className="gradient-text">{t("demos.titleHighlight")}</span> {t("demos.titlePart2")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{t("demos.subtitle")}</p>
          </div>
        </section>

        <section className="py-6 sm:py-8 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nicheMeta.map((n, i) => (
                <button
                  key={n.key}
                  onClick={() => setActiveNiche(activeNiche === n.key ? null : n.key)}
                  className={`glass-card p-5 sm:p-6 flex flex-col items-center text-center gap-3 cursor-pointer ${
                    activeNiche === n.key
                      ? "border-primary/70 bg-primary/10 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.35)]"
                      : "hover:border-primary/40"
                  }`}
                >
                  <span className="text-3xl">{n.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground text-sm">{niches[i].label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{niches[i].subtitle}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href="https://demos.purpleoryn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-5 py-2.5 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                {t("demos.viewLibrary")}
              </a>
            </div>
          </div>
        </section>

        {activeMeta && activeContent && (
          <section className="py-4 sm:py-6 px-4 sm:px-6 pb-10 sm:pb-14">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-glass-bg/60 border border-border/40 border-b-0 backdrop-blur-md">
                <span className="text-sm font-semibold text-foreground">
                  {activeMeta.emoji} {activeContent.label} — {activeContent.subtitle}
                </span>
                <a
                  href={activeMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {t("demos.openFull")}
                </a>
              </div>

              <div className="rounded-b-xl overflow-hidden border border-border/40 border-t-0">
                <iframe
                  key={activeMeta.key}
                  src={activeMeta.url}
                  title={`Demo ${activeContent.label} — ${activeContent.subtitle}`}
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

export default DemosClient;
