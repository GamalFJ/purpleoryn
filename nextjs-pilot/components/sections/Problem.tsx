"use client";

import { AlertTriangle, UserX, Repeat, BarChart2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [UserX, AlertTriangle, Repeat, BarChart2];

const Problem = () => {
  const { t, raw } = useLanguage();
  const items = raw("problem.items") as string[];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-extrabold">
            {t("problem.titlePart1")} <span className="text-destructive">{t("problem.titleHighlight")}</span>
            {t("problem.titlePart2")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((text, i) => {
            const Icon = icons[i];
            return (
              <div
                key={text}
                className="glass-card p-5 sm:p-6 text-center hover:-translate-y-1 hover:border-destructive/40 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problem;
