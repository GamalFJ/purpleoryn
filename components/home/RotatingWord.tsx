"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 2400;

// Cycles one word in place. All words share one grid cell, so the line never
// changes width. Screen readers get the full list once (see the caller);
// reduced motion keeps the first word.
export function RotatingWord({ words }: { words: string[] }) {
  const [{ index, prev }, setState] = useState({ index: 0, prev: -1 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setState(({ index: i }) => ({ index: (i + 1) % words.length, prev: i }));
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span aria-hidden="true" className="inline-grid align-bottom">
      {words.map((word, i) => (
        <span
          key={word}
          // Sequential, not a crossfade: the old word leaves upward first,
          // then the new one rises in.
          className={cn(
            "[grid-area:1/1] text-accent transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            i === index && "translate-y-0 opacity-100 delay-200 duration-500",
            i === prev && "-translate-y-2 opacity-0 duration-200",
            i !== index && i !== prev && "translate-y-2 opacity-0 duration-0",
          )}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
