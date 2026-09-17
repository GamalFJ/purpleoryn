"use client";

import { useEffect, useState } from "react";
import { formatCount } from "@/lib/format";
import { useInView } from "@/lib/hooks/useInView";

const DURATION_MS = 1200;

// Counts up to `value` the first time it scrolls into view. Server render and
// reduced motion show the final number directly.
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, armed, inView } = useInView<HTMLSpanElement>(0.6);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!armed) return;
    if (!inView) return setShown(0);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, inView, value]);

  const display = shown ?? value;
  return (
    <span ref={ref} className="tabular">
      <span className="sr-only">
        {formatCount(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        {formatCount(display)}
        {suffix}
      </span>
    </span>
  );
}
