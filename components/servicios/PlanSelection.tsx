"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { isTierSlug, type TierSlug } from "@/lib/tiers";

interface PlanSelectionValue {
  selected: TierSlug | null;
  averageSaleValue: number | null;
  /** Add-on slugs in the order, with any plan. */
  addons: string[];
  select: (slug: TierSlug, source: string, opts?: { scroll?: boolean }) => void;
  setAddon: (slug: string, on: boolean, opts?: { scroll?: boolean }) => void;
  setAverageSaleValue: (value: number | null) => void;
}

const PlanSelectionContext = createContext<PlanSelectionValue | null>(null);

// Shared by the comparison table, the ROI calculator, the add-on section and
// the lead form, so picking a plan or an add-on anywhere preselects it in the
// form (and carries the ROI inputs into the saved lead).
export function PlanSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<TierSlug | null>(null);
  const [averageSaleValue, setAverageSaleValue] = useState<number | null>(null);
  const [addons, setAddons] = useState<string[]>([]);

  const select = useCallback((slug: TierSlug, source: string, opts?: { scroll?: boolean }) => {
    setSelected(slug);
    track("tier_selected", { plan: slug, selection_source: source });
    if (opts?.scroll) {
      document.getElementById("elegir-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const setAddon = useCallback((slug: string, on: boolean, opts?: { scroll?: boolean }) => {
    setAddons((prev) => (on ? (prev.includes(slug) ? prev : [...prev, slug]) : prev.filter((s) => s !== slug)));
    if (opts?.scroll) {
      document.getElementById("elegir-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Links from the AI agent (and anywhere else) can preselect a plan: /servicios?plan=conversion
  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (isTierSlug(plan)) setSelected(plan);
  }, []);

  const value = useMemo(
    () => ({ selected, averageSaleValue, addons, select, setAddon, setAverageSaleValue }),
    [selected, averageSaleValue, addons, select, setAddon],
  );

  return <PlanSelectionContext.Provider value={value}>{children}</PlanSelectionContext.Provider>;
}

export function usePlanSelection() {
  const ctx = useContext(PlanSelectionContext);
  if (!ctx) throw new Error("usePlanSelection must be used inside PlanSelectionProvider");
  return ctx;
}

export function SelectPlanButton({
  slug,
  source,
  className,
  children,
}: {
  slug: TierSlug;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  const { select } = usePlanSelection();
  return (
    <button type="button" className={className} onClick={() => select(slug, source, { scroll: true })}>
      {children}
    </button>
  );
}

// "Add to my order" from the add-on section: checks it in the form and
// scrolls there, the same way SelectPlanButton does for plans.
export function AddAddonButton({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  const { setAddon } = usePlanSelection();
  return (
    <button type="button" className={className} onClick={() => setAddon(slug, true, { scroll: true })}>
      {children}
    </button>
  );
}
