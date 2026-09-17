import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Price } from "@/components/tiers/Price";
import { RecommendedBadge } from "@/components/tiers/RecommendedBadge";
import { TierCta } from "@/components/tiers/TierCta";
import { TIER_THEME } from "@/components/tiers/theme";
import { IconTile } from "@/components/ui/IconTile";
import { ADDONS_ANCHOR, type Addon } from "@/lib/addons";
import { cn } from "@/lib/cn";
import { formatRD } from "@/lib/format";
import type { Tier } from "@/lib/tiers";
import { TONE } from "@/lib/tone";
import { RoiTeaser } from "./RoiTeaser";
import { StairStep } from "./StairStep";

// Each plan includes everything in the one before it, so the columns step up
// in height left to right: the layout itself shows the progression.
const STEP_HEIGHT = ["md:min-h-[34rem]", "md:min-h-[38rem]", "md:min-h-[42rem]"];

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
        {tiers.map((tier, i) => {
          const theme = TIER_THEME[tier.slug];
          return (
            <li key={tier.slug}>
              <StairStep index={i}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-surface p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none sm:p-7",
                    // The recommended plan carries more visual weight than the other two.
                    tier.recommended ? "border-glow shadow-[0_28px_56px_-30px_rgb(162_28_175/0.55)]" : cn("border", TONE[theme.tone].border),
                    STEP_HEIGHT[i],
                  )}
                >
                  <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1.5 bg-linear-to-r", TONE[theme.tone].bar)} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <IconTile icon={theme.icon} tone={theme.tone} />
                    {tier.recommended && <RecommendedBadge />}
                  </div>
                  <h3 className={cn("mt-4 text-2xl font-semibold", TONE[theme.tone].text)}>{tier.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{tier.tagline}</p>

                  <ul className="mt-6 space-y-2.5 text-[15px]">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <CheckCircle size={20} weight="duotone" className={cn("mt-px shrink-0", TONE[theme.tone].text)} aria-hidden="true" />
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
          );
        })}
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
