import { useLanguage } from "@/contexts/LanguageContext";

const PricingHero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 text-center">
      <div className="container mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
          {t("pricing.hero.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {t("pricing.hero.title")} <span className="gradient-text">{t("pricing.hero.titleHighlight")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t("pricing.hero.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default PricingHero;
