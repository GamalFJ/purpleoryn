import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#services", label: t("header.services") },
    { href: "#portfolio", label: t("header.portfolio") },
    { href: "#process", label: t("header.process") },
    { href: "#why-us", label: t("header.whyUs") },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <img 
              src={logo} 
              alt="Purple Cove Labs Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-transform duration-300 group-hover:scale-110" 
            />
            <span className="text-base sm:text-lg font-bold text-foreground hidden sm:block">
              Purple Cove Labs
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm lg:text-base"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              className="glass-card px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-primary/60 transition-all duration-300 min-h-[44px] flex items-center" 
              href="https://fluum.ai/c/strategy-systems-session-709721"
            >
              {t("header.hireMe")}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 py-3 px-2 text-base min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
