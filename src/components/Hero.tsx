import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const Hero = () => {
  const {
    t
  } = useLanguage();
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6">
      {/* Background gradient orbs - very soft ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" style={{
      animationDelay: "3s"
    }} />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-card text-xs sm:text-sm text-primary font-medium">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                {t("hero.badge")}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-delay-1">
              <span className="text-foreground">{t("hero.headline1")}</span>
              <br />
              <span className="gradient-text neon-text">{t("hero.headline2")}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-delay-2">
              {t("hero.tagline")} <span className="text-foreground font-medium">{t("hero.doneForYou")}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-delay-3">
              <Button variant="hero" size="xl" className="w-full sm:w-auto min-h-[48px]" asChild>
                <a target="_blank" rel="noopener noreferrer" href="https://fluum.ai/c/strategy-systems-session-709721">
                  {t("hero.cta1")}
                  <ArrowRight className="w-5 h-5 ml-1" />
                </a>
              </Button>
              
              <Button variant="glass" size="xl" className="w-full sm:w-auto min-h-[48px]" asChild>
                <a href="#portfolio">
                  {t("hero.cta2")}
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right content - Founder image */}
          <div className="relative flex justify-center items-center mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/8 to-accent/8 rounded-full blur-3xl animate-glow-pulse" />
              <img alt={t("hero.founderAlt")} className="relative z-10 w-full max-w-[16rem] sm:max-w-[20rem] lg:max-w-[28rem] h-auto animate-float border-glass-bg object-contain" loading="lazy" src="/lovable-uploads/ff603c71-0718-45fb-bda6-277965352f31.png" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - hidden on very small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>;
};
export default Hero;