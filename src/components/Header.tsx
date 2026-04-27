import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";
import LanguageToggle from "@/components/LanguageToggle";
import BookingButton from "@/components/BookingButton";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/apps", label: "Apps" },
  { href: "/planes", label: "Planes" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" onClick={close}>
            <img
              src={logo}
              alt="Purple Cove Labs"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm sm:text-base font-bold text-foreground hidden sm:block">
              Purple Cove Labs
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((l) => {
              const active = location.pathname === l.href;
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`text-sm lg:text-base transition-colors duration-200 ${
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <BookingButton
              ariaLabel="Agendar Llamada"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.03] transition-all duration-300 cursor-pointer min-h-[40px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar</span>
            </BookingButton>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={close}
                  className="text-foreground/90 hover:text-primary transition-colors py-3 px-2 text-base min-h-[44px] flex items-center"
                >
                  {l.label}
                </Link>
              ))}
              <BookingButton
                ariaLabel="Agendar Llamada"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Agendar Llamada
              </BookingButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
