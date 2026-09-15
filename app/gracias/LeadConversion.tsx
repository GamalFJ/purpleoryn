"use client";

import { useEffect } from "react";
import { LEAD_FLAG, track } from "@/lib/analytics";

// Fires GA4's generate_lead once per real submission: the form sets the flag
// right before redirecting here, and it's cleared so a refresh or a direct
// visit to /gracias doesn't count as another lead.
export function LeadConversion({ plan }: { plan?: string }) {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(LEAD_FLAG)) return;
      sessionStorage.removeItem(LEAD_FLAG);
    } catch {
      return;
    }
    track("generate_lead", { plan, form: "servicios_plan" });
  }, [plan]);
  return null;
}
