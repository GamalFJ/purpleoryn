import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RoadMap } from "@/components/proceso/RoadMap";
import { buttonClass } from "@/components/ui/button";
import { DOCUMENTS } from "@/lib/documents";
import { calUrl } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cómo trabajamos",
  description:
    "El proceso de un proyecto en Purple Cove Labs, paso por paso: presentación, propuesta, aprobación escrita, pago inicial, formulario de configuración, construcción y salida en vivo.",
  path: "/como-trabajamos",
});

// Only two CTAs on this page by design: the free diagnosis at the start of the
// road, and starting the project at the end. No closing block, so neither one
// competes with a third.
export default function ComoTrabajamosPage() {
  return (
    <>
      <Header />
      <main id="contenido">
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
          <h1 className="text-gradient-brand pb-[0.1em] text-[2.35rem] font-semibold leading-[1.06] sm:text-5xl">
            Cómo trabajamos
          </h1>
          <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-body">
            Todo inicia con una conversación de diagnóstico, sin costo y sin compromiso. Desde la presentación del
            sistema en adelante, este es el camino que recorremos juntos. Siete pasos, sin sorpresas.
          </p>
          <div className="mt-8">
            <TrackedLink
              href={calUrl()}
              event="cal_click"
              location="como_trabajamos_inicio"
              className={buttonClass("primary", "lg")}
            >
              Agenda tu diagnóstico gratis
            </TrackedLink>
          </div>
          <p className="mt-10 text-sm text-muted">
            <span className="pointer-coarse:hidden">Pasa el cursor sobre cada punto del camino para ver el detalle.</span>
            <span className="hidden pointer-coarse:inline">Toca cada punto del camino para ver el detalle.</span>
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <RoadMap />
        </div>

        <section aria-labelledby="documentos-titulo" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <h2 id="documentos-titulo" className="text-2xl font-semibold leading-tight sm:text-[1.75rem]">
            Llévatelo por escrito
          </h2>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-body">
            El mismo camino con sus compromisos y políticas, y el documento completo de Oryn Presence.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DocumentCard doc={DOCUMENTS["como-trabajamos"]} location="como_trabajamos_docs" variant="compact" />
            <DocumentCard doc={DOCUMENTS["oryn-presence"]} location="como_trabajamos_docs" variant="compact" />
          </div>
        </section>

        <section aria-labelledby="empezar-titulo" className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6">
          <h2 id="empezar-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
            Ya conoces el camino
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-body">
            Elige tu plan y envía el formulario. Ese envío es el paso 03: tu aprobación escrita y tu cupo reservado por 7
            días.
          </p>
          <Link href="/servicios#elegir-plan" className={buttonClass("primary", "lg", "mt-8")}>
            Empieza tu proyecto
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
