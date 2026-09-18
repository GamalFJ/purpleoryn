"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * "Render the finished road instead of animating it."
 *
 * The server cannot read the media query, so branching the rendered tree on
 * `useReducedMotion()` alone produces a hydration mismatch (see the note in
 * MotionProvider). This stays false through hydration and flips afterwards, so
 * the first client render always matches the server and the visitor who asked
 * for less motion still gets the road already built.
 */
export function useStill(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}
