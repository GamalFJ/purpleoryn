"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "@/translations/en";
import { fr } from "@/translations/fr";
import { es } from "@/translations/es";

type Language = "en" | "fr" | "es";

type TranslationValue = string | TranslationValue[] | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  // Intentionally `any`: callers assert the specific shape they expect
  // (string[], or an array of a page-local content interface) - the
  // union type TranslationValue doesn't structurally overlap with those,
  // which forces an `unknown` double-cast at every call site for no
  // real safety benefit, since the shape is defined by the caller anyway.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: (key: string) => any;
}

const translations = { en, fr, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: TranslationValue, path: string): TranslationValue | undefined => {
  const keys = path.split(".");
  let current: TranslationValue = obj;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && !Array.isArray(current) && key in current) {
      current = (current as { [key: string]: TranslationValue })[key];
    } else {
      return undefined;
    }
  }

  return current;
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

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const value = getNestedValue(translations[language], key);
    return typeof value === "string" ? value : key;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (key: string): any => {
    const value = getNestedValue(translations[language], key);
    return value === undefined ? key : value;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t, raw }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
