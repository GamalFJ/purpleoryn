"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const { t } = useLanguage();

  const navLinks: { href: string; label: string; badge?: string }[] = [
    { href: "/", label: t("header.nav.inicio") },
    { href: "/servicios", label: t("header.nav.servicios") },
    { href: "/portafolio", label: t("header.nav.portafolio") },
    { href: "/planes", label: t("header.nav.planes") },
    { href: "/calculator.html", label: t("header.nav.cotizacion") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" onClick={close}>
            <Image
              src="/logo.png"
              alt="Purple Cove Labs"
              width={44}
              height={44}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-sm sm:text-base font-bold text-foreground hidden sm:block">Purple Cove Labs</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              const isStatic = l.href.endsWith(".html") || l.href.startsWith("http");
              const classes = `flex items-center gap-1.5 text-sm lg:text-base transition-colors duration-200 ${
                active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`;
              const badge = l.badge && (
                <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {l.badge}
                </span>
              );
              return isStatic ? (
                <a key={l.href} href={l.href} className={classes}>
                  {l.label}
                  {badge}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className={classes}>
                  {l.label}
                  {badge}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <BookingButton
              ariaLabel={t("header.agendarLlamada")}
              className="btn-primary hidden sm:inline-flex px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm min-h-[40px]"
            >
              <Calendar className="w-4 h-4" />
              <span>{t("header.agendar")}</span>
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
              {navLinks.map((l) => {
                const isStatic = l.href.endsWith(".html") || l.href.startsWith("http");
                const classes =
                  "text-foreground/90 hover:text-primary transition-colors py-3 px-2 text-base min-h-[44px] flex items-center gap-2";
                const badge = l.badge && (
                  <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    {l.badge}
                  </span>
                );
                return isStatic ? (
                  <a key={l.href} href={l.href} onClick={close} className={classes}>
                    {l.label}
                    {badge}
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} onClick={close} className={classes}>
                    {l.label}
                    {badge}
                  </Link>
                );
              })}

              <BookingButton
                ariaLabel={t("header.agendarLlamada")}
                className="btn-primary mt-2 w-full px-5 py-3 min-h-[48px] text-sm"
              >
                <Calendar className="w-4 h-4" />
                {t("header.agendarLlamada")}
              </BookingButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
