"use client";

import { type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { ROAD_TEASER, WAYPOINTS, type Road, type Waypoint } from "@/lib/proceso";
import { RoadCanvas } from "./RoadCanvas";
import { useStill } from "./useStill";
import { useUnfoldProgress } from "./useUnfoldProgress";

// The homepage version of the road: the same eight waypoints read left to
// right, with nothing to expand. The full page is where the detail lives.
export function RoadTeaserGraphic() {
  const still = useStill();
  const road = ROAD_TEASER;

  // Unfolds once, as soon as the teaser scrolls into view, rather than being
  // tied to how far past it the visitor has scrolled.
  const { ref, progress } = useUnfoldProgress(still);
  const branchProgress = useTransform(progress, [0.62, 0.9], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-4xl"
      style={{ aspectRatio: `${road.width} / ${road.height}` }}
    >
      <RoadCanvas road={road} progress={progress} branchProgress={branchProgress} still={still} />
      <ol className="contents">
        {WAYPOINTS.map((point, i) => (
          <TeaserDot
            key={point.id}
            point={point}
            node={road.nodes[i]}
            road={road}
            progress={progress}
            still={still}
          />
        ))}
      </ol>
    </div>
  );
}

function TeaserDot({
  point,
  node,
  road,
  progress,
  still,
}: {
  point: Waypoint;
  node: Road["nodes"][number];
  road: Road;
  progress: MotionValue<number>;
  still: boolean;
}) {
  // This road runs left to right, so a dot arrives with its own x position.
  const at = node.x / road.width;
  const opacity = useTransform(progress, [at - 0.12, at], [0, 1]);
  const isBranch = point.number === null;
  const Icon = point.icon;

  return (
    <li
      style={
        {
          "--x": `${(node.x / road.width) * 100}%`,
          "--y": `${(node.y / road.height) * 100}%`,
        } as CSSProperties
      }
      className="absolute left-[var(--x)] top-[var(--y)] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.span data-reveal className="block" style={still ? undefined : { opacity }}>
      <span
        aria-hidden="true"
        className={cn(
          "tabular flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-paper md:h-10 md:w-10 md:text-[13px]",
          isBranch
            ? "border border-dashed border-warm/70 bg-warm-soft text-warm-ink"
            : "bg-linear-to-br from-accent to-fuchsia text-accent-ink",
        )}
      >
        {isBranch ? <Icon size={16} weight="duotone" aria-hidden="true" /> : point.number}
      </span>
      <span className="sr-only">{isBranch ? point.title : `${point.number}. ${point.title}`}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-full mt-2 hidden w-24 -translate-x-1/2 text-center text-xs font-medium leading-tight md:block",
          isBranch ? "text-warm-ink" : "text-muted",
        )}
      >
        {point.short}
      </span>
      </motion.span>
    </li>
  );
}
