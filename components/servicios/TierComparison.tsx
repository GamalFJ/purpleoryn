import { Price } from "@/components/tiers/Price";
import { buttonClass } from "@/components/ui/button";
import { formatRD } from "@/lib/format";
import { TIER_ROWS, type Tier } from "@/lib/tiers";
import { SelectPlanButton } from "./PlanSelection";
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
                <th key={t.slug} scope="col" className="border-l border-line p-6 font-normal">
                  <span className="block font-display text-2xl font-semibold">{t.name}</span>
                  <span className="mt-4 block font-display text-[1.9rem] font-semibold leading-none">
                    <Price amount={t.oneTime} />
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    pago único, más <span className="tabular text-ink">{formatRD(t.monthly)}</span> al mes
                  </span>
                  <SelectPlanButton slug={t.slug} source="comparison_table" className={buttonClass("primary", "sm", "mt-5 w-full")}>
                    Elegir {t.name}
                  </SelectPlanButton>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIER_ROWS.map((row) => (
              <tr key={row.key} className="border-t border-line align-top">
                <th scope="row" className="p-6 text-[15px] font-semibold">
                  {row.label}
                </th>
                {tiers.map((t) => (
                  <td key={t.slug} className="border-l border-line p-6 text-[15px] leading-relaxed text-muted">
                    {t[row.key]}
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
