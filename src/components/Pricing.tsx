import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import pricingStarterImg from "@/assets/pricing-starter.png";
import pricingStandardImg from "@/assets/pricing-standard.png";
import pricingPremiumImg from "@/assets/pricing-premium.png";

const FIVERR_GIG_URL = "http://www.fiverr.com/s/qDBW55d";

const pricingTiers = [
  {
    name: "Workflow Kickstart",
    price: "$1,500",
    description: "Your first AI automation that actually works",
    image: pricingStarterImg,
    delivery: "7 days",
    features: [
      "1 smart AI agent handling real tasks",
      "Simple web interface or landing page",
      "Connected to your tools via API",
      "Deployment & documentation included",
      "1 revision round",
    ],
    highlight: false,
  },
  {
    name: "Full System Build",
    price: "$4,500",
    description: "Complete AI-powered backend for your business",
    image: pricingStandardImg,
    delivery: "14 days",
    features: [
      "2-3 AI agents working together",
      "Custom dashboard or web tool",
      "User login & role management",
      "Error handling & logging built-in",
      "Up to 5 API integrations",
      "Full documentation & diagrams",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "AI Platform Launch",
    price: "$10,000+",
    description: "Full B2B AI platform — like a mini-SaaS",
    image: pricingPremiumImg,
    delivery: "3-6 weeks",
    features: [
      "Multi-agent system with specialized roles",
      "Complete web app with admin dashboard",
      "Database design & integration",
      "Full marketing funnel included",
      "1-2 months post-launch support",
      "Video walkthrough & handover",
    ],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Choose the package that fits your business needs. Every tier delivers a production-ready AI system you can use immediately.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <article
              key={tier.name}
              className={`glass-card glass-card-hover relative flex flex-col overflow-hidden transition-all duration-500 ${
                tier.highlight
                  ? "md:-translate-y-4 ring-2 ring-primary/50"
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {tier.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Cover Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src={tier.image}
                  alt={`${tier.name} illustration`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                  {tier.description}
                </p>

                <div className="mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-bold gradient-text">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm ml-2">
                    / {tier.delivery}
                  </span>
                </div>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/90">{feature}</span>
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
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
