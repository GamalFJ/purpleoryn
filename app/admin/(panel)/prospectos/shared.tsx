import { cn } from "@/lib/cn";
import { LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";

const dateFormat = new Intl.DateTimeFormat("es-DO", {
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
  contactado: "bg-accent-soft text-accent",
  propuesta: "bg-accent-soft text-ink",
  ganado: "bg-success/15 text-success",
  perdido: "bg-line text-muted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium", BADGE[status] ?? BADGE.perdido)}>
      {LEAD_STATUS_LABEL[status] ?? status}
    </span>
  );
}
