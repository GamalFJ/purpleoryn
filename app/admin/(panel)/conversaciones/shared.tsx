import type { Tier } from "@/lib/tiers";

export interface SessionOutcome {
  recommended_plan: string | null;
  handoff: string | null;
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
