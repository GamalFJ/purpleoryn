import { CountUp } from "@/components/ui/CountUp";
import { STATS } from "@/lib/stats";

// Renders nothing until lib/stats.ts has real numbers.
export function Stats() {
  if (!STATS.length) return null;
  return (
    <section aria-label="Datos" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 font-display text-5xl font-semibold leading-none text-ink">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
