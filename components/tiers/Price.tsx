import { formatRD } from "@/lib/format";
import { cn } from "@/lib/cn";

// Full price stays one string for screen readers and copy/paste; the cents are
// only visually de-emphasised.
export function Price({ amount, className }: { amount: number; className?: string }) {
  const full = formatRD(amount);
  const [whole, cents] = full.split(".");
  return (
    <span className={cn("tabular whitespace-nowrap", className)} aria-label={full}>
      <span aria-hidden="true">
        {whole}
        <span className="text-[0.6em] align-[0.55em]">.{cents}</span>
      </span>
    </span>
  );
}
