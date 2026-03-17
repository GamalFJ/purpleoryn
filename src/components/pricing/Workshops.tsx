import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

const workshops = [
  {
    nameKey: "pricing.workshops.half.name",
    priceKey: "pricing.workshops.half.price",
    metaKey: "pricing.workshops.half.meta",
    badgeKey: "pricing.workshops.half.badge",
    badgeColor: "bg-success-green/10 text-success-green",
    features: ["pricing.workshops.half.f1","pricing.workshops.half.f2","pricing.workshops.half.f3","pricing.workshops.half.f4"],
  },
  {
    nameKey: "pricing.workshops.full.name",
    priceKey: "pricing.workshops.full.price",
    metaKey: "pricing.workshops.full.meta",
    badgeKey: "pricing.workshops.full.badge",
    badgeColor: "bg-blue-500/10 text-blue-400",
    features: ["pricing.workshops.full.f1","pricing.workshops.full.f2","pricing.workshops.full.f3","pricing.workshops.full.f4"],
  },
  {
    nameKey: "pricing.workshops.sprint.name",
    priceKey: "pricing.workshops.sprint.price",
    metaKey: "pricing.workshops.sprint.meta",
    badgeKey: "pricing.workshops.sprint.badge",
    badgeColor: "bg-primary/10 text-primary",
    features: ["pricing.workshops.sprint.f1","pricing.workshops.sprint.f2","pricing.workshops.sprint.f3","pricing.workshops.sprint.f4"],
  },
];

const Workshops = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            🎓 {t("pricing.workshops.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("pricing.workshops.title")}</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("pricing.workshops.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workshops.map((ws) => (
            <div key={ws.nameKey} className="glass-card p-6 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
              <span className={`inline-block text-[10px] font-bold tracking-widest uppercase ${ws.badgeColor} rounded px-2 py-1 mb-3`}>
                {t(ws.badgeKey)}
              </span>
              <h3 className="font-bold text-foreground mb-1">{t(ws.nameKey)}</h3>
              <div className="text-xl font-extrabold text-price-yellow mb-1">{t(ws.priceKey)}</div>
              <p className="text-xs text-muted-foreground mb-4">{t(ws.metaKey)}</p>
              <ul className="space-y-2">
                {ws.features.map((fKey) => (
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

export default Workshops;
