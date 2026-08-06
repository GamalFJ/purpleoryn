import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

const tiers = [
  {
    nameKey: "pricing.retainers.maintenance.name",
    price: "RD$ 10,675",
    periodKey: "pricing.retainers.period",
    taglineKey: "pricing.retainers.maintenance.tagline",
    features: ["pricing.retainers.maintenance.f1","pricing.retainers.maintenance.f2","pricing.retainers.maintenance.f3","pricing.retainers.maintenance.f4"],
    accent: "from-purple-900 to-primary",
    flagship: false,
  },
  {
    nameKey: "pricing.retainers.growth.name",
    price: "RD$ 18,000",
    periodKey: "pricing.retainers.period",
    taglineKey: "pricing.retainers.growth.tagline",
    features: ["pricing.retainers.growth.f1","pricing.retainers.growth.f2","pricing.retainers.growth.f3","pricing.retainers.growth.f4"],
    accent: "from-primary to-accent",
    flagship: false,
  },
  {
    nameKey: "pricing.retainers.aiPartner.name",
    price: "RD$ 35,000",
    periodKey: "pricing.retainers.period",
    taglineKey: "pricing.retainers.aiPartner.tagline",
    features: ["pricing.retainers.aiPartner.f1","pricing.retainers.aiPartner.f2","pricing.retainers.aiPartner.f3","pricing.retainers.aiPartner.f4","pricing.retainers.aiPartner.f5"],
    accent: "from-accent to-orange-500",
    flagship: true,
  },
];

const Retainers = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            🔁 {t("pricing.retainers.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pricing.retainers.title")}</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("pricing.retainers.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.nameKey}
              className={`glass-card p-6 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
                tier.flagship ? "border-primary/40 bg-primary/5" : ""
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tier.accent}`} />
              {tier.flagship && (
                <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 rounded px-2 py-0.5">
                  Flagship
                </span>
              )}
              <h3 className="font-bold text-foreground text-lg mb-1">{t(tier.nameKey)}</h3>
              <div className="text-3xl font-extrabold text-price-yellow">
                {tier.price}<span className="text-sm text-muted-foreground font-normal">/{t(tier.periodKey)}</span>
              </div>
              <p className="text-xs text-primary italic mt-2 mb-4">{t(tier.taglineKey)}</p>
              <hr className="border-border/40 mb-4" />
              <ul className="space-y-2">
                {tier.features.map((fKey) => (
                  <li key={fKey} className="flex gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-success-green flex-shrink-0 mt-0.5" />
                    {t(fKey)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Retainers;
