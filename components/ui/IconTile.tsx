import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { TONE, type Tone } from "@/lib/tone";

const SIZE = {
  sm: { box: "h-9 w-9 rounded-xl", icon: 20 },
  md: { box: "h-12 w-12 rounded-2xl", icon: 26 },
  lg: { box: "h-14 w-14 rounded-2xl", icon: 30 },
};

// Duotone icon on a soft gradient tile with an inner highlight, so icons read
// as objects rather than flat glyphs. Decorative: pair it with visible text.
export function IconTile({
  icon: IconComponent,
  tone = "violet",
  size = "md",
  className,
}: {
  icon: Icon;
  tone?: Tone;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const s = SIZE[size];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-linear-to-br shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_8px_18px_-12px_rgb(28_16_48/0.45)] ring-1 ring-inset transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-3 motion-reduce:transition-none dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
        s.box,
        TONE[tone].tile,
        className,
      )}
    >
      <IconComponent size={s.icon} weight="duotone" />
    </span>
  );
}
