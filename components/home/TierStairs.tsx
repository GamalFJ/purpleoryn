import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Price } from "@/components/tiers/Price";
import { RecommendedBadge } from "@/components/tiers/RecommendedBadge";
import { TierCta } from "@/components/tiers/TierCta";
import { ADDONS_ANCHOR, type Addon } from "@/lib/addons";
import { cn } from "@/lib/cn";
import { formatRD } from "@/lib/format";
import type { Tier } from "@/lib/tiers";
import { RoiTeaser } from "./RoiTeaser";
import { StairStep } from "./StairStep";

// Each plan includes everything in the one before it, so the columns step up
// in height left to right: the layout itself shows the progression.
const STEP_HEIGHT = ["md:min-h-[31rem]", "md:min-h-[35rem]", "md:min-h-[39rem]"];

export function TierStairs({ tiers, addons }: { tiers: Tier[]; addons: Addon[] }) {
  return (
    <section aria-labelledby="planes-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="planes-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
          Tres planes con precio publicado
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Un pago único para construirlo y una mensualidad para mantenerlo funcionando. Cada plan incluye todo lo del anterior.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 md:grid-cols-3 md:items-end">
        {tiers.map((tier, i) => (
          <li key={tier.slug}>
            <StairStep index={i}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-[var(--radius-panel)] border bg-surface p-6 sm:p-7",
                  // The recommended plan carries more visual weight than the other two.
                  tier.recommended ? "border-warm shadow-[0_24px_48px_-28px_rgb(180_83_9/0.5)]" : "border-line",
                  STEP_HEIGHT[i],
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-2xl font-semibold">{tier.name}</h3>
                  {tier.recommended && <RecommendedBadge />}
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{tier.tagline}</p>

                <ul className="mt-6 space-y-2.5 text-[15px]">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-line pt-6">
                  <p className="font-display text-[2rem] font-semibold leading-none text-warm-ink">
                    <Price amount={tier.oneTime} />
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    pago único, más <span className="tabular text-ink">{formatRD(tier.monthly)}</span> al mes
                  </p>
                  <TierCta tier={tier} location="home_tiers" mode="link" className="mt-6 w-full" />
                </div>
              </article>
            </StairStep>
          </li>
        ))}
      </ol>

      {addons[0] && (
        <p className="mt-8 text-[15px] text-body">
          ¿También quieres que alguien conteste tus llamadas? Conoce el{" "}
          <Link href={`/servicios#${ADDONS_ANCHOR}`} className="font-medium text-accent underline-offset-4 hover:underline">
            {addons[0].name}
          </Link>
          , un complemento aparte de los planes.
        </p>
      )}

      <RoiTeaser tiers={tiers} />
    </section>
  );
}
