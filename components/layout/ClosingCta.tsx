import Link from "next/link";
import { RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import { calUrl } from "@/lib/links";
import { CTA } from "@/lib/site";

// The single deep-plum block on the page, lit by drifting color glows.
export function ClosingCta({ location }: { location: string }) {
  return (
    <section aria-labelledby="cierre-titulo" className="px-4 pb-16 pt-24 sm:px-6 md:pt-32">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-plum px-6 py-12 text-plum-ink sm:px-12 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#a21caf]/45 blur-3xl" />
          <div className="animate-drift absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-[#6d2fd8]/50 blur-3xl [--drift-x:-50px] [animation-duration:20s]" />
          <div className="animate-drift absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#f59e0b]/25 blur-3xl [--drift-x:40px] [--drift-y:-40px] [animation-duration:24s]" />
        </div>
        <span className="animate-float mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-plum-accent to-[#f0abfc] text-plum shadow-[0_12px_30px_-12px_rgb(185_138_255/0.8)]">
          <RocketLaunch size={30} weight="duotone" aria-hidden="true" />
        </span>
        <h2 id="cierre-titulo" className="max-w-[20ch] text-3xl font-semibold leading-tight text-plum-ink sm:text-[2.6rem]">
          ¿Cuál plan le conviene a tu negocio?
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-plum-muted">
          Compara los tres planes o reserva 20 minutos para decidirlo con nosotros.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/servicios#elegir-plan" className={buttonClass("onPlum", "lg")}>
            {CTA.plan}
          </Link>
          <TrackedLink href={calUrl()} event="cal_click" location={location} className={buttonClass("onPlumSecondary", "lg")}>
            {CTA.call}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
