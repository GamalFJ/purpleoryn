"use client";

import { TrendingUp, Clock, Gauge, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [TrendingUp, Clock, Gauge, Users];

interface Item {
  title: string;
  desc: string;
}

const Promise = () => {
  const { t, raw } = useLanguage();
  const items = raw("promise.items") as Item[];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            {t("promise.badge")}
          </div>
          <h2 className="font-extrabold">
            {t("promise.title")} <span className="gradient-text">{t("promise.titleHighlight")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {items.map((p, i) => {
            const Icon = icons[i];
            return (
              <div
                key={p.title}
                className="glass-card p-6 sm:p-7 flex items-start gap-5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Promise;
