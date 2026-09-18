"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import { ROAD_DESKTOP, ROAD_MOBILE, WAYPOINTS, type Road, type Waypoint } from "@/lib/proceso";
import { TONE } from "@/lib/tone";
import { RoadCanvas } from "./RoadCanvas";
import { useStill } from "./useStill";

// The road is drawn twice, once per breakpoint, because the desktop serpentine
// and the mobile one are different shapes. Only one is ever displayed, and
// `display: none` keeps the other out of the accessibility tree as well.
export function RoadMap() {
  return (
    <>
      <RoadFigure road={ROAD_DESKTOP} scope="ancho" className="hidden md:block" />
      <RoadFigure road={ROAD_MOBILE} scope="movil" className="md:hidden" />
    </>
  );
}

/** First y coordinate of the side road, used to time when it starts drawing. */
function branchStartY(d: string): number {
  const m = /^M\s*([\d.]+)[\s,]+([\d.]+)/.exec(d.trim());
  return m ? Number(m[2]) : 0;
}

/** Node position as CSS: percentages of the container, which is aspect-locked. */
function nodeVars(node: Road["nodes"][number], road: Road): CSSProperties {
  const x = (node.x / road.width) * 100;
  return {
    "--x": `${x}%`,
    "--rx": `${100 - x}%`,
    "--y": `${(node.y / road.height) * 100}%`,
  } as CSSProperties;
}

function RoadFigure({ road, scope, className }: { road: Road; scope: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const [open, setOpen] = useState<string | null>(null);

  // useScroll, never a scroll listener: this stays off the React render path.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, restDelta: 0.001 });

  const branchAt = branchStartY(road.branch) / road.height;
  const branchProgress = useTransform(progress, [branchAt, branchAt + 0.1], [0, 1]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto w-full max-w-5xl", className)}
      style={{ aspectRatio: `${road.width} / ${road.height}` }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setOpen(null);
      }}
    >
      <RoadCanvas road={road} progress={progress} branchProgress={branchProgress} still={still} />

      {WAYPOINTS.map((point, i) => (
        <Marker
          key={point.id}
          point={point}
          node={road.nodes[i]}
          road={road}
          scope={scope}
          progress={progress}
          still={still}
          open={open === point.id}
          onOpen={setOpen}
        />
      ))}

      {/* Panels are siblings of the markers so they can be positioned against
          the road container: full width on mobile, beside the bend on desktop. */}
      {WAYPOINTS.map((point, i) => (
        <Panel key={point.id} point={point} node={road.nodes[i]} road={road} scope={scope} open={open === point.id} />
      ))}
    </div>
  );
}

function Marker({
  point,
  node,
  road,
  scope,
  progress,
  still,
  open,
  onOpen,
}: {
  point: Waypoint;
  node: Road["nodes"][number];
  road: Road;
  scope: string;
  progress: MotionValue<number>;
  still: boolean;
  open: boolean;
  onOpen: (id: string | null) => void;
}) {
  // Each waypoint arrives as the road reaches it, so the drawing and the
  // markers read as one movement instead of two competing ones.
  const at = node.y / road.height;
  const opacity = useTransform(progress, [at - 0.1, at - 0.02], [0, 1]);
  const scale = useTransform(progress, [at - 0.1, at - 0.02], [0.5, 1]);
  const isBranch = point.number === null;

  return (
    // Two elements on purpose: the outer one owns the positioning transform,
    // the inner one owns the animated one. Sharing them would let Motion's
    // `scale` (and the no-JS `transform: none` fallback) drop the centring.
    <div
      style={nodeVars(node, road)}
      className="absolute left-[var(--x)] top-[var(--y)] z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div data-reveal className="group relative" style={still ? undefined : { opacity, scale }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`paso-${scope}-${point.id}`}
        onClick={() => onOpen(open ? null : point.id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(point.id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onOpen(null)}
        onFocus={() => onOpen(point.id)}
        onBlur={() => onOpen(null)}
        className="relative block cursor-pointer rounded-[1.15rem] bg-paper p-1 focus-visible:outline-offset-4"
      >
        <IconTile icon={point.icon} tone={point.tone} size="lg" />
        {point.number ? (
          <span
            aria-hidden="true"
            className="tabular absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-accent to-fuchsia text-[11px] font-semibold text-accent-ink ring-2 ring-paper"
          >
            {point.number}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-1.5 rounded-full bg-warm-soft px-2 py-0.5 text-[10px] font-semibold text-warm-ink ring-2 ring-paper"
          >
            Opcional
          </span>
        )}
        {/* The only text the button exposes: the visible number, pill and
            caption are all decorative duplicates of it. */}
        <span className="sr-only">
          {point.number ? `Paso ${point.number}: ${point.title}` : `Opcional: ${point.title}`}
        </span>
      </button>

      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-full mt-2.5 block w-32 -translate-x-1/2 text-center text-[13px] font-semibold leading-tight",
          isBranch ? "text-warm-ink" : "text-ink",
        )}
      >
        {point.short}
      </span>
      </motion.div>
    </div>
  );
}

function Panel({
  point,
  node,
  road,
  scope,
  open,
}: {
  point: Waypoint;
  node: Road["nodes"][number];
  road: Road;
  // The two roads are both in the DOM, so their panel ids must not collide.
  scope: string;
  open: boolean;
}) {
  const isBranch = point.number === null;

  return (
    <div
      id={`paso-${scope}-${point.id}`}
      role="group"
      aria-label={point.title}
      style={nodeVars(node, road)}
      className={cn(
        "pointer-events-none absolute z-20 left-0 right-0 top-[var(--y)] md:w-80",
        node.side === "right"
          ? "md:left-[calc(var(--x)_+_3.5rem)] md:right-auto"
          : "md:right-[calc(var(--rx)_+_3.5rem)] md:left-auto",
        "rounded-[var(--radius-panel)] border bg-surface p-5 shadow-[0_28px_60px_-32px_rgb(28_16_48/0.6)]",
        "transition-[opacity,translate,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        isBranch ? "border-warm/40" : "border-accent/25",
        open ? "visible translate-y-[-50%] opacity-100" : "invisible translate-y-[calc(-50%_+_0.5rem)] opacity-0",
      )}
    >
      <p className={cn("text-[15px] font-semibold leading-snug", isBranch ? "text-warm-ink" : TONE[point.tone].text)}>
        {point.number ? `${point.number}. ${point.title}` : point.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-body">{point.detail}</p>
    </div>
  );
}
