"use client";

import Link from "next/link";
import { Layers, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[120px] opacity-30"
        style={{ background: "hsl(270 100% 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20"
        style={{ background: "hsl(280 100% 70%)" }}
      />

      <div className="container mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center text-center justify-center min-h-[70vh] sm:min-h-[75vh] pt-28 sm:pt-32 pb-16 sm:pb-20">
          <h1 className="font-extrabold leading-[1.05] tracking-tight mb-5 animate-fade-in" style={{ animationDelay: "0ms", opacity: 0 }}>
            <span className="block text-foreground">{t("hero.line1")}</span>
            <span className="block text-foreground">{t("hero.line2")}</span>
            <span className="block mt-2">
              <span className="gradient-text">{t("hero.highlight1")}</span>{" "}
              <span className="text-primary neon-text">{t("hero.highlight2")}</span>
            </span>
          </h1>

          <p
            className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed animate-fade-in"
            style={{ animationDelay: "120ms", opacity: 0 }}
          >
            {t("hero.subtitle")} <span className="text-primary font-semibold">{t("hero.subtitleHighlight")}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center animate-fade-in" style={{ animationDelay: "240ms", opacity: 0 }}>
            <WhatsAppButton className="btn-primary px-6 py-3.5 min-h-[52px] text-sm sm:text-base">
              <MessageCircle className="w-5 h-5 shrink-0" />
              {t("hero.ctaWhatsapp")}
            </WhatsAppButton>

            <Link href="/demos" className="btn-secondary px-6 py-3.5 min-h-[52px] text-sm sm:text-base">
              <Layers className="w-5 h-5 shrink-0" />
              {t("hero.ctaDemos")}
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(270 50% 8%) 0%, transparent 100%)" }}
      />
    </section>
  );
};

export default Hero;
