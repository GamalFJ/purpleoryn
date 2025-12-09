import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Gift } from "lucide-react";
import decemberCover from "@/assets/december-special-cover.png";

const DecemberSpecial = () => {
  const { t } = useLanguage();

  const features = [
    "decemberSpecial.feature1",
    "decemberSpecial.feature2",
    "decemberSpecial.feature3",
    "decemberSpecial.feature4",
    "decemberSpecial.feature5",
    "decemberSpecial.feature6",
    "decemberSpecial.feature7",
  ];

  return (
    <section id="december-special" className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="glass-card christmas-glow p-6 sm:p-8 lg:p-10 relative overflow-hidden border-christmas-gold/30">
          {/* Decorative snowflakes */}
          <div className="absolute top-4 right-4 text-white/20 text-4xl animate-pulse">❄️</div>
          <div className="absolute bottom-4 left-4 text-white/15 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>❄️</div>
          <div className="absolute top-1/3 left-4 text-white/10 text-2xl animate-pulse" style={{ animationDelay: '2s' }}>❄️</div>
          
          {/* Cover Image */}
          <div className="mb-6 -mx-6 sm:-mx-8 lg:-mx-10 -mt-6 sm:-mt-8 lg:-mt-10 rounded-t-lg overflow-hidden">
            <img 
              src={decemberCover} 
              alt="December Special Offer - Purple Cove Labs" 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Festive Badge */}
          <div className="flex justify-center mb-4">
            <span className="festive-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold">
              <Gift className="w-4 h-4" />
              {t("decemberSpecial.badge")}
            </span>
          </div>

          {/* Title & Price */}
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {t("decemberSpecial.title")}
            </h2>
            <p className="text-3xl sm:text-4xl font-bold christmas-gradient-text">
              {t("decemberSpecial.price")}
            </p>
          </div>

          {/* Urgency Text */}
          <p className="text-center text-christmas-gold font-medium mb-6 text-sm sm:text-base">
            ⏰ {t("decemberSpecial.urgency")}
          </p>

          {/* Features List */}
          <div className="mb-6">
            <p className="text-muted-foreground text-sm mb-3 font-medium">
              {t("decemberSpecial.includes")}:
            </p>
            <ul className="space-y-2">
              {features.map((featureKey, index) => (
                <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{t(featureKey)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bonus Highlight */}
          <div className="bg-christmas-red/10 border border-christmas-red/30 rounded-lg p-4 mb-6">
            <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground">
              <Gift className="w-5 h-5 text-christmas-gold" />
              {t("decemberSpecial.bonus")}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted-foreground text-sm italic mb-6">
            {t("decemberSpecial.tagline")}
          </p>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="https://fiverr.com/s/qDBW55d"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="xl" className="christmas-cta w-full sm:w-auto">
                <Gift className="w-5 h-5 mr-2" />
                {t("decemberSpecial.cta")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecemberSpecial;
