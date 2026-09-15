"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

// Reduced motion is handled here, once. Server-rendered motion components must
// NOT branch `initial` on useReducedMotion(): the server can't read the media
// query, so the SSR'd hidden state never gets revealed for those visitors.
// With reducedMotion="user", transforms are skipped and only opacity animates.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
