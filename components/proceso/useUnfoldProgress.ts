"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, type MotionValue } from "framer-motion";

const DRAW = { duration: 1.3, ease: [0.16, 1, 0.3, 1] as const };

/**
 * "Unfold as soon as the visitor gets to it": the road draws itself once,
 * in place, the moment its container enters the viewport, rather than being
 * tied to how far the visitor has scrolled through it.
 *
 * The trigger must watch a normally-rendered element: `<mask>` children (what
 * RoadCanvas animates) aren't painted, and browsers report a zero-size layout
 * box for them, so IntersectionObserver on the path itself would never fire.
 * `ref` goes on the real container; the resulting `progress` is piped into
 * RoadCanvas exactly like a scroll-linked value would be, so RoadCanvas needs
 * no changes to consume it.
 */
export function useUnfoldProgress(still: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(still ? 1 : 0);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  useEffect(() => {
    if (still) {
      progress.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(progress, 1, DRAW);
    return () => controls.stop();
  }, [inView, still, progress]);

  return { ref, progress: progress as MotionValue<number> };
}
