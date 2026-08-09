"use client";

import { Check, Star, ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import BookingButton from "@/components/BookingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface Plan {
  name: string;
  price: string;
  period: string;
  ideal: string;
  features: string[];
  deliverables: string[];
}

const PlanesClient = () => {
  const { t, raw } = useLanguage();
  const plans = raw("planes.plans") as Plan[];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              {t("planes.badge")}
            </div>
            <h1 className="font-extrabold mb-4">
              {t("planes.title")} <span className="gradient-text">{t("planes.titleHighlight")}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{t("planes.subtitle")}</p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {plans.map((p, i) => {
                const highlight = i === 1;
                return (
                  <div
                    key={p.name}
                    className={`glass-card p-6 sm:p-7 flex flex-col relative ${
                      highlight ? "border-primary/60 shadow-[0_0_50px_-10px_hsl(var(--primary)/0.5)]" : "hover:border-primary/40"
                    }`}
                  >
                    {highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        {t("planes.popularBadge")}
                      </div>
                    )}

                    <h3 className="font-bold text-foreground text-lg mb-2">{p.name}</h3>
                    <p className="text-xs text-muted-foreground italic mb-4 leading-relaxed">{p.ideal}</p>

                    <div className="mb-5 pb-5 border-b border-border/30">
                      <span className="text-3xl font-extrabold text-price-yellow">{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    </div>

                    <div className="mb-5">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">{t("planes.includeLabel")}</div>
                      <ul className="space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={3} />
                            <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6 flex-1">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">{t("planes.deliverablesLabel")}</div>
                      <ul className="space-y-2">
                        {p.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs text-muted-foreground leading-snug">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <BookingButton
                      ariaLabel={`${t("planes.bookCall")} — ${p.name}`}
                      className={`w-full px-5 py-3 min-h-[48px] text-sm ${highlight ? "btn-primary" : "btn-secondary"}`}
                    >
                      {t("planes.bookCall")}
                    </BookingButton>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">{t("planes.needSomethingElse")}</p>
              <WhatsAppButton className="btn-secondary px-5 py-2.5 text-sm">
                <MessageCircle className="w-4 h-4" />
                {t("planes.whatsappCta")}
              </WhatsAppButton>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default PlanesClient;
