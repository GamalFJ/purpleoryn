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
    <div className="relative isolate overflow-hidden">
      {/* Ambient color wash: slow drift, static under reduced motion. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <div className="animate-drift absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl" />
        <div
          className="animate-drift absolute -top-10 right-[8%] h-[22rem] w-[22rem] rounded-full bg-fuchsia/15 blur-3xl [--drift-x:-60px] [--drift-y:40px] [animation-duration:19s]"
        />
        <div className="animate-drift absolute bottom-[-8rem] left-[30%] h-[20rem] w-[20rem] rounded-full bg-warm/15 blur-3xl [--drift-x:50px] [--drift-y:-20px] [animation-duration:22s]" />
        <div className="animate-drift absolute bottom-[-6rem] right-[-4rem] h-[18rem] w-[18rem] rounded-full bg-teal/15 blur-3xl [--drift-x:-30px] [animation-duration:18s]" />
      </div>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pt-10 sm:px-6 md:grid-cols-[1.35fr_0.65fr] md:gap-12 md:pt-16">
        <div className="pb-2 md:pb-16">
          <p className="mb-4 text-lg font-medium text-ink">
            <span className="sr-only">Para tu negocio, un socio {DESCRIPTORS.slice(0, -1).join(", ")} y {DESCRIPTORS.at(-1)}.</span>
            {/* The word ends the line, so shorter words leave no visible gap. */}
            <span aria-hidden="true">
              Para tu negocio, un socio <RotatingWord words={DESCRIPTORS} />
            </span>
          </p>
          {/* pb keeps descenders inside the clipped gradient. */}
          <h1 className="text-gradient-brand pb-[0.1em] text-[2.25rem] font-semibold leading-[1.06] sm:text-[2.75rem] lg:text-[3.25rem]">
            {settings.heroHeadline}
          </h1>
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
    </div>
  );
}
