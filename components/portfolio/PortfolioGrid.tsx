import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import type { PortfolioItem } from "@/lib/content";
import { IMAGE_RATIOS } from "@/lib/image";

export function PortfolioEmpty({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="flex flex-col items-start gap-5 rounded-[var(--radius-panel)] border border-line bg-surface p-7 sm:flex-row sm:items-center sm:p-9">
      <Image src="/media/logo.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-full" />
      <div>
        <Heading className="font-display text-xl font-semibold">Casos de éxito próximamente</Heading>
        <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-body">
          Cada caso se publicará con el permiso del cliente y con resultados que se puedan verificar.
        </p>
      </div>
    </div>
  );
}

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface">
          {item.coverImageUrl && (
            <div className={cn("relative bg-accent-soft", IMAGE_RATIOS.landscape.className)}>
              <Image src={item.coverImageUrl} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
            </div>
          )}
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            {item.summary && <p className="mt-2 text-[15px] leading-relaxed text-body">{item.summary}</p>}
            {item.results && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-[15px] font-medium">{item.results}</p>
                {item.resultsSource && <p className="mt-1 text-sm text-muted">Fuente: {item.resultsSource}</p>}
              </div>
            )}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-medium text-accent hover:underline"
              >
                Ver proyecto <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
