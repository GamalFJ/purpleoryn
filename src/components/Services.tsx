import { Bot, Code2, Rocket, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Bot,
      titleKey: "services.items.aiPipelines.title",
      descriptionKey: "services.items.aiPipelines.description",
    },
    {
      icon: Code2,
      titleKey: "services.items.webApps.title",
      descriptionKey: "services.items.webApps.description",
    },
    {
      icon: Rocket,
      titleKey: "services.items.productization.title",
      descriptionKey: "services.items.productization.description",
    },
    {
      icon: Wrench,
      titleKey: "services.items.maintenance.title",
      descriptionKey: "services.items.maintenance.description",
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl w-full">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
            {t("services.title")} <span className="gradient-text">{t("services.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
            {t("services.subtitle")}
          </p>
        </div>
        
        {/* Services grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <article 
              key={service.titleKey}
              className="glass-card-hover p-5 sm:p-6 md:p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 sm:mb-6 relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {t(service.titleKey)}
              </h3>
              
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {t(service.descriptionKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
