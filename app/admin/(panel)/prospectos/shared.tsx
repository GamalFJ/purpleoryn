import { cn } from "@/lib/cn";
import { LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";

// Admin-only display: English formatting, still in the business's own
// timezone so times match what actually happened locally.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Santo_Domingo",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

const BADGE: Record<LeadStatus, string> = {
  nuevo: "bg-accent text-accent-ink",
  contactado: "bg-teal-soft text-teal-ink",
  propuesta: "bg-warm-soft text-warm-ink",
  ganado: "bg-success/15 text-success",
  perdido: "bg-line text-muted",
};

// A small solid-color dot version of the same palette, used on filter tabs
// and anywhere a compact status indicator (not a full badge) is enough.
export const STATUS_DOT: Record<LeadStatus, string> = {
  nuevo: "bg-accent",
  contactado: "bg-teal",
  propuesta: "bg-warm",
  ganado: "bg-success",
  perdido: "bg-muted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium", BADGE[status] ?? BADGE.perdido)}>
      {LEAD_STATUS_LABEL[status] ?? status}
    </span>
  );
}
