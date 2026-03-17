import { useLanguage } from "@/contexts/LanguageContext";

const items = [
  { nameKey: "pricing.auto.workflow.name", priceKey: "pricing.auto.workflow.price", descKey: "pricing.auto.workflow.desc", icon: "🔁" },
  { nameKey: "pricing.auto.crm.name", priceKey: "pricing.auto.crm.price", descKey: "pricing.auto.crm.desc", icon: "📊" },
  { nameKey: "pricing.auto.leadgen.name", priceKey: "pricing.auto.leadgen.price", descKey: "pricing.auto.leadgen.desc", icon: "📡" },
  { nameKey: "pricing.auto.ops.name", priceKey: "pricing.auto.ops.price", descKey: "pricing.auto.ops.desc", icon: "🏗️" },
  { nameKey: "pricing.auto.audit.name", priceKey: "pricing.auto.audit.price", descKey: "pricing.auto.audit.desc", icon: "🔍" },
];

const Automations = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            ⚙️ {t("pricing.auto.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pricing.auto.title")}</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("pricing.auto.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <div key={item.nameKey} className="glass-card p-5 sm:p-6 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="font-bold text-foreground mb-1">{t(item.nameKey)}</h3>
              <div className="text-lg font-extrabold text-price-yellow mb-2">{t(item.priceKey)}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Automations;
