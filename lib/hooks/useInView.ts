"use client";

import { useEffect, useRef, useState } from "react";

// One-shot "has this scrolled into view" flag via IntersectionObserver.
// `armed` is true only when the element starts out of view and motion is
// allowed, so callers hide content just long enough to reveal it; with no JS,
// no IntersectionObserver or reduced motion, content simply stays visible.
export function useInView<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) setArmed(true);
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  return { ref, armed, inView };
}
