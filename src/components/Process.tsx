import { MessageSquare, PenTool, Rocket, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Process = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      titleKey: "process.steps.step1.title",
      descriptionKey: "process.steps.step1.description",
    },
    {
      number: "02",
      icon: PenTool,
      titleKey: "process.steps.step2.title",
      descriptionKey: "process.steps.step2.description",
    },
    {
      number: "03",
      icon: Rocket,
      titleKey: "process.steps.step3.title",
      descriptionKey: "process.steps.step3.description",
    },
    {
      number: "04",
      icon: HeartHandshake,
      titleKey: "process.steps.step4.title",
      descriptionKey: "process.steps.step4.description",
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {t("process.title")} <span className="gradient-text">{t("process.titleHighlight")}</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative"
            >
              {/* Connector line - only visible on lg+ */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10 -translate-y-1/2 z-0" />
              )}
              
              <div className="glass-card-hover p-5 sm:p-6 md:p-8 h-full relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary/30">{step.number}</span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground">
                  {t(step.titleKey)}
                </h3>
                
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {t(step.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
