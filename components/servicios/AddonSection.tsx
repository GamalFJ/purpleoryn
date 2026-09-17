import Image from "next/image";
import { Microphone, PhoneCall } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Price } from "@/components/tiers/Price";
import { buttonClass } from "@/components/ui/button";
import { IconTile } from "@/components/ui/IconTile";
import { ADDONS_ANCHOR, addonUsageText, type Addon } from "@/lib/addons";
import { formatRD } from "@/lib/format";
import { whatsappUrl } from "@/lib/links";

// Technology behind each add-on, keyed by slug. ElevenLabs logo from
// gilbarbara/logos; Retell has no logo in svgl, logos or developer-icons, so
// it shows a neutral icon with its name.
const PROVIDERS: Record<string, { name: string; logo: string | null }[]> = {
  "agente-de-voz": [
    { name: "Retell AI", logo: null },
    { name: "ElevenLabs", logo: "/media/logos/elevenlabs.svg" },
  ],
};

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
            className="group relative grid gap-6 overflow-hidden rounded-[var(--radius-panel)] border border-teal/30 bg-linear-to-br from-teal-soft via-surface to-accent-soft/60 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-teal via-accent to-fuchsia" />
            <div className="flex gap-4">
              <IconTile icon={Microphone} tone="teal" size="lg" className="animate-float" />
              <div>
                <h3 className="text-2xl font-semibold text-teal-ink">{a.name}</h3>
                {a.description && <p className="mt-2 text-[15px] leading-relaxed text-body">{a.description}</p>}
                <p className="mt-3 text-sm font-medium text-ink">{addonUsageText(a)}</p>
                {PROVIDERS[a.slug] && (
                  <div className="mt-5">
                    <p className="text-sm text-body">Con tecnología de</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {PROVIDERS[a.slug].map((p) => (
                        <li
                          key={p.name}
                          className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5 text-sm font-medium text-ink"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
                            {p.logo ? (
                              <Image src={p.logo} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                            ) : (
                              <PhoneCall size={16} weight="duotone" className="text-teal-ink" aria-hidden="true" />
                            )}
                          </span>
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-teal/25 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <p className="font-display text-[2rem] font-semibold leading-none text-warm-ink">
                  <Price amount={a.oneTime} />
                </p>
                <p className="mt-2 text-sm text-body">
                  pago único, más <span className="tabular font-semibold text-ink">{formatRD(a.monthly)}</span> al mes
                </p>
              </div>
              <TrackedLink
                href={whatsappUrl(`Hola Purple Cove Labs, quiero información sobre el ${a.name}.`)}
                event="whatsapp_click"
                location={`addon_${a.slug}`}
                className={buttonClass("primary", "md", "w-full sm:w-fit")}
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
