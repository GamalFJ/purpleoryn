"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 mt-8 py-10 px-4 sm:px-6 pb-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-3">
              <Image src="/logo.png" alt="Purple Cove Labs" width={40} height={40} className="h-10 w-10 rounded-full" />
              <span className="font-bold text-foreground">Purple Cove Labs</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-3">{t("footer.navLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">{t("header.nav.inicio")}</Link></li>
              <li><Link href="/servicios" className="hover:text-primary">{t("header.nav.servicios")}</Link></li>
              <li><Link href="/portafolio" className="hover:text-primary">{t("header.nav.portafolio")}</Link></li>
              <li><Link href="/demos" className="hover:text-primary">{t("header.nav.demos")}</Link></li>
              <li><Link href="/planes" className="hover:text-primary">{t("header.nav.planes")}</Link></li>
              <li><a href="/calculator.html" className="hover:text-primary">{t("header.nav.cotizacion")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-3">{t("footer.contactLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:gamal.jastram@purpleoryn.com" className="hover:text-primary">
                  gamal.jastram@purpleoryn.com
                </a>
              </li>
              <li>
                <a
                  href="https://cal.com/purple-cove-labs/20-min-cafe-virtual"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {t("footer.bookCall")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground border-t border-border/30 pt-6">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
};

export default Footer;
