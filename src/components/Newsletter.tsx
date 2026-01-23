import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import coveConnectBanner from "@/assets/cove-connect-banner.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Newsletter = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background accent - constrained */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 sm:w-1/3 h-64 sm:h-96 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="container mx-auto relative max-w-2xl w-full">
        <div className="text-center">
          <div className="glass-card p-4 sm:p-6 md:p-10 lg:p-12 relative overflow-hidden">
            {/* Decorative glow - smaller on mobile */}
            <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-32 sm:w-48 h-32 sm:h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-32 sm:w-48 h-32 sm:h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src={coveConnectBanner} 
                  alt="Cove Connect Newsletter" 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">
                {t("newsletter.title")} <span className="gradient-text">{t("newsletter.titleHighlight")}</span>
              </h2>
              
              <Button variant="hero" size="xl" asChild className="btn-glow w-full sm:w-auto min-h-[52px] text-sm sm:text-base">
                <a target="_blank" rel="noopener noreferrer" href="https://coveconnect.substack.com/" className="bg-[#f65c0f]">
                  {t("newsletter.button")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0" />
                </a>
              </Button>
              
              {/* Substack Embed - responsive */}
              <div className="mt-5 sm:mt-6 md:mt-8 w-full">
                <iframe 
                  src="https://coveconnect.substack.com/embed" 
                  width="100%" 
                  height="280" 
                  className="rounded-lg border border-border/20 w-full max-w-[420px] mx-auto" 
                  style={{ background: 'white' }} 
                  frameBorder="0" 
                  scrolling="no" 
                  title="Cove Connect Newsletter Subscription"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
