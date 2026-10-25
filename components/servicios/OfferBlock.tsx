import { Gift, ShieldCheck, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { OFFER_HEADING, OFFER_POINTS } from "@/lib/offer";

const ICONS = { garantia: ShieldCheck, bonos: Gift, cupos: UsersThree } as const;
const TONES = { garantia: "teal", bonos: "violet", cupos: "amber" } as const;

export function OfferBlock() {
  return (
    <section id="garantia-bonos-cupos" aria-labelledby="oferta-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <h2 id="oferta-titulo" className="text-3xl font-semibold sm:text-4xl">
        {OFFER_HEADING}
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
        {OFFER_POINTS.map((p) => (
          <li key={p.id} className="group rounded-[var(--radius-panel)] border border-line bg-surface p-6">
            <IconTile icon={ICONS[p.id]} tone={TONES[p.id]} size="lg" />
            <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
