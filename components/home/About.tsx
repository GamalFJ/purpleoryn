import Image from "next/image";
import { InstagramLogo, MapPinLine, UserCircle, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/content";
import { IMAGE_RATIOS } from "@/lib/image";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { SITE } from "@/lib/site";

export function About({ settings, marketId }: { settings: SiteSettings; marketId: string }) {
  return (
    <section aria-labelledby="nosotros-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div
          className={cn(
            "relative mx-auto w-full max-w-sm overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface md:max-w-none",
            IMAGE_RATIOS.portrait.className,
          )}
        >
          <Image
            src={settings.aboutImageUrl}
            alt="Gamal Jastram, fundador de Purple Cove Labs"
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-cover object-center"
          />
        </div>

        <div>
          <h2 id="nosotros-titulo" className="text-3xl font-semibold sm:text-4xl">
            Quién está detrás
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-body">{settings.aboutBio}</p>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="group flex gap-3">
              <IconTile icon={UserCircle} tone="violet" size="sm" />
              <div>
                <dt className="text-sm text-muted">Fundador</dt>
                <dd className="mt-0.5 font-medium text-ink">{SITE.founder}</dd>
              </div>
            </div>
            <div className="group flex gap-3">
              <IconTile icon={WhatsappLogo} tone="teal" size="sm" />
              <div>
                <dt className="text-sm text-muted">WhatsApp directo</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  <TrackedLink href={whatsappUrl(WHATSAPP_GENERAL)} event="whatsapp_click" market={marketId} location="about" className="tabular hover:text-accent">
                    {SITE.phoneDisplay}
                  </TrackedLink>
                </dd>
              </div>
            </div>
            <div className="group flex gap-3">
              <IconTile icon={MapPinLine} tone="rose" size="sm" />
              <div>
                <dt className="text-sm text-muted">Área de servicio</dt>
                <dd className="mt-0.5 font-medium text-ink">{SITE.serviceAreas.join(", ")}</dd>
              </div>
            </div>
            <div className="group flex gap-3">
              <IconTile icon={InstagramLogo} tone="amber" size="sm" />
              <div>
                <dt className="text-sm text-muted">Instagram</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {SITE.instagramHandle}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
