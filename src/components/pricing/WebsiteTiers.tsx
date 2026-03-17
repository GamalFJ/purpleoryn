import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

const tiers = [
  {
    nameKey: "pricing.websites.starter.name",
    price: "$350",
    noteKey: "pricing.websites.starter.note",
    features: [
      "pricing.websites.starter.f1",
      "pricing.websites.starter.f2",
      "pricing.websites.starter.f3",
      "pricing.websites.starter.f4",
      "pricing.websites.starter.f5",
    ],
    popular: false,
  },
  {
    nameKey: "pricing.websites.growth.name",
    price: "$700",
    noteKey: "pricing.websites.growth.note",
    features: [
      "pricing.websites.growth.f1",
      "pricing.websites.growth.f2",
      "pricing.websites.growth.f3",
      "pricing.websites.growth.f4",
      "pricing.websites.growth.f5",
    ],
    popular: true,
  },
  {
    nameKey: "pricing.websites.premium.name",
    price: "$1,500",
    noteKey: "pricing.websites.premium.note",
    features: [
      "pricing.websites.premium.f1",
      "pricing.websites.premium.f2",
      "pricing.websites.premium.f3",
      "pricing.websites.premium.f4",
      "pricing.websites.premium.f5",
    ],
    popular: false,
  },
  {
    nameKey: "pricing.websites.full.name",
    price: "$2,500–$6,000",
    noteKey: "pricing.websites.full.note",
    features: [
      "pricing.websites.full.f1",
      "pricing.websites.full.f2",
      "pricing.websites.full.f3",
      "pricing.websites.full.f4",
      "pricing.websites.full.f5",
    ],
    popular: false,
  },
];

const WebsiteTiers = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            🌐 {t("pricing.websites.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {t("pricing.websites.title")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {t("pricing.websites.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.nameKey}
              className={`glass-card p-5 sm:p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${
                tier.popular ? "border-primary/40 bg-primary/5" : ""
              }`}
            >
              {tier.popular && (
                <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 rounded px-2 py-0.5">
                  Popular
                </span>
              )}
              <h3 className="font-bold text-foreground mb-1">{t(tier.nameKey)}</h3>
              <div className="text-2xl font-extrabold text-price-yellow mb-1">{tier.price}</div>
              <p className="text-xs text-muted-foreground mb-4">{t(tier.noteKey)}</p>
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

export default WebsiteTiers;
