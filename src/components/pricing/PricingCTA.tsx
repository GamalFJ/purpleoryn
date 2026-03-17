import { useLanguage } from "@/contexts/LanguageContext";

const PricingCTA = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-orange-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {t("pricing.cta.title")}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            {t("pricing.cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://fluum.ai/c/strategy-systems-session-709721"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {t("pricing.cta.primary")}
            </a>
            <a
              href="https://wa.me/18096390000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/60 transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            {t("pricing.cta.email")} <a href="mailto:hello@purpleoryn.com" className="text-primary hover:underline">hello@purpleoryn.com</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingCTA;
