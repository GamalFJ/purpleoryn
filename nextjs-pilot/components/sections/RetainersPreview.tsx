"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Plan {
  name: string;
  desc: string;
  features: string[];
}

const prices = ["RD$ 10,675", "RD$ 18,000", "RD$ 35,000"];

const RetainersPreview = () => {
  const { t, raw } = useLanguage();
  const plans = raw("retainersPreview.plans") as Plan[];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            {t("retainersPreview.badge")}
          </div>
          <h2 className="font-extrabold">
            {t("retainersPreview.title")} <span className="gradient-text">{t("retainersPreview.titleHighlight")}</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{t("retainersPreview.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((p, i) => {
            const highlight = i === 1;
            return (
              <div
                key={p.name}
                className={`glass-card p-6 sm:p-7 flex flex-col relative transition-all duration-300 hover:-translate-y-1 ${
                  highlight ? "border-primary/60 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]" : "hover:border-primary/40"
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    {t("retainersPreview.popularBadge")}
                  </div>
                )}
                <h3 className="font-bold text-foreground text-lg mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed min-h-[40px]">{p.desc}</p>
                <div className="mb-5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-price-yellow">{prices[i]}</span>
                  <span className="text-sm text-muted-foreground">{t("retainersPreview.period")}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/planes"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 min-h-[48px] text-sm font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            {t("retainersPreview.viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RetainersPreview;
