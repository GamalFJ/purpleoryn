"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { IMAGE_RATIOS } from "@/lib/image";
import { SITE } from "@/lib/site";

// Founder photo with a "peek" panel over the lower part: hovering (desktop)
// or tapping (touch) slides the panel away to show the full photo.
export function HeroPeek({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  const firstName = SITE.founder.split(" ")[0];

  return (
    <div
      className={cn(
        "group relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[28px] bg-accent-soft md:max-w-none",
        IMAGE_RATIOS.portrait.className,
      )}
    >
      <Image
        src={src}
        alt={`${SITE.founder}, fundador de ${SITE.name}`}
        fill
        priority
        sizes="(min-width: 768px) 40vw, 90vw"
        className="object-cover object-center"
      />
      <button
        type="button"
        aria-pressed={open}
        onClick={() => setOpen((v) => !v)}
        className="absolute inset-0 cursor-pointer rounded-[inherit] focus-visible:outline-offset-[-4px]"
      >
        <span className="sr-only">{open ? "Tapar la foto" : "Ver la foto completa"}</span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-3 bottom-3 rounded-[20px] bg-plum px-5 py-4 text-left shadow-[0_16px_32px_-16px_rgb(24_15_40/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:translate-y-[calc(100%+1rem)]",
            open && "translate-y-[calc(100%+1rem)]",
          )}
        >
          <span className="block font-display text-xl font-semibold text-plum-ink">Hola, soy {firstName}</span>
          <span className="mt-0.5 block text-sm text-plum-muted">Fundador de {SITE.name}</span>
          <span className="mt-3 inline-flex rounded-full bg-plum-accent/15 px-2.5 py-1 text-xs font-medium text-plum-accent">
            <span className="pointer-coarse:hidden">Pasa el cursor para verme</span>
            <span className="hidden pointer-coarse:inline">Toca para verme</span>
          </span>
        </span>
      </button>
    </div>
  );
}
