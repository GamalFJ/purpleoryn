import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import { calUrl } from "@/lib/links";
import { CTA } from "@/lib/site";

// The single deep-plum block on the page.
export function ClosingCta({ location }: { location: string }) {
  return (
    <section aria-labelledby="cierre-titulo" className="px-4 pb-16 pt-24 sm:px-6 md:pt-32">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-plum px-6 py-12 text-plum-ink sm:px-12 sm:py-16">
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
