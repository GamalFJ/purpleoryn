"use client";

import Image from "next/image";
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

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-24 sm:pt-28 pb-16 sm:pb-20">
          {/* Real, translatable heading kept for SEO/accessibility — the banner image below carries the visible message but is static Spanish pixels, so screen readers and non-Spanish crawlers still get the real content. */}
          <h1 className="sr-only">
            {t("hero.line1")} {t("hero.line2")} {t("hero.highlight1")} {t("hero.highlight2")}
          </h1>
          <p className="sr-only">
            {t("hero.subtitle")} {t("hero.subtitleHighlight")}
          </p>

          <div className="w-full rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: "0ms", opacity: 0 }}>
            <Image src="/hero-banner.png" alt={t("hero.bannerAlt")} width={1672} height={941} priority className="w-full h-auto" />
          </div>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center mt-8 sm:mt-10 animate-fade-in"
            style={{ animationDelay: "180ms", opacity: 0 }}
          >
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
