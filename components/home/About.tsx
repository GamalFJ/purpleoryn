import Image from "next/image";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/content";
import { IMAGE_RATIOS } from "@/lib/image";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { SITE } from "@/lib/site";

export function About({ settings }: { settings: SiteSettings }) {
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
            <div>
              <dt className="text-sm text-muted">Fundador</dt>
              <dd className="mt-1 font-medium">{SITE.founder}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">WhatsApp directo</dt>
              <dd className="mt-1 font-medium">
                <TrackedLink
                  href={whatsappUrl(WHATSAPP_GENERAL)}
                  event="whatsapp_click"
                  location="about"
                  className="tabular hover:text-accent"
                >
                  {SITE.phoneDisplay}
                </TrackedLink>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted">Área de servicio</dt>
              <dd className="mt-1 font-medium">{SITE.serviceAreas.join(", ")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
