"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// The one page-load moment. Transform only, no opacity fade, so the hero image
// is painted on the first frame and LCP isn't delayed.
export function HeroImageMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      initial={{ y: 28, scale: 0.97 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.9 }}
    >
      {children}
    </motion.div>
  );
}
