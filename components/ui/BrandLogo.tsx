import Image from "next/image";
import { cn } from "@/lib/cn";
import { LOGOS, type LogoKey } from "@/lib/logos";

// Brand logo with no backing tile. Decorative (alt=""): always pair it with
// the brand name as visible or screen-reader text.
export function BrandLogo({ logo, size = 20, className }: { logo: LogoKey; size?: number; className?: string }) {
  const entry: { src: string; mono?: boolean } = LOGOS[logo];
  return (
    <Image
      src={entry.src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-contain", entry.mono && "dark:invert", className)}
    />
  );
}
