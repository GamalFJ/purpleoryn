import { Price } from "@/components/tiers/Price";
import { TierCta } from "@/components/tiers/TierCta";
import { ROW_THEME, TIER_THEME } from "@/components/tiers/theme";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import { TONE } from "@/lib/tone";
import { RecommendedBadge } from "@/components/tiers/RecommendedBadge";
import { formatRD } from "@/lib/format";
import { TIER_ROWS, type Tier } from "@/lib/tiers";
import { TierTabs } from "./TierTabs";

export function TierComparison({ tiers }: { tiers: Tier[] }) {
  return (
    <section id="comparacion" aria-labelledby="comparacion-titulo" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <h2 id="comparacion-titulo" className="sr-only">
        Comparación de planes
      </h2>

      {/* Desktop and tablet: full side-by-side table. */}
      <div className="hidden overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Qué incluye cada plan y cuánto cuesta</caption>
          <colgroup>
            <col className="w-[19%]" />
            {tiers.map((t) => (
              <col key={t.slug} />
            ))}
          </colgroup>
          <thead>
            <tr className="align-top">
              <td className="p-6" />
              {tiers.map((t) => (
                <th key={t.slug} scope="col" className={cn("relative border-l border-line p-6 font-normal", t.recommended && "bg-accent-soft/40")}>
                  <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1.5 bg-linear-to-r", TONE[TIER_THEME[t.slug].tone].bar)} />
                  <span className="flex flex-wrap items-center gap-2">
                    <IconTile icon={TIER_THEME[t.slug].icon} tone={TIER_THEME[t.slug].tone} size="sm" />
                    <span className={cn("font-display text-2xl font-semibold", TONE[TIER_THEME[t.slug].tone].text)}>{t.name}</span>
                    {t.recommended && <RecommendedBadge />}
                  </span>
                  <span className="mt-4 block font-display text-[1.9rem] font-semibold leading-none text-warm-ink">
                    <Price amount={t.oneTime} />
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    pago único, más <span className="tabular text-ink">{formatRD(t.monthly)}</span> al mes
                  </span>
                  <TierCta tier={t} location="comparison_table" mode="select" size="sm" className="mt-5 w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIER_ROWS.map((row) => (
              <tr key={row.label} className="border-t border-line align-top">
                <th scope="row" className="p-6 text-[15px] font-semibold text-ink">
                  <span className="flex items-center gap-3">
                    {ROW_THEME[row.label] && <IconTile icon={ROW_THEME[row.label].icon} tone={ROW_THEME[row.label].tone} size="sm" />}
                    {row.label}
                  </span>
                </th>
                {tiers.map((t) => (
                  <td key={t.slug} className={cn("border-l border-line p-6 text-[15px] leading-relaxed text-body", t.recommended && "bg-accent-soft/40")}>
                    {row.value(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: one plan at a time instead of a squeezed three-column table. */}
      <div className="md:hidden">
        <TierTabs tiers={tiers} />
      </div>
    </section>
  );
}
