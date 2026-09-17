// Color tones used for icon tiles, plan identities and accents. Full class
// strings (not built dynamically) so Tailwind can see them.
export type Tone = "violet" | "amber" | "teal" | "rose";

export const TONE: Record<
  Tone,
  { tile: string; text: string; bar: string; border: string; soft: string }
> = {
  violet: {
    tile: "from-accent-soft to-accent/25 text-accent ring-accent/25",
    text: "text-accent",
    bar: "from-accent to-fuchsia",
    border: "border-accent/30",
    soft: "bg-accent-soft",
  },
  amber: {
    tile: "from-warm-soft to-warm/30 text-warm-ink ring-warm/30",
    text: "text-warm-ink",
    bar: "from-warm to-rose",
    border: "border-warm/40",
    soft: "bg-warm-soft",
  },
  teal: {
    tile: "from-teal-soft to-teal/25 text-teal-ink ring-teal/25",
    text: "text-teal-ink",
    bar: "from-teal to-accent",
    border: "border-teal/35",
    soft: "bg-teal-soft",
  },
  rose: {
    tile: "from-rose-soft to-rose/25 text-rose-ink ring-rose/25",
    text: "text-rose-ink",
    bar: "from-rose to-fuchsia",
    border: "border-rose/35",
    soft: "bg-rose-soft",
  },
};
