"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Target } from "@phosphor-icons/react";
import { RoiBadge } from "@/components/roi/RoiBadge";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatCount, formatRD, salesLabel } from "@/lib/format";
import { computeRoi, parseAmount } from "@/lib/roi";
import { recommendedTier, type Tier, type TierSlug } from "@/lib/tiers";
import { usePlanSelection } from "./PlanSelection";

export function RoiCalculator({ tiers }: { tiers: Tier[] }) {
  const { selected, select, setAverageSaleValue } = usePlanSelection();
  const [slug, setSlug] = useState<TierSlug>(() => recommendedTier(tiers).slug);
  const [asvRaw, setAsvRaw] = useState("");
  const asvId = useId();
  const tracked = useRef(new Set<string>());

  // The home page teaser links here with ?venta=<value> to prefill the input.
  useEffect(() => {
    const venta = parseAmount(new URLSearchParams(window.location.search).get("venta") ?? "");
    if (venta) setAsvRaw(String(venta));
  }, []);

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
        {
          label: "Inversión del primer año",
          value: formatRD(result.yearOneInvestment),
          exact: null,
          note: "Todo lo que pagas por el servicio en tu primer año.",
          tone: "warm" as const,
        },
        {
          label: "Ventas para recuperar la inversión",
          value: salesLabel(Math.ceil(result.breakEvenSales)),
          exact: result.breakEvenSales,
          note: "A partir de aquí, el sistema ya se pagó solo.",
          tone: "neutral" as const,
        },
        {
          label: "Meta 3x: ventas al año",
          value: salesLabel(Math.ceil(result.targetSalesPerYear)),
          exact: result.targetSalesPerYear,
          note: "Para triplicar lo invertido en el año.",
          tone: "accent" as const,
        },
        {
          label: "Meta 3x: ventas al mes",
          value: salesLabel(Math.ceil(result.targetSalesPerMonth)),
          exact: result.targetSalesPerMonth,
          note: "El ritmo mensual para llegar a esa meta.",
          tone: "accent" as const,
        },
      ]
    : [];

  const toneClass: Record<"warm" | "neutral" | "accent", string> = {
    warm: "text-warm-ink",
    neutral: "text-ink",
    accent: "bg-linear-to-r from-accent to-fuchsia bg-clip-text text-transparent",
  };

  // Break-even is always exactly ⅓ of the way to the 3x target (target = 3 ×
  // break-even, by definition), so this fraction never needs recomputing per
  // plan — it just reads that fact off the result instead of hardcoding 33%.
  const breakEvenPct = result ? (result.breakEvenSales / result.targetSalesPerYear) * 100 : 0;

  return (
    <section id="calculadora" aria-labelledby="calculadora-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="rounded-[28px] border border-warm-line bg-linear-to-br from-warm-soft via-warm-soft to-rose-soft shadow-[0_28px_60px_-40px_rgb(180_83_9/0.6)] p-5 sm:p-8 md:p-10">
        <div className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Decorative: the badge beside it names the method. Drop-shadow, not
              box-shadow, because the mark has transparent corners. */}
          <Image
            src="/media/oryn-roi.webp"
            alt=""
            width={512}
            height={512}
            className="h-24 w-24 shrink-0 drop-shadow-[0_18px_30px_rgb(180_83_9/0.4)] sm:h-28 sm:w-28"
          />
          <div>
            <RoiBadge className="mb-4" />
            <h2 id="calculadora-titulo" className="text-3xl font-semibold sm:text-4xl">
              ¿Cuántas ventas necesitas para que se pague solo?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-body">
              Elige un plan y escribe cuánto vale una venta promedio en tu negocio. El resultado se actualiza al escribir.
            </p>
          </div>
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
                      slug === t.slug ? "border-transparent bg-linear-to-r from-accent to-fuchsia text-accent-ink shadow-[0_8px_18px_-10px_rgb(109_47_216/0.7)]" : "border-line text-muted hover:border-accent hover:text-ink",
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <dl className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
                    {outputs.map((o) => (
                      <div key={o.label}>
                        <dt className="text-sm text-muted">{o.label}</dt>
                        <dd className={cn("tabular mt-1.5 font-display text-[1.75rem] font-semibold leading-none", toneClass[o.tone])}>
                          {o.value}
                        </dd>
                        <dd className="mt-1.5 text-sm leading-snug text-muted">{o.note}</dd>
                        {o.exact !== null && <dd className="tabular mt-1 text-xs text-muted">Exacto: {formatCount(o.exact)}</dd>}
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8">
                    <div className="flex items-center justify-between text-xs font-medium text-muted">
                      <span>0 ventas</span>
                      <span>Meta 3x: {salesLabel(Math.ceil(result.targetSalesPerYear))}</span>
                    </div>
                    <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-line">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-warm"
                        style={{ width: `${breakEvenPct}%`, originX: 0 }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-y-0 bg-linear-to-r from-accent to-fuchsia"
                        style={{ left: `${breakEvenPct}%`, width: `${100 - breakEvenPct}%`, originX: 0 }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                      />
                      <div className="absolute inset-y-0 w-0.5 bg-surface" style={{ left: `${breakEvenPct}%` }} aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-xs text-muted">Punto de equilibrio: {salesLabel(Math.ceil(result.breakEvenSales))}</p>
                  </div>

                  <div className="mt-6 flex gap-3 rounded-[var(--radius-panel)] border border-warm-line/60 bg-accent-soft/60 p-5">
                    <Target size={20} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="text-[15px] font-semibold text-ink">¿Qué es la Meta 3x?</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-body">
                        No nos conformamos con que el sistema se pague solo. Nuestra meta es que, en tu primer año, te devuelva 3 veces lo que
                        invertiste — no romper parejo, generar ganancia real.
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        Esta es tu meta de referencia, no una garantía de ventas — depende de tu mercado, tu oferta y el seguimiento que le des a
                        cada cliente que te llega.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-56 flex-col justify-center"
                >
                  <p className="font-display text-xl font-semibold">Escribe el valor de una venta para ver el resultado.</p>
                  <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-body">
                    Verás la inversión del primer año, las ventas que necesitas para recuperarla y la meta para triplicarla.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <details className="group mt-6 max-w-3xl text-[15px] text-body">
          <summary className="cursor-pointer font-medium text-ink marker:text-accent">Cómo se calcula</summary>
          <p className="mt-3 leading-relaxed">
            En corto: escribes cuánto vale una venta típica tuya, y calculamos cuántas ventas de ese tamaño se necesitan para pagar el sistema — y
            cuántas para triplicar la inversión.
          </p>
          <ul className="mt-3 space-y-1.5 leading-relaxed">
            <li>Inversión del primer año = pago único + (mensualidad × 12)</li>
            <li>Ventas para recuperar la inversión = inversión del primer año ÷ valor promedio de una venta</li>
            <li>Meta 3x al año = (inversión del primer año × 3) ÷ valor promedio de una venta</li>
            <li>Meta 3x al mes = meta 3x al año ÷ 12</li>
            <li>Los resultados se redondean hacia arriba porque no existen ventas parciales.</li>
          </ul>
        </details>
      </div>
    </section>
  );
}
