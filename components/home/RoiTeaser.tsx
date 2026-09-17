"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { RoiBadge } from "@/components/roi/RoiBadge";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatRD, salesLabel } from "@/lib/format";
import { computeRoi, parseAmount } from "@/lib/roi";
import { recommendedTier, type Tier, type TierSlug } from "@/lib/tiers";

// Compact, working preview of the full calculator on /servicios. The link
// carries the plan and the typed value so the full calculator opens prefilled.
export function RoiTeaser({ tiers }: { tiers: Tier[] }) {
  const [slug, setSlug] = useState<TierSlug>(() => recommendedTier(tiers).slug);
  const [asvRaw, setAsvRaw] = useState("");
  const asvId = useId();
  const tracked = useRef(new Set<string>());

  const tier = tiers.find((t) => t.slug === slug) ?? tiers[0];
  const asv = parseAmount(asvRaw);
  const result = asv ? computeRoi({ oneTime: tier.oneTime, monthly: tier.monthly, averageSaleValue: asv }) : null;

  useEffect(() => {
    if (!asv) return;
    const key = `${slug}:${asv}`;
    if (tracked.current.has(key)) return;
    const timer = setTimeout(() => {
      tracked.current.add(key);
      track("calculator_completed", { plan: slug, average_sale_value: asv, calculator: "home_teaser" });
    }, 1200);
    return () => clearTimeout(timer);
  }, [asv, slug]);

  const params = new URLSearchParams({ plan: tier.slug });
  if (asv) params.set("venta", String(asv));

  return (
    <div className="mt-12 rounded-[28px] border border-warm-line bg-warm-soft p-6 sm:p-8 md:p-10">
      <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
        <div>
          <RoiBadge />
          <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-[1.75rem]">¿Cuántas ventas necesitas para recuperarlo?</h3>

          <fieldset className="mt-6">
            <legend className="text-[15px] font-semibold">Plan</legend>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {tiers.map((t) => (
                <label
                  key={t.slug}
                  className={cn(
                    "flex h-11 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent sm:text-[15px]",
                    slug === t.slug ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-muted hover:border-accent hover:text-ink",
                  )}
                >
                  <input type="radio" name="teaser-plan" value={t.slug} checked={slug === t.slug} onChange={() => setSlug(t.slug)} className="sr-only" />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 flex flex-col gap-2">
            <label htmlFor={asvId} className="text-[15px] font-semibold">
              Valor promedio de una venta
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">RD$</span>
              <input
                id={asvId}
                inputMode="decimal"
                autoComplete="off"
                placeholder="Ej.: 3,500"
                value={asvRaw}
                onChange={(e) => setAsvRaw(e.target.value)}
                className="tabular h-12 w-full rounded-[var(--radius-field)] border border-line bg-surface pl-14 pr-4 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1"
              >
                <p className="text-sm text-muted">Ventas para recuperar el primer año</p>
                <p className="tabular mt-1.5 font-display text-5xl font-semibold leading-none text-ink">{Math.ceil(result.breakEvenSales)}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-body">
                  Plan {tier.name}: inversión del primer año de{" "}
                  <span className="tabular font-semibold text-warm-ink">{formatRD(result.yearOneInvestment)}</span>. Para triplicarla necesitas{" "}
                  <span className="tabular font-semibold text-ink">{salesLabel(Math.ceil(result.targetSalesPerMonth))}</span> al mes.
                </p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                <p className="font-display text-xl font-semibold text-ink">Escribe el valor de una venta.</p>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  Te mostramos cuántas ventas recuperan la inversión del primer año del plan {tier.name}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <Link href={`/servicios?${params.toString()}#calculadora`} className={buttonClass("primary", "md", "mt-6 w-full sm:w-fit")}>
            Ver cálculo completo
          </Link>
        </div>
      </div>
    </div>
  );
}
