import { useLanguage } from "@/contexts/LanguageContext";

const addons = [
  { labelKey: "pricing.addons.extraPage", price: "$150" },
  { labelKey: "pricing.addons.booking", price: "$250" },
  { labelKey: "pricing.addons.analytics", price: "$150" },
  { labelKey: "pricing.addons.whatsapp", price: "$150" },
  { labelKey: "pricing.addons.bilingual", price: "$300" },
  { labelKey: "pricing.addons.seo", price: "$300" },
  { labelKey: "pricing.addons.leadCrm", price: "$500" },
  { labelKey: "pricing.addons.blog", price: "$200/mo" },
];

const AddOns = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            ➕ {t("pricing.addons.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pricing.addons.title")}</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("pricing.addons.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {addons.map((addon) => (
            <div
              key={addon.labelKey}
              className="glass-card px-4 py-3 flex justify-between items-center gap-3 hover:border-price-yellow/30 transition-all duration-200"
            >
              <span className="text-xs text-muted-foreground">{t(addon.labelKey)}</span>
              <span className="text-xs font-bold text-price-yellow whitespace-nowrap">{addon.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOns;
