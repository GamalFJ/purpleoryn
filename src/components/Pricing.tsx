import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import pricingStarterImg from "@/assets/pricing-starter.png";
import pricingStandardImg from "@/assets/pricing-standard.png";
import pricingPremiumImg from "@/assets/pricing-premium.png";
import pricingEnterpriseImg from "@/assets/pricing-enterprise.png";
import { useLanguage } from "@/contexts/LanguageContext";

const FIVERR_GIG_URL = "http://www.fiverr.com/s/qDBW55d";
const CONTACT_URL = "https://calendly.com/purplecovelabs/discovery";

const Pricing = () => {
  const { t } = useLanguage();

  const pricingTiers = [
    {
      nameKey: "pricing.tiers.starter.name",
      price: "$1,200",
      descriptionKey: "pricing.tiers.starter.description",
      image: pricingStarterImg,
      delivery: "7 days",
      featuresKey: "pricing.tiers.starter.features",
      highlight: false,
      isEnterprise: false,
    },
    {
      nameKey: "pricing.tiers.standard.name",
      price: "$4,999.99",
      descriptionKey: "pricing.tiers.standard.description",
      image: pricingStandardImg,
      delivery: "14 days",
      featuresKey: "pricing.tiers.standard.features",
      highlight: true,
      badgeKey: "pricing.tiers.standard.badge",
      isEnterprise: false,
    },
    {
      nameKey: "pricing.tiers.premium.name",
      price: "$10,000",
      descriptionKey: "pricing.tiers.premium.description",
      image: pricingPremiumImg,
      delivery: "3-6 weeks",
      featuresKey: "pricing.tiers.premium.features",
      highlight: false,
      isEnterprise: false,
    },
    {
      nameKey: "pricing.tiers.enterprise.name",
      price: "$15,000+",
      descriptionKey: "pricing.tiers.enterprise.description",
      image: pricingEnterpriseImg,
      delivery: "Custom",
      featuresKey: "pricing.tiers.enterprise.features",
      highlight: false,
      isEnterprise: true,
    },
  ];

  // Hardcoded features with translation keys for each item
  const tierFeatures = {
    starter: [
      "pricing.tiers.starter.features.0",
      "pricing.tiers.starter.features.1",
      "pricing.tiers.starter.features.2",
      "pricing.tiers.starter.features.3",
      "pricing.tiers.starter.features.4",
      "pricing.tiers.starter.features.5",
      "pricing.tiers.starter.features.6",
    ],
    standard: [
      "pricing.tiers.standard.features.0",
      "pricing.tiers.standard.features.1",
      "pricing.tiers.standard.features.2",
      "pricing.tiers.standard.features.3",
      "pricing.tiers.standard.features.4",
      "pricing.tiers.standard.features.5",
      "pricing.tiers.standard.features.6",
      "pricing.tiers.standard.features.7",
    ],
    premium: [
      "pricing.tiers.premium.features.0",
      "pricing.tiers.premium.features.1",
      "pricing.tiers.premium.features.2",
      "pricing.tiers.premium.features.3",
      "pricing.tiers.premium.features.4",
      "pricing.tiers.premium.features.5",
      "pricing.tiers.premium.features.6",
      "pricing.tiers.premium.features.7",
      "pricing.tiers.premium.features.8",
    ],
    enterprise: [
      "pricing.tiers.enterprise.features.0",
      "pricing.tiers.enterprise.features.1",
      "pricing.tiers.enterprise.features.2",
    ],
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t("pricing.title")}{" "}
            <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {pricingTiers.map((tier, index) => {
            const tierKey = index === 0 ? "starter" : index === 1 ? "standard" : index === 2 ? "premium" : "enterprise";
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
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  <img
                    src={tier.image}
                    alt={`${t(tier.nameKey)} illustration`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-bold mb-1">{t(tier.nameKey)}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3">
                    {t(tier.descriptionKey)}
                  </p>

                  <div className="mb-2">
                    <span className="text-xl sm:text-2xl font-bold gradient-text">
                      {tier.price}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted-foreground text-xs">
                      {t("pricing.delivery")}: {tier.delivery}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4 flex-1">
                    {features.map((featureKey, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{t(featureKey)}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.isEnterprise ? (
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full min-h-[44px] cursor-not-allowed opacity-70"
                      disabled
                    >
                      {t("pricing.availableSoon")}
                    </Button>
                  ) : (
                    <Button
                      variant={tier.highlight ? "hero" : "outline"}
                      size="default"
                      className="w-full group min-h-[44px]"
                      asChild
                    >
                      <a href={FIVERR_GIG_URL} target="_blank" rel="noopener noreferrer">
                        {t("pricing.getStarted")}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  )}
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
