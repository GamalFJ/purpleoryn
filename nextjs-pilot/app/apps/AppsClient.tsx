"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import { ArrowRight, ExternalLink, Search, Users, TrendingUp, ShoppingBag, Smartphone, MessageCircle, Globe, Link2, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const productMeta = [
  {
    key: "un-taco-mas",
    badgeClass: "bg-success-green/15 text-success-green border-success-green/30",
    image: "/apps/un-taco-mas.png",
    icons: [ShoppingBag, MessageCircle, Smartphone],
    cta: { href: "https://un-taco-mas.vercel.app", external: true },
  },
  {
    key: "pagina-de-captura",
    badgeClass: "bg-price-yellow/15 text-price-yellow border-price-yellow/30",
    image: "/demo-dental.png.jpeg",
    icons: [Globe, Link2, Zap],
    cta: { href: "/#presencia-digital-express", external: false },
  },
  {
    key: "prospect-dashboard",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    image: "/apps/prospect-dashboard-logo.png",
    icons: [Search, Users, TrendingUp],
    cta: { href: "https://wa.me/18096034113", external: true },
  },
];

interface Feature {
  title: string;
  desc: string;
}

interface Product {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  ctaLabel: string;
}

const AppsClient = () => {
  const { t, raw } = useLanguage();
  const products = raw("apps.products") as Product[];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              {t("apps.badge")}
            </div>
            <h1 className="font-extrabold mb-4">
              {t("apps.titlePart1")} <span className="gradient-text">{t("apps.titleHighlight")}</span>
              {t("apps.titlePart2")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{t("apps.subtitle")}</p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl space-y-6 sm:space-y-8">
            {products.map((p, i) => {
              const meta = productMeta[i];
              return (
                <div
                  key={meta.key}
                  className="glass-card p-4 sm:p-8 lg:p-10 relative overflow-hidden hover:border-primary/40 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
                    <div className="lg:w-64 shrink-0">
                      <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden border border-border/40 bg-glass-bg/40">
                        <Image src={meta.image} alt={p.title} fill className="object-cover" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border whitespace-nowrap ${meta.badgeClass}`}>
                          {p.badge}
                        </span>
                      </div>
                      <h2 className="font-extrabold text-lg sm:text-xl text-foreground break-words mt-2">{p.title}</h2>
                      <div className="text-xs text-muted-foreground mb-4">{p.subtitle}</div>

                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6">{p.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {p.features.map((f, fi) => {
                          const Icon = meta.icons[fi];
                          return (
                            <div key={f.title} className="flex items-start gap-2.5 min-w-0">
                              <div className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Icon className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-foreground mb-0.5 leading-snug">{f.title}</div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {meta.cta.external ? (
                        <a
                          href={meta.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300"
                        >
                          {p.ctaLabel}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <Link
                          href={meta.cta.href}
                          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300"
                        >
                          {p.ctaLabel}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default AppsClient;
