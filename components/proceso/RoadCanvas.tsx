"use client";

import { useId } from "react";
import { motion, type MotionValue } from "framer-motion";
import type { Road } from "@/lib/proceso";

/**
 * The road itself: asphalt, dashed centre line and the optional side road,
 * revealed by a mask that grows along the path as the section scrolls. The
 * mask is what makes this a road being built rather than a line fading in.
 *
 * `pathLength` cannot be combined with a custom `strokeDasharray` on the same
 * element, so the dashes live on ordinary paths and the animation happens on
 * the mask stroke above them.
 *
 * With `still` (reduced motion) the mask is dropped entirely and the finished
 * road is rendered, rather than animating a motion value to a constant.
 */
export function RoadCanvas({
  road,
  progress,
  branchProgress,
  still,
}: {
  road: Road;
  progress: MotionValue<number>;
  branchProgress: MotionValue<number>;
  still?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const mask = `road-mask-${uid}`;
  const gradient = `road-line-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${road.width} ${road.height}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--fuchsia)" />
        </linearGradient>
        {!still && (
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width={road.width} height={road.height}>
            <motion.path
              data-road-mask
              d={road.path}
              stroke="#fff"
              strokeWidth={44}
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: progress }}
            />
            <motion.path
              data-road-mask
              d={road.branch}
              stroke="#fff"
              strokeWidth={36}
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: branchProgress }}
            />
          </mask>
        )}
      </defs>

      <g mask={still ? undefined : `url(#${mask})`}>
        {/* The optional side road: narrower and dashed, so it never reads as
            one of the seven steps. */}
        <path
          d={road.branch}
          className="stroke-warm/30 dark:stroke-warm/25"
          strokeWidth={20}
          strokeDasharray="26 14"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={road.path}
          className="stroke-accent/15 dark:stroke-accent/20"
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={road.path}
          stroke={`url(#${gradient})`}
          strokeWidth={4}
          strokeDasharray="20 18"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
