import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import coveConnectBanner from "@/assets/cove-connect-banner.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Newsletter = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-accent/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto relative max-w-2xl">
        <div className="text-center">
          <div className="glass-card p-5 sm:p-8 md:p-12 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src={coveConnectBanner} 
                  alt="Cove Connect Newsletter" 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                {t("newsletter.title")} <span className="gradient-text">{t("newsletter.titleHighlight")}</span>
              </h2>
              
              <Button variant="hero" size="xl" asChild className="btn-glow w-full sm:w-auto min-h-[48px]">
                <a target="_blank" rel="noopener noreferrer" href="https://coveconnect.substack.com/" className="bg-[#f65c0f]">
                  {t("newsletter.button")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              
              {/* Substack Embed */}
              <div className="mt-6 sm:mt-8">
                <iframe 
                  src="https://coveconnect.substack.com/embed" 
                  width="100%" 
                  height="320" 
                  className="rounded-lg border border-border/20 max-w-[480px] mx-auto" 
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
