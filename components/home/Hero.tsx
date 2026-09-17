import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/content";
import { calUrl } from "@/lib/links";
import { CTA } from "@/lib/site";
import { HeroImageMotion } from "./HeroImageMotion";
import { HeroPeek } from "./HeroPeek";
import { RotatingWord } from "./RotatingWord";

const DESCRIPTORS = ["creativo", "confiable", "rápido", "estratégico"];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pt-10 sm:px-6 md:grid-cols-[1.35fr_0.65fr] md:gap-12 md:pt-16">
      <div className="pb-2 md:pb-16">
        <p className="mb-4 text-lg font-medium text-ink">
          <span className="sr-only">Para tu negocio, un socio {DESCRIPTORS.slice(0, -1).join(", ")} y {DESCRIPTORS.at(-1)}.</span>
          {/* The word ends the line, so shorter words leave no visible gap. */}
          <span aria-hidden="true">
            Para tu negocio, un socio <RotatingWord words={DESCRIPTORS} />
          </span>
        </p>
        <h1 className="text-[2.25rem] font-semibold leading-[1.06] sm:text-[2.75rem] lg:text-[3.25rem]">{settings.heroHeadline}</h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-body">{settings.heroSubheadline}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/servicios#elegir-plan" className={buttonClass("primary", "lg")}>
            {CTA.plan}
          </Link>
          <TrackedLink href={calUrl()} event="cal_click" location="hero" className={buttonClass("secondary", "lg")}>
            {CTA.call}
          </TrackedLink>
        </div>
      </div>

      <HeroImageMotion>
        <HeroPeek src={settings.heroImageUrl} />
      </HeroImageMotion>
    </section>
  );
}
