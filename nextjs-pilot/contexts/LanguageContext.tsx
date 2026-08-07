"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "@/translations/en";
import { fr } from "@/translations/fr";
import { es } from "@/translations/es";

type Language = "en" | "fr" | "es";

type TranslationValue = string | string[] | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = { en, fr, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: TranslationValue, path: string): string => {
  const keys = path.split(".");
  let current: TranslationValue = obj;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && !Array.isArray(current) && key in current) {
      current = (current as { [key: string]: TranslationValue })[key];
    } else {
      return path;
    }
  }

  return typeof current === "string" ? current : path;
};

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language?.split("-")[0].toLowerCase();
  if (browserLang === "fr") return "fr";
  if (browserLang === "en") return "en";
  return "es";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && ["en", "fr", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      setLanguageState(detectBrowserLanguage());
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
