import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import strategySessionImg from "@/assets/strategy-session.png";

const BOOKING_URL = "https://fluum.ai/c/strategy-systems-session-709721";

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
    <section id="pricing" className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="container mx-auto max-w-5xl w-full">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">{t("strategySession.title")}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            {t("strategySession.description")}
          </p>
        </header>

        {/* Premium Visual Image */}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-8 sm:mb-12 md:mb-16 group"
        >
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl glass-card glass-card-hover transition-all duration-500">
            <img
              src={strategySessionImg}
              alt="Book Your Strategy & Systems Session with Gamal Jastram"
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </a>

        {/* Main Card */}
        <article className="glass-card glass-card-hover p-5 sm:p-6 md:p-10 lg:p-12 mb-6 sm:mb-8">
          {/* What You Get */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
              {t("strategySession.whatYouGet")}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefitKey, index) => (
                <li key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-foreground/90 text-sm sm:text-base md:text-lg">
                    {t(benefitKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 my-6 sm:my-8" />

          {/* What This Is Not */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
              {t("strategySession.whatThisIsNot")}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {notIncluded.map((itemKey, index) => (
                <li key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted/50 flex items-center justify-center mt-0.5">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-sm sm:text-base md:text-lg">
                    {t(itemKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Independence Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 md:mb-10">
            <p className="text-foreground/80 text-xs sm:text-sm md:text-base italic text-center">
              {t("strategySession.independence")}
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              variant="hero"
              size="xl"
              className="group min-h-[52px] sm:min-h-[56px] text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 w-full sm:w-auto"
              asChild
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <span className="truncate">{t("strategySession.cta")}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default StrategySession;
