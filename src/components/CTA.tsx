import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow - constrained */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] md:w-[500px] lg:w-[600px] h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto relative max-w-3xl w-full">
        <div className="glass-card p-5 sm:p-6 md:p-10 lg:p-16 text-center relative overflow-hidden">
          {/* Decorative elements - hidden on very small screens */}
          <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 sm:w-20 md:w-24 h-12 sm:h-20 md:h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{t("cta.badge")}</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
              {t("cta.title")} <br className="hidden sm:block" />
              <span className="gradient-text neon-text">{t("cta.titleHighlight")}</span>
            </h2>
            
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg mb-5 sm:mb-6 md:mb-8 lg:mb-10 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            
            <Button variant="hero" size="xl" className="group w-full sm:w-auto min-h-[52px] text-sm sm:text-base" asChild>
              <a target="_blank" rel="noopener noreferrer" href="https://fluum.ai/c/strategy-systems-session-709721">
                <span className="truncate">{t("cta.button")}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
