"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatCount, formatRD } from "@/lib/format";
import { computeRoi } from "@/lib/roi";
import type { Tier, TierSlug } from "@/lib/tiers";
import { usePlanSelection } from "./PlanSelection";

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function RoiCalculator({ tiers }: { tiers: Tier[] }) {
  const { selected, select, setAverageSaleValue } = usePlanSelection();
  const [slug, setSlug] = useState<TierSlug>(tiers[1]?.slug ?? tiers[0].slug);
  const [asvRaw, setAsvRaw] = useState("");
  const reduce = useReducedMotion();
  const asvId = useId();
  const tracked = useRef(new Set<string>());

  // Follow a plan picked elsewhere on the page (comparison table).
  useEffect(() => {
    if (selected) setSlug(selected);
  }, [selected]);

  const tier = tiers.find((t) => t.slug === slug) ?? tiers[0];
  const asv = parseAmount(asvRaw);
  const result = useMemo(
    () => (asv ? computeRoi({ oneTime: tier.oneTime, monthly: tier.monthly, averageSaleValue: asv }) : null),
    [asv, tier],
  );

  useEffect(() => {
    setAverageSaleValue(asv);
  }, [asv, setAverageSaleValue]);

  // "Completed" = a valid result the visitor paused on, once per plan/value pair.
  useEffect(() => {
    if (!result || !asv) return;
    const key = `${slug}:${asv}`;
    if (tracked.current.has(key)) return;
    const timer = setTimeout(() => {
      tracked.current.add(key);
      track("calculator_completed", { plan: slug, average_sale_value: asv });
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, asv, slug]);

  const outputs = result
    ? [
        { label: "Inversión del primer año", value: formatRD(result.yearOneInvestment), exact: null },
        { label: "Ventas para recuperar la inversión", value: `${Math.ceil(result.breakEvenSales)} ventas`, exact: result.breakEvenSales },
        { label: "Meta 3x: ventas al año", value: `${Math.ceil(result.targetSalesPerYear)} ventas`, exact: result.targetSalesPerYear },
        { label: "Meta 3x: ventas al mes", value: `${Math.ceil(result.targetSalesPerMonth)} ventas`, exact: result.targetSalesPerMonth },
      ]
    : [];

  return (
    <section id="calculadora" aria-labelledby="calculadora-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="calculadora-titulo" className="text-3xl font-semibold sm:text-4xl">
          ¿Cuántas ventas necesitas para que se pague solo?
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Elige un plan y escribe cuánto vale una venta promedio en tu negocio. El cálculo usa el método de retorno de Oryn.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <fieldset>
            <legend className="text-[15px] font-semibold">Plan</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {tiers.map((t) => (
                <label
                  key={t.slug}
                  className={cn(
                    "flex h-12 cursor-pointer items-center justify-center rounded-full border text-[15px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    slug === t.slug ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-accent hover:text-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="roi-plan"
                    value={t.slug}
                    checked={slug === t.slug}
                    onChange={() => setSlug(t.slug)}
                    className="sr-only"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5">
            <div>
              <dt className="text-sm text-muted">Pago único</dt>
              <dd className="tabular mt-1 font-medium">{formatRD(tier.oneTime)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Mensualidad</dt>
              <dd className="tabular mt-1 font-medium">{formatRD(tier.monthly)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2">
            <label htmlFor={asvId} className="text-[15px] font-semibold">
              Valor promedio de una venta
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">RD$</span>
              <input
                id={asvId}
                inputMode="decimal"
                autoComplete="off"
                value={asvRaw}
                onChange={(e) => setAsvRaw(e.target.value)}
                aria-describedby={`${asvId}-help`}
                className="tabular h-12 w-full rounded-[var(--radius-field)] border border-line bg-paper pl-14 pr-4 text-lg outline-none transition-colors focus:border-accent"
              />
            </div>
            <p id={`${asvId}-help`} className="text-sm text-muted">
              Lo que te paga un cliente en una compra típica.
            </p>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <motion.div
                key="result"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <dl className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
                  {outputs.map((o) => (
                    <div key={o.label}>
                      <dt className="text-sm text-muted">{o.label}</dt>
                      <dd className="tabular mt-1.5 font-display text-[1.75rem] font-semibold leading-none">{o.value}</dd>
                      {o.exact !== null && <dd className="tabular mt-1.5 text-sm text-muted">Exacto: {formatCount(o.exact)}</dd>}
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => select(tier.slug, "roi_calculator", { scroll: true })}
                    className={buttonClass("primary", "md")}
                  >
                    Elegir {tier.name}
                  </button>
                  <p className="text-sm text-muted">Tu cálculo se guarda junto con tu solicitud.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-56 flex-col justify-center"
              >
                <p className="font-display text-xl font-semibold">Escribe el valor de una venta para ver el resultado.</p>
                <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
                  Verás la inversión del primer año, las ventas que necesitas para recuperarla y la meta para triplicarla.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <details className="group mt-6 max-w-3xl text-[15px] text-muted">
        <summary className="cursor-pointer font-medium text-ink marker:text-accent">Cómo se calcula</summary>
        <ul className="mt-3 space-y-1.5 leading-relaxed">
          <li>Inversión del primer año = pago único + (mensualidad × 12)</li>
          <li>Ventas para recuperar la inversión = inversión del primer año ÷ valor promedio de una venta</li>
          <li>Meta 3x al año = (inversión del primer año × 3) ÷ valor promedio de una venta</li>
          <li>Meta 3x al mes = meta 3x al año ÷ 12</li>
          <li>Los resultados se redondean hacia arriba porque no existen ventas parciales.</li>
        </ul>
      </details>
    </section>
  );
}
