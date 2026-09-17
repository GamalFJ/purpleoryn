import { cn } from "@/lib/cn";

export function RecommendedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full bg-warm px-2.5 py-0.5 text-xs font-semibold text-on-warm", className)}>
      Recomendado
    </span>
  );
}
