"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Zap, Layers, Globe, Repeat, ShoppingCart, Calendar, MessageCircle, Bot, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryMeta = [
  { icons: [Zap, Layers, Globe] },
  { icons: [Repeat, ShoppingCart, Calendar] },
  { icons: [MessageCircle, Bot] },
];

interface Service {
  title: string;
  price: string;
  desc: string;
  badge: string;
}

interface Category {
  title: string;
  desc: string;
  services: Service[];
}

const ServiciosClient = () => {
  const { t, raw } = useLanguage();
  const categories = raw("servicios.categories") as Category[];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              {t("servicios.badge")}
            </div>
            <h1 className="font-extrabold mb-4">
              {t("servicios.titlePart1")} <span className="gradient-text">{t("servicios.titleHighlight")}</span> {t("servicios.titlePart2")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{t("servicios.subtitle")}</p>
          </div>
        </section>

        <section className="pb-8 sm:pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl space-y-12 sm:space-y-16">
            {categories.map((cat, ci) => {
              const icons = categoryMeta[ci].icons;
              return (
                <div key={cat.title}>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="font-bold text-foreground text-xl sm:text-2xl mb-1.5">{cat.title}</h2>
                    <p className="text-sm text-muted-foreground">{cat.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {cat.services.map((s, si) => {
                      const Icon = icons[si];
                      return (
                        <div
                          key={s.title}
                          className="glass-card p-5 sm:p-6 flex flex-col hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            {s.badge && (
                              <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-price-yellow/15 text-price-yellow border border-price-yellow/30 whitespace-nowrap">
                                {s.badge}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-foreground text-base mb-1.5">{s.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{s.desc}</p>

                          <div className="text-sm font-bold text-price-yellow pt-3 border-t border-border/30">{s.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h2 className="font-bold text-foreground text-lg mb-1.5">{t("servicios.ongoing.title")}</h2>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{t("servicios.ongoing.desc")}</p>
              </div>
              <Link
                href="/planes"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300 whitespace-nowrap"
              >
                {t("servicios.ongoing.cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14 px-4 sm:px-6">
          <div className="container mx-auto max-w-2xl">
            <div className="glass-card p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
              <h2 className="font-extrabold mb-3">{t("servicios.quoteCta.title")}</h2>
              <p className="text-sm text-muted-foreground mb-7 max-w-md mx-auto">{t("servicios.quoteCta.subtitle")}</p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                <a
                  href="/calculator.html"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300"
                >
                  {t("servicios.quoteCta.cotizacionCta")}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <WhatsAppButton className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                  {t("servicios.quoteCta.whatsappCta")}
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ServiciosClient;
