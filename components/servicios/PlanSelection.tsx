"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { isTierSlug, type TierSlug } from "@/lib/tiers";

interface PlanSelectionValue {
  selected: TierSlug | null;
  averageSaleValue: number | null;
  select: (slug: TierSlug, source: string, opts?: { scroll?: boolean }) => void;
  setAverageSaleValue: (value: number | null) => void;
}

const PlanSelectionContext = createContext<PlanSelectionValue | null>(null);

// Shared by the comparison table, the ROI calculator and the lead form, so
// picking a plan anywhere preselects it in the form (and carries the ROI
// inputs into the saved lead).
export function PlanSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<TierSlug | null>(null);
  const [averageSaleValue, setAverageSaleValue] = useState<number | null>(null);

  const select = useCallback((slug: TierSlug, source: string, opts?: { scroll?: boolean }) => {
    setSelected(slug);
    track("tier_selected", { plan: slug, selection_source: source });
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
    () => ({ selected, averageSaleValue, select, setAverageSaleValue }),
    [selected, averageSaleValue, select],
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
