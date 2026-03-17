import { useLanguage } from "@/contexts/LanguageContext";

const bundles = [
  {
    nameKey: "pricing.bundles.launch.name",
    valueKey: "pricing.bundles.launch.value",
    price: "$900",
    descKey: "pricing.bundles.launch.desc",
    includesKeys: ["pricing.bundles.launch.i1","pricing.bundles.launch.i2","pricing.bundles.launch.i3","pricing.bundles.launch.i4","pricing.bundles.launch.i5"],
    icon: "🚀",
  },
  {
    nameKey: "pricing.bundles.growth.name",
    valueKey: "pricing.bundles.growth.value",
    price: "$1,200/mo",
    descKey: "pricing.bundles.growth.desc",
    includesKeys: ["pricing.bundles.growth.i1","pricing.bundles.growth.i2","pricing.bundles.growth.i3","pricing.bundles.growth.i4","pricing.bundles.growth.i5"],
    icon: "📈",
  },
  {
    nameKey: "pricing.bundles.aiStack.name",
    valueKey: "pricing.bundles.aiStack.value",
    price: "$1,500 + $950/mo",
    descKey: "pricing.bundles.aiStack.desc",
    includesKeys: ["pricing.bundles.aiStack.i1","pricing.bundles.aiStack.i2","pricing.bundles.aiStack.i3","pricing.bundles.aiStack.i4","pricing.bundles.aiStack.i5"],
    icon: "🤖",
  },
  {
    nameKey: "pricing.bundles.systems.name",
    valueKey: "pricing.bundles.systems.value",
    price: "$2,000",
    descKey: "pricing.bundles.systems.desc",
    includesKeys: ["pricing.bundles.systems.i1","pricing.bundles.systems.i2","pricing.bundles.systems.i3","pricing.bundles.systems.i4"],
    icon: "⚙️",
  },
];

const Bundles = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            📦 {t("pricing.bundles.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pricing.bundles.title")}</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("pricing.bundles.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {bundles.map((b) => (
            <div key={b.nameKey} className="glass-card p-6 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              <span className="text-2xl mb-3 block">{b.icon}</span>
              <h3 className="font-extrabold text-foreground text-lg mb-1">{t(b.nameKey)}</h3>
              <p className="text-xs text-muted-foreground mb-2">{t(b.valueKey)}</p>
              <div className="text-xl font-extrabold text-price-yellow mb-3">{b.price}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t(b.descKey)}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">{t("pricing.bundles.includes")}</p>
              <ul className="space-y-1">
                {b.includesKeys.map((k) => (
                  <li key={k} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">→</span> {t(k)}
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

export default Bundles;
