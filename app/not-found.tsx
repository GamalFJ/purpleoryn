import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buttonClass } from "@/components/ui/button";
import { CTA } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido" className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6 md:pt-24">
        <p className="font-display text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Esta página no existe</h1>
        <p className="mt-3 text-lg text-muted">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonClass("secondary", "lg")}>
            Ir al inicio
          </Link>
          <Link href="/servicios#elegir-plan" className={buttonClass("primary", "lg")}>
            {CTA.plan}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
