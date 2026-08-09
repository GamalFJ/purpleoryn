"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Offer = () => {
  const { t, raw } = useLanguage();
  const bullets = raw("offer.bullets") as string[];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
              {t("offer.badge")}
            </div>
            <h2 className="font-extrabold mb-4">
              {t("offer.titlePart1")} <span className="gradient-text">{t("offer.titleHighlight1")}</span> {t("offer.titlePart2")}{" "}
              <span className="text-primary neon-text">{t("offer.titleHighlight2")}</span> {t("offer.titlePart3")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">{t("offer.subtitle")}</p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                </span>
                <span className="text-sm text-foreground/90 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">{t("offer.note")}</p>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors duration-200"
            >
              {t("offer.viewServices")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
