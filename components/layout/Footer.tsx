import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, MapPinLine } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { IconTile } from "@/components/ui/IconTile";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { NAV_LINKS, SITE } from "@/lib/site";

// Brand logos (WhatsApp, Instagram) from svgl, on white tiles so they read in
// both themes.
function LogoTile({ src }: { src: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_6px_14px_-10px_rgb(28_16_48/0.5)] ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-3 motion-reduce:transition-none">
      <Image src={src} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper">
      <span aria-hidden="true" className="absolute inset-x-0 -top-px h-0.5 bg-linear-to-r from-teal via-accent to-fuchsia" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/media/logo.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
            <p className="font-display text-lg font-semibold text-ink">{SITE.name}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-body">
            Sitios web, SEO local y agentes de IA para negocios en {SITE.serviceAreas.join(", ").replace(/, ([^,]*)$/, " y $1")}.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-4 text-sm font-medium text-ink transition-colors hover:border-rose/50 hover:text-rose-ink"
          >
            <LogoTile src="/media/logos/instagram.svg" />
            <span>
              <span className="sr-only">Instagram: </span>
              {SITE.instagramHandle}
            </span>
          </a>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-sm font-semibold text-ink">Sitio</p>
          <ul className="mt-3 space-y-2 text-sm text-body">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacidad" className="hover:text-accent">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </nav>

        {/* NAP: must match the Google Business Profile exactly. */}
        <address className="not-italic">
          <p className="text-sm font-semibold text-ink">{SITE.name}</p>
          <ul className="mt-3 space-y-3 text-sm text-body">
            <li>
              <TrackedLink
                href={whatsappUrl(WHATSAPP_GENERAL)}
                event="whatsapp_click"
                location="footer"
                className="group flex items-center gap-3 hover:text-accent"
              >
                <LogoTile src="/media/logos/whatsapp.svg" />
                <span className="tabular">
                  <span className="sr-only">WhatsApp: </span>
                  {SITE.phoneDisplay}
                </span>
              </TrackedLink>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="group flex items-center gap-3 break-all hover:text-accent">
                <IconTile icon={EnvelopeSimple} tone="violet" size="sm" />
                <span>
                  <span className="sr-only">Correo: </span>
                  {SITE.email}
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconTile icon={MapPinLine} tone="rose" size="sm" />
              <span>Área de servicio: {SITE.serviceAreas.join(", ")}</span>
            </li>
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
