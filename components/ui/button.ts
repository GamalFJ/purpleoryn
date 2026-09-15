import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "onPlum" | "onPlumSecondary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium cursor-pointer select-none transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover",
  secondary: "border border-line bg-surface text-ink hover:border-accent hover:text-accent",
  onPlum: "bg-plum-accent text-plum hover:bg-plum-ink",
  onPlumSecondary: "border border-plum-muted/40 text-plum-ink hover:border-plum-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px] sm:text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
