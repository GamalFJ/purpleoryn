"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />

      <div className="glass-card p-8 sm:p-12 text-center max-w-md relative z-10">
        <h1 className="text-7xl sm:text-8xl font-bold text-primary mb-4">{t("notFound.title")}</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">{t("notFound.subtitle")}</h2>
        <p className="text-muted-foreground mb-8">{t("notFound.description")}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 btn-glow"
        >
          <Home className="w-4 h-4" />
          {t("notFound.returnHome")}
        </Link>
      </div>
    </div>
  );
}
