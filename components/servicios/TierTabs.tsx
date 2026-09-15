"use client";

import { useState } from "react";
import { Price } from "@/components/tiers/Price";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatRD } from "@/lib/format";
import { TIER_ROWS, type Tier } from "@/lib/tiers";
import { SelectPlanButton } from "./PlanSelection";

export function TierTabs({ tiers }: { tiers: Tier[] }) {
  const [active, setActive] = useState(tiers[0]?.slug);

  return (
    <div>
      <div role="tablist" aria-label="Planes" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-surface p-1">
        {tiers.map((t) => (
          <button
            key={t.slug}
            role="tab"
            type="button"
            id={`tab-${t.slug}`}
            aria-selected={active === t.slug}
            aria-controls={`panel-${t.slug}`}
            onClick={() => setActive(t.slug)}
            className={cn(
              "h-11 cursor-pointer rounded-full text-[15px] font-medium transition-colors",
              active === t.slug ? "bg-accent text-accent-ink" : "text-muted hover:text-ink",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      {tiers.map((t) => (
        <div
          key={t.slug}
          role="tabpanel"
          id={`panel-${t.slug}`}
          aria-labelledby={`tab-${t.slug}`}
          hidden={active !== t.slug}
          className="mt-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6"
        >
          <p className="font-display text-[2rem] font-semibold leading-none">
            <Price amount={t.oneTime} />
          </p>
          <p className="mt-2 text-sm text-muted">
            pago único, más <span className="tabular text-ink">{formatRD(t.monthly)}</span> al mes
          </p>
          <dl className="mt-6 space-y-5">
            {TIER_ROWS.map((row) => (
              <div key={row.key}>
                <dt className="text-[15px] font-semibold">{row.label}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-muted">{t[row.key]}</dd>
              </div>
            ))}
          </dl>
          <SelectPlanButton slug={t.slug} source="comparison_tabs" className={buttonClass("primary", "lg", "mt-7 w-full")}>
            Elegir {t.name}
          </SelectPlanButton>
        </div>
      ))}
    </div>
  );
}
