import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import pricingStarterImg from "@/assets/pricing-starter.png";
import pricingStandardImg from "@/assets/pricing-standard.png";
import pricingPremiumImg from "@/assets/pricing-premium.png";
import { useLanguage } from "@/contexts/LanguageContext";

const FIVERR_GIG_URL = "http://www.fiverr.com/s/qDBW55d";

const Pricing = () => {
  const { t } = useLanguage();

  const pricingTiers = [
    {
      nameKey: "pricing.tiers.starter.name",
      price: "$1,500",
      descriptionKey: "pricing.tiers.starter.description",
      image: pricingStarterImg,
      delivery: "7 days",
      featuresKey: "pricing.tiers.starter.features",
      highlight: false,
    },
    {
      nameKey: "pricing.tiers.standard.name",
      price: "$4,500",
      descriptionKey: "pricing.tiers.standard.description",
      image: pricingStandardImg,
      delivery: "14 days",
      featuresKey: "pricing.tiers.standard.features",
      highlight: true,
      badgeKey: "pricing.tiers.standard.badge",
    },
    {
      nameKey: "pricing.tiers.premium.name",
      price: "$10,000+",
      descriptionKey: "pricing.tiers.premium.description",
      image: pricingPremiumImg,
      delivery: "3-6 weeks",
      featuresKey: "pricing.tiers.premium.features",
      highlight: false,
    },
  ];

  // Helper to get features array from translation
  const getFeatures = (key: string): string[] => {
    const result = t(key);
    // The translation returns the stringified array, so we need to handle it
    // For simplicity, we'll use hardcoded features based on the tier
    return [];
  };

  // Hardcoded features with translation keys for each item
  const tierFeatures = {
    starter: [
      "pricing.tiers.starter.features.0",
      "pricing.tiers.starter.features.1",
      "pricing.tiers.starter.features.2",
      "pricing.tiers.starter.features.3",
      "pricing.tiers.starter.features.4",
    ],
    standard: [
      "pricing.tiers.standard.features.0",
      "pricing.tiers.standard.features.1",
      "pricing.tiers.standard.features.2",
      "pricing.tiers.standard.features.3",
      "pricing.tiers.standard.features.4",
      "pricing.tiers.standard.features.5",
    ],
    premium: [
      "pricing.tiers.premium.features.0",
      "pricing.tiers.premium.features.1",
      "pricing.tiers.premium.features.2",
      "pricing.tiers.premium.features.3",
      "pricing.tiers.premium.features.4",
      "pricing.tiers.premium.features.5",
    ],
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t("pricing.title")}{" "}
            <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => {
            const tierKey = index === 0 ? "starter" : index === 1 ? "standard" : "premium";
            const features = tierFeatures[tierKey];
            
            return (
              <article
                key={tier.nameKey}
                className={`glass-card glass-card-hover relative flex flex-col overflow-hidden transition-all duration-500 ${
                  tier.highlight
                    ? "md:-translate-y-4 ring-2 ring-primary/50"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {tier.badgeKey && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {t(tier.badgeKey)}
                    </span>
                  </div>
                )}

                {/* Cover Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={tier.image}
                    alt={`${t(tier.nameKey)} illustration`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{t(tier.nameKey)}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    {t(tier.descriptionKey)}
                  </p>

                  <div className="mb-2">
                    <span className="text-2xl sm:text-3xl font-bold gradient-text">
                      {tier.price}
                    </span>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t("pricing.delivery")}: {tier.delivery}
                    </span>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
                    {features.map((featureKey, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{t(featureKey)}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.highlight ? "hero" : "outline"}
                    size="lg"
                    className="w-full group min-h-[48px]"
                    asChild
                  >
                    <a href={FIVERR_GIG_URL} target="_blank" rel="noopener noreferrer">
                      {t("pricing.getStarted")}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
