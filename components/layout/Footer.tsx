import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/media/logo.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
            <p className="font-display text-lg font-semibold">{SITE.name}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Sitios web, SEO local y agentes de IA para negocios en {SITE.serviceAreas.join(", ").replace(/, ([^,]*)$/, " y $1")}.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-sm font-semibold">Sitio</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacidad" className="hover:text-ink">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </nav>

        {/* NAP: must match the Google Business Profile exactly. */}
        <address className="not-italic">
          <p className="text-sm font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="text-ink">{SITE.name}</li>
            <li>
              <TrackedLink
                href={whatsappUrl(WHATSAPP_GENERAL)}
                event="whatsapp_click"
                location="footer"
                className="tabular hover:text-ink"
              >
                {SITE.phoneDisplay}
              </TrackedLink>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                {SITE.email}
              </a>
            </li>
            <li>Área de servicio: {SITE.serviceAreas.join(", ")}</li>
          </ul>
        </address>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {SITE.name}. Precios en pesos dominicanos.
        </p>
      </div>
    </footer>
  );
}
