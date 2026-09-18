import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import { calUrl } from "@/lib/links";
import { CTA } from "@/lib/site";
import { RoadTeaserGraphic } from "./RoadTeaserGraphic";

// Sits between the solution and the plans: shows that the process is short and
// mapped out, then hands off to /como-trabajamos for the detail.
export function ProcesoTeaser() {
  return (
    <section aria-labelledby="proceso-titulo" className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="proceso-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
          De la primera conversación al sitio en vivo, en siete pasos
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Todo inicia con un diagnóstico sin costo y sin compromiso. De ahí en adelante el camino está escrito: sabes qué
          sigue, cuándo pagas y cuándo sale en vivo tu sistema.
        </p>
      </div>

      <div className="mt-12">
        <RoadTeaserGraphic />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/como-trabajamos" className={buttonClass("primary", "lg")}>
          Ver cómo trabajamos
        </Link>
        <TrackedLink href={calUrl()} event="cal_click" location="home_proceso" className={buttonClass("secondary", "lg")}>
          {CTA.call}
        </TrackedLink>
      </div>
    </section>
  );
}
