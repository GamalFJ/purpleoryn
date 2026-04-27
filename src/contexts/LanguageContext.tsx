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
    if (typeof current === "object" && current !== null && key in current) {
      current = current[key];
    } else {
      return path; // Return the key if not found
    }
  }
  
  return typeof current === "string" ? current : path;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && ["en", "fr", "es"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    // Default to Spanish if no valid saved language
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
