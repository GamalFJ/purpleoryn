"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import { BRANCH, STEPS, type Road } from "@/lib/proceso";
import { TONE } from "@/lib/tone";
import { RoadCanvas } from "./RoadCanvas";
import { useStill } from "./useStill";
import { useUnfoldProgress } from "./useUnfoldProgress";

/**
 * The seven steps as a wrapped grid instead of a tall vertical scroll: the
 * whole road is visible at once, at any screen size, with nothing to scroll
 * past. The connecting line isn't hand-authored geometry like the homepage
 * teaser's; the grid reflows per breakpoint, so the line is measured from
 * the cards' actual rendered positions and rebuilt on resize.
 *
 * Each card's detail never changes the card's own size (it opens as an
 * overlay, not an inline expansion), so the grid's height never shifts while
 * a visitor is hovering or tapping, which is what keeps "no scrolling to see
 * the whole thing" true even mid-interaction, not just on first paint.
 */
function buildConnectorPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const segments = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    if (Math.abs(prev.y - cur.y) < 4) {
      // Same row: a straight run to the next card.
      segments.push(`L ${cur.x} ${cur.y}`);
    } else {
      // Row wrap: ease from one row to the next as a diagonal S-curve. The
      // control points are offset mostly VERTICALLY from their own anchor
      // (not horizontally toward the far end), so the curve eases smoothly
      // without ballooning across the cards in between rows.
      const bend = (cur.y - prev.y) * 0.6;
      segments.push(`C ${prev.x} ${prev.y + bend}, ${cur.x} ${cur.y - bend}, ${cur.x} ${cur.y}`);
    }
  }
  return segments.join(" ");
}

export function RoadGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [road, setRoad] = useState<Road | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const still = useStill();
  // Reuses the container ref for the "has this entered the viewport yet"
  // trigger, since it's already the real, normally-rendered element.
  const { ref: inViewRef, progress } = useUnfoldProgress(still);

  // Guards setRoad so a ResizeObserver firing on an unrelated reflow (a peek
  // panel opening, focus scrolling, anything that nudges the container's box
  // without truly changing the grid's shape) never triggers a state update.
  // Without this, that state update re-renders every card mid-click and cuts
  // off the panel's own opacity transition before the browser paints it.
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const points = nodeRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - containerRect.left + r.width / 2, y: r.top - containerRect.top + r.height / 2 };
      });
      const path = buildConnectorPath(points);
      const signature = `${Math.round(containerRect.width)}x${Math.round(containerRect.height)}:${path}`;
      if (signature === lastPathRef.current) return;
      lastPathRef.current = signature;
      setRoad({
        width: containerRect.width,
        height: containerRect.height,
        path,
        branch: "",
        nodes: points.map((p) => ({ ...p, side: "right" as const })),
      });
    };

    measure();
    // Cards never resize on hover/tap (the detail is an overlay, not an
    // inline expansion), so this only ever needs to fire on real reflow:
    // a breakpoint change, font load, or window resize.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <div
        ref={(el) => {
          containerRef.current = el;
          inViewRef.current = el;
        }}
        className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
      >
        {road && <RoadCanvas road={road} progress={progress} branchProgress={progress} still={still} />}
        {STEPS.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            open={open === step.id}
            onOpen={setOpen}
            bindRef={(el) => {
              nodeRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* The branch: visually distinct, not part of the measured connector,
          joined to the grid above by a short dashed drop instead. */}
      <div className="mt-3 flex flex-col items-center">
        <span aria-hidden="true" className="h-6 w-px border-l-2 border-dashed border-warm/50" />
        <BranchCard open={open === BRANCH.id} onOpen={setOpen} />
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  open,
  onOpen,
  bindRef,
}: {
  step: (typeof STEPS)[number];
  index: number;
  open: boolean;
  onOpen: (id: string | null) => void;
  bindRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <motion.div
      ref={bindRef}
      data-reveal
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      className={cn("group relative flex flex-col items-center text-center", open ? "z-30" : "z-10")}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`paso-${step.id}`}
        onClick={() => onOpen(open ? null : step.id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(step.id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onOpen(null)}
        onFocus={() => onOpen(step.id)}
        onBlur={() => onOpen(null)}
        className="relative flex cursor-pointer flex-col items-center rounded-[1.15rem] bg-paper p-1 focus-visible:outline-offset-4"
      >
        <span className="relative block">
          <IconTile icon={step.icon} tone={step.tone} size="lg" />
          <span
            aria-hidden="true"
            className="tabular absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-accent to-fuchsia text-[11px] font-semibold text-accent-ink ring-2 ring-paper"
          >
            {step.number}
          </span>
        </span>
        <span className="sr-only">
          Paso {step.number}: {step.title}
        </span>
        <span aria-hidden="true" className="mt-2.5 block max-w-[9rem] text-[13px] font-semibold leading-tight text-ink">
          {step.short}
        </span>
      </button>

      <div
        id={`paso-${step.id}`}
        role="group"
        aria-label={step.title}
        aria-hidden={!open}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full z-20 mt-2 rounded-[var(--radius-panel)] border border-accent/25 bg-surface p-4 text-left shadow-[0_28px_60px_-32px_rgb(28_16_48/0.6)]",
          "transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        <p className={cn("text-[15px] font-semibold leading-snug", TONE[step.tone].text)}>
          {step.number}. {step.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-body">{step.detail}</p>
      </div>
    </motion.div>
  );
}

function BranchCard({ open, onOpen }: { open: boolean; onOpen: (id: string | null) => void }) {
  return (
    <div className="relative w-full max-w-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`paso-${BRANCH.id}`}
        onClick={() => onOpen(open ? null : BRANCH.id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(BRANCH.id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && onOpen(null)}
        onFocus={() => onOpen(BRANCH.id)}
        onBlur={() => onOpen(null)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-panel)] border border-dashed border-warm/60 bg-warm-soft/60 px-5 py-4 text-left focus-visible:outline-offset-4"
      >
        <IconTile icon={BRANCH.icon} tone={BRANCH.tone} size="md" />
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-warm-ink">{BRANCH.title}</span>
          <span className="block text-sm text-body">Opcional, con cualquier plan</span>
        </span>
      </button>

      <div
        id={`paso-${BRANCH.id}`}
        role="group"
        aria-label={BRANCH.title}
        aria-hidden={!open}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full z-20 mt-2 rounded-[var(--radius-panel)] border border-warm/40 bg-surface p-4 text-left shadow-[0_28px_60px_-32px_rgb(28_16_48/0.6)]",
          "transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        <p className="text-[15px] font-semibold leading-snug text-warm-ink">{BRANCH.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-body">{BRANCH.detail}</p>
      </div>
    </div>
  );
}
