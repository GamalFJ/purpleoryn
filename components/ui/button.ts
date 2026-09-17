import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "onPlum" | "onPlumSecondary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium cursor-pointer select-none transition-[background-color,background-position,border-color,color,transform,box-shadow] duration-300 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Violet→fuchsia gradient that slides on hover (see globals.css).
  primary: "bg-gradient-action text-accent-ink shadow-[0_10px_24px_-14px_rgb(109_47_216/0.8)] hover:shadow-[0_14px_28px_-14px_rgb(162_28_175/0.85)]",
  secondary: "border border-accent/25 bg-surface text-ink hover:border-accent hover:bg-accent-soft hover:text-accent",
  onPlum: "bg-linear-to-r from-plum-accent to-[#f0abfc] text-plum hover:from-plum-ink hover:to-plum-ink",
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
