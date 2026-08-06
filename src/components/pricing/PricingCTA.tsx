import { MessageCircle, Calendar } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingCTA = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-orange-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {t("pricing.cta.title")}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            {t("pricing.cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <BookingButton
              ariaLabel="Agendar llamada estratégica"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <Calendar className="w-4 h-4" />
              {t("pricing.cta.primary")}
            </BookingButton>
            <WhatsAppButton className="inline-flex items-center gap-2 glass-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/60 transition-all">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </WhatsAppButton>
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            {t("pricing.cta.email")}{" "}
            <a href="mailto:gamal.jastram@purpleoryn.com" className="text-primary hover:underline">
              gamal.jastram@purpleoryn.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingCTA;
