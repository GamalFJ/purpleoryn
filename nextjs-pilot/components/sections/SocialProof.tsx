"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface Stat {
  value: string;
  label: string;
}

const SocialProof = () => {
  const { t, raw } = useLanguage();
  const stats = raw("socialProof.stats") as Stat[];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            {t("socialProof.badge")}
          </div>
          <h2 className="font-extrabold">
            {t("socialProof.title")} <span className="gradient-text">{t("socialProof.titleHighlight")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
