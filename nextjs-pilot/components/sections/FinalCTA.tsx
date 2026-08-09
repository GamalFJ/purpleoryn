"use client";

import { Calendar, MessageCircle } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";

const FinalCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-3xl relative">
        <div className="glass-card p-6 sm:p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <h2 className="font-extrabold mb-4">
            {t("finalCta.titlePart1")} <span className="gradient-text">{t("finalCta.titleHighlight")}</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto">{t("finalCta.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <BookingButton ariaLabel={t("finalCta.bookCta")} className="btn-primary px-6 py-3.5 min-h-[52px] text-sm sm:text-base">
              <Calendar className="w-5 h-5" />
              {t("finalCta.bookCta")}
            </BookingButton>

            <WhatsAppButton className="btn-secondary px-6 py-3.5 min-h-[52px] text-sm sm:text-base">
              <MessageCircle className="w-5 h-5" />
              {t("finalCta.whatsappCta")}
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
