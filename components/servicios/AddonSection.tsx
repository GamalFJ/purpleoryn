import { Microphone } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Price } from "@/components/tiers/Price";
import { buttonClass } from "@/components/ui/button";
import { ADDONS_ANCHOR, addonUsageText, type Addon } from "@/lib/addons";
import { formatRD } from "@/lib/format";
import { whatsappUrl } from "@/lib/links";

// Add-ons live in their own section, never as a fourth plan card.
export function AddonSection({ addons }: { addons: Addon[] }) {
  if (!addons.length) return null;

  return (
    <section id={ADDONS_ANCHOR} aria-labelledby="complementos-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <h2 id="complementos-titulo" className="text-3xl font-semibold sm:text-4xl">
        Complementos
      </h2>
      <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-body">Se contratan aparte y se suman a tu plan.</p>

      <ul className="mt-10 space-y-4">
        {addons.map((a) => (
          <li
            key={a.slug}
            className="grid gap-6 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10"
          >
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent" aria-hidden="true">
                <Microphone size={24} weight="duotone" />
              </span>
              <div>
                <h3 className="text-2xl font-semibold">{a.name}</h3>
                {a.description && <p className="mt-2 text-[15px] leading-relaxed text-body">{a.description}</p>}
                <p className="mt-3 text-sm text-muted">{addonUsageText(a)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <p className="font-display text-[2rem] font-semibold leading-none text-warm-ink">
                  <Price amount={a.oneTime} />
                </p>
                <p className="mt-2 text-sm text-muted">
                  pago único, más <span className="tabular text-ink">{formatRD(a.monthly)}</span> al mes
                </p>
              </div>
              <TrackedLink
                href={whatsappUrl(`Hola Purple Cove Labs, quiero información sobre el ${a.name}.`)}
                event="whatsapp_click"
                location={`addon_${a.slug}`}
                className={buttonClass("secondary", "md", "w-full sm:w-fit")}
              >
                Preguntar por WhatsApp
              </TrackedLink>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
