import { Globe, Smartphone, Bot, Cog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Globe,
      titleKey: "services.items.websites.title",
      descriptionKey: "services.items.websites.description",
      accent: "from-blue-500 to-primary",
    },
    {
      icon: Smartphone,
      titleKey: "services.items.apps.title",
      descriptionKey: "services.items.apps.description",
      accent: "from-primary to-accent",
    },
    {
      icon: Bot,
      titleKey: "services.items.ai.title",
      descriptionKey: "services.items.ai.description",
      accent: "from-accent to-orange-500",
    },
    {
      icon: Cog,
      titleKey: "services.items.automations.title",
      descriptionKey: "services.items.automations.description",
      accent: "from-orange-500 to-yellow-500",
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
        
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <article 
              key={service.titleKey}
              className="glass-card-hover p-5 sm:p-6 md:p-8 group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${service.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
              
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

        {/* CTA to Pricing */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 glass-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/60 transition-all duration-300"
          >
            {t("services.viewPricing")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
