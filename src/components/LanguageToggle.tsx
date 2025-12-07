import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as const, label: "EN", fullName: "English", flag: "🇬🇧" },
  { code: "fr" as const, label: "FR", fullName: "Français", flag: "🇫🇷" },
  { code: "es" as const, label: "ES", fullName: "Español", flag: "🇪🇸" },
];

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card hover:border-primary/50 transition-all duration-200 min-h-[44px] text-sm font-medium text-foreground"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-primary" />
        <span>{currentLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 rounded-xl glass-card border border-glass-border/50 bg-card shadow-lg z-50 overflow-hidden animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors hover:bg-primary/10 ${
                language === lang.code ? "bg-primary/15 text-primary" : "text-foreground"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
