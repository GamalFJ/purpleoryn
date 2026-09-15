import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Price } from "@/components/tiers/Price";
import { buttonClass } from "@/components/ui/button";
import { formatRD } from "@/lib/format";
import { CTA } from "@/lib/site";
import type { Tier } from "@/lib/tiers";
import { StairStep } from "./StairStep";

// Each plan includes everything in the one before it, so the columns step up
// in height left to right: the layout itself shows the progression.
const STEP_HEIGHT = ["md:min-h-[27rem]", "md:min-h-[31rem]", "md:min-h-[35rem]"];

export function TierStairs({ tiers }: { tiers: Tier[] }) {
  return (
    <section aria-labelledby="planes-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="planes-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
          Tres planes con precio publicado
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Un pago único para construirlo y una mensualidad para mantenerlo funcionando. Cada plan incluye todo lo del anterior.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 md:grid-cols-3 md:items-end">
        {tiers.map((tier, i) => (
          <li key={tier.slug}>
            <StairStep index={i}>
              <article
                className={`flex h-full flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7 ${STEP_HEIGHT[i] ?? ""}`}
              >
                <h3 className="text-2xl font-semibold">{tier.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{tier.tagline}</p>

                <ul className="mt-6 space-y-2.5 text-[15px]">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-line pt-6">
                  <p className="font-display text-[2rem] font-semibold leading-none">
                    <Price amount={tier.oneTime} />
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    pago único, más <span className="tabular text-ink">{formatRD(tier.monthly)}</span> al mes
                  </p>
                </div>
              </article>
            </StairStep>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/servicios#elegir-plan" className={buttonClass("primary", "lg")}>
          {CTA.plan}
        </Link>
        <Link href="/servicios#calculadora" className="text-[15px] font-medium text-accent underline-offset-4 hover:underline">
          Calcula cuántas ventas necesitas para recuperarlo
        </Link>
      </div>
    </section>
  );
}
