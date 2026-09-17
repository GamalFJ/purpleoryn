import Image from "next/image";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import type { PortfolioItem } from "@/lib/content";
import { IMAGE_RATIOS } from "@/lib/image";

export function PortfolioEmpty({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="flex flex-col items-start gap-5 rounded-[var(--radius-panel)] border border-accent/25 bg-linear-to-br from-accent-soft via-surface to-rose-soft/70 p-7 sm:flex-row sm:items-center sm:p-9">
      <IconTile icon={Sparkle} tone="violet" size="lg" className="animate-float" />
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
        <li
          key={item.id}
          className="flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-accent/20 bg-surface shadow-[0_18px_40px_-30px_rgb(109_47_216/0.6)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none"
        >
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
