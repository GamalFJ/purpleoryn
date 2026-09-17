import { ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

// Name treatment for the Oryn ROI method, used wherever the calculator appears.
export function RoiBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-warm px-3 py-1 text-sm font-semibold text-on-warm",
        className,
      )}
    >
      <ChartLineUp size={16} weight="bold" aria-hidden="true" />
      Método Oryn ROI
    </span>
  );
}
