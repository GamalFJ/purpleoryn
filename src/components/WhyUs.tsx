import { TrendingUp, Layers, Shield, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyUs = () => {
  const { t } = useLanguage();

  const differentiators = [
    {
      icon: TrendingUp,
      titleKey: "whyUs.items.businessFirst.title",
      descriptionKey: "whyUs.items.businessFirst.description",
    },
    {
      icon: Layers,
      titleKey: "whyUs.items.fullStack.title",
      descriptionKey: "whyUs.items.fullStack.description",
    },
    {
      icon: Shield,
      titleKey: "whyUs.items.scalable.title",
      descriptionKey: "whyUs.items.scalable.description",
    },
    {
      icon: Users,
      titleKey: "whyUs.items.partnership.title",
      descriptionKey: "whyUs.items.partnership.description",
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {t("whyUs.title")} <span className="gradient-text">{t("whyUs.titleHighlight")}</span>
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {differentiators.map((item) => (
            <div 
              key={item.titleKey}
              className="glass-card-hover p-5 sm:p-6 md:p-8 flex gap-4 sm:gap-5"
            >
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-foreground">
                  {t(item.titleKey)}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {t(item.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
