import Link from "next/link";
import { PortfolioEmpty, PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import type { PortfolioItem } from "@/lib/content";

export function PortfolioPreview({ items }: { items: PortfolioItem[] }) {
  return (
    <section aria-labelledby="casos-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="casos-titulo" className="text-3xl font-semibold sm:text-4xl">
          Casos de éxito
        </h2>
        {items.length > 0 && (
          <Link href="/portafolio" className="text-[15px] font-medium text-accent underline-offset-4 hover:underline">
            Ver todo el portafolio
          </Link>
        )}
      </div>
      <div className="mt-8">{items.length > 0 ? <PortfolioGrid items={items} /> : <PortfolioEmpty />}</div>
    </section>
  );
}
