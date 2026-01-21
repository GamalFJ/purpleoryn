import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const BOOKING_URL = "https://calendly.com/purplecovelabs/discovery";

const StrategySession = () => {
  const { t } = useLanguage();

  const benefits = [
    "strategySession.benefits.0",
    "strategySession.benefits.1",
    "strategySession.benefits.2",
  ];

  const notIncluded = [
    "strategySession.notIncluded.0",
    "strategySession.notIncluded.1",
    "strategySession.notIncluded.2",
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t("strategySession.title")}</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t("strategySession.description")}
          </p>
        </header>

        {/* Main Card */}
        <article className="glass-card glass-card-hover p-8 md:p-12 mb-8">
          {/* What You Get */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
              {t("strategySession.whatYouGet")}
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefitKey, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/90 text-base md:text-lg">
                    {t(benefitKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 my-8" />

          {/* What This Is Not */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
              {t("strategySession.whatThisIsNot")}
            </h3>
            <ul className="space-y-4">
              {notIncluded.map((itemKey, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center mt-0.5">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-base md:text-lg">
                    {t(itemKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Independence Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-10">
            <p className="text-foreground/80 text-sm md:text-base italic text-center">
              {t("strategySession.independence")}
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              variant="hero"
              size="xl"
              className="group min-h-[56px] text-base md:text-lg px-8 md:px-12"
              asChild
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                {t("strategySession.cta")}
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default StrategySession;
