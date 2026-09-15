"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Steps rise in order the first time the plans scroll into view, reinforcing
// that each plan builds on the previous one. `data-reveal` lets the no-JS
// fallback in the root layout show the content.
export function StairStep({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      className="h-full"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.12 }}
    >
      {children}
    </motion.div>
  );
}
