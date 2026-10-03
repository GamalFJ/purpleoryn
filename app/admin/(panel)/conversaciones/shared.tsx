import { QUALIFICATION_KEYS, sanitizeQualification } from "@/lib/agent/qualification";
import type { Tier } from "@/lib/tiers";

export interface SessionOutcome {
  recommended_plan: string | null;
  handoff: string | null;
}

// Conversation state written by /api/chat (chat_apply_state). Labels are plain
// English for the admin; "Requested" for a handoff means only that the visitor
// asked: nothing notifies anyone yet.
export interface SessionStatus {
  state: string | null;
  intent: string | null;
  booking_status: string | null;
  handoff_status: string | null;
}

const STATE_LABEL: Record<string, string> = {
  new: "New",
  inquiry: "General inquiry",
  service_inquiry: "Service inquiry",
  sales_qualification: "Sales qualification",
  plan_recommendation: "Plan recommended",
  booking_intent: "Wants a call",
  booking_offered: "Call button shown",
  booking_confirmed: "Booking confirmed",
  human_handoff_requested: "Asked for a person",
  completed: "Completed",
  unknown_request: "Unclear request",
  external_failure: "Provider failure",
};
const INTENT_LABEL: Record<string, string> = {
  general_inquiry: "General inquiry",
  services: "Services",
  pricing: "Pricing",
  sales: "Sales",
  booking: "Booking",
  human_handoff: "Human handoff",
  unknown: "Unknown",
};
const BOOKING_STATUS_LABEL: Record<string, string> = { offered: "Offered, not confirmed", confirmed: "Confirmed", failed: "Failed" };
const HANDOFF_STATUS_LABEL: Record<string, string> = { requested: "Requested, nobody notified", completed: "Completed", failed: "Failed" };

const label = (map: Record<string, string>, value: string | null) => (value ? (map[value] ?? value) : "None");
export const stateLabel = (value: string | null) => label(STATE_LABEL, value);
export const intentLabel = (value: string | null) => label(INTENT_LABEL, value);
export const bookingStatusLabel = (value: string | null) => label(BOOKING_STATUS_LABEL, value);
export const handoffStatusLabel = (value: string | null) => label(HANDOFF_STATUS_LABEL, value);

const QUALIFICATION_LABEL: Record<(typeof QUALIFICATION_KEYS)[number], string> = {
  business_type: "Business type",
  has_website: "Has a website",
  has_google_profile: "Has a Google Business Profile",
  customer_channel: "How customers find them",
  appointments_or_orders: "Appointments or orders",
  average_sale: "Average sale (RD$)",
  goal: "Goal",
  timing: "Timing",
  pain: "What is not working today",
  business_model: "Sells products, services or both",
  customer_interaction: "How the agent should deal with their customers",
};

// What the visitor told Oryn (chat_sessions.qualification), as label/value rows.
export function qualificationRows(raw: unknown): { label: string; value: string }[] {
  const q = sanitizeQualification(raw);
  return QUALIFICATION_KEYS.filter((key) => q[key] !== undefined).map((key) => {
    const value = q[key];
    return { label: QUALIFICATION_LABEL[key], value: typeof value === "boolean" ? (value ? "Yes" : "No") : String(value) };
  });
}

const HANDOFF_LABEL: Record<string, string> = {
  cal_com: "Offered the call",
  servicios_form: "Sent to the form",
};

// What the agent logged through chat_record_outcome, in plain words.
export function outcomeLabels(session: SessionOutcome, tiers: Tier[]): string[] {
  const labels: string[] = [];
  if (session.recommended_plan) {
    const name = tiers.find((t) => t.slug === session.recommended_plan)?.name ?? session.recommended_plan;
    labels.push(`Recommended ${name}`);
  }
  if (session.handoff) labels.push(HANDOFF_LABEL[session.handoff] ?? session.handoff);
  return labels;
}

export function OutcomeBadges({ labels }: { labels: string[] }) {
  if (!labels.length) return <span className="w-fit whitespace-nowrap rounded-full bg-line px-3 py-1 text-xs font-medium text-muted">No outcome</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {labels.map((l) => (
        <span key={l} className="w-fit whitespace-nowrap rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          {l}
        </span>
      ))}
    </span>
  );
}
