"use client";

import { useState } from "react";
import { Price } from "@/components/tiers/Price";
import { TierCta } from "@/components/tiers/TierCta";
import { RecommendedBadge } from "@/components/tiers/RecommendedBadge";
import { cn } from "@/lib/cn";
import { formatRD } from "@/lib/format";
import { TIER_ROWS, type Tier } from "@/lib/tiers";

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
          {t.recommended && <RecommendedBadge className="mb-3" />}
          <p className="font-display text-[2rem] font-semibold leading-none text-warm-ink">
            <Price amount={t.oneTime} />
          </p>
          <p className="mt-2 text-sm text-muted">
            pago único, más <span className="tabular text-ink">{formatRD(t.monthly)}</span> al mes
          </p>
          <dl className="mt-6 space-y-5">
            {TIER_ROWS.map((row) => (
              <div key={row.label}>
                <dt className="text-[15px] font-semibold">{row.label}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-body">{row.value(t)}</dd>
              </div>
            ))}
          </dl>
          <TierCta tier={t} location="comparison_tabs" mode="select" size="lg" className="mt-7 w-full" />
        </div>
      ))}
    </div>
  );
}
