import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import type { AddonSnapshot } from "@/lib/addons";
import { cn } from "@/lib/cn";
import { getTiers } from "@/lib/content";
import { formatRD } from "@/lib/format";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";
import { orderTotals } from "@/lib/orders";
import { STATUS_DOT, StatusBadge, formatDate } from "./shared";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ estado?: string }>;

export default async function ProspectosPage({ searchParams }: { searchParams: SearchParams }) {
  const { estado } = await searchParams;
  const filter = (LEAD_STATUSES as readonly string[]).includes(estado ?? "") ? (estado as LeadStatus) : null;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("leads")
    .select("id, created_at, plan, addons, name, business, whatsapp, status, source")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter) query = query.eq("status", filter);

  // Live plan names (DEFAULT_TIERS only if the tiers table is unreachable).
  const [{ data: leads }, { data: all }, tiers] = await Promise.all([query, supabase.from("leads").select("status"), getTiers()]);
  const counts = new Map<string, number>();
  for (const row of all ?? []) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);

  const planName = (slug: string | null) => tiers.find((t) => t.slug === slug)?.name ?? "No plan";
  const tabs: { key: LeadStatus | null; label: string; count: number }[] = [
    { key: null, label: "All", count: all?.length ?? 0 },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: LEAD_STATUS_LABEL[s], count: counts.get(s) ?? 0 })),
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Leads</h1>
      <p className="mt-2 text-muted">Plan form submissions, newest first.</p>

      <nav aria-label="Filter by status" className="mt-6 overflow-x-auto">
        <ul className="flex gap-2">
          {tabs.map((t) => (
            <li key={t.label}>
              <Link
                href={t.key ? `/admin/prospectos?estado=${t.key}` : "/admin/prospectos"}
                aria-current={filter === t.key ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                  filter === t.key
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-surface text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-ink",
                )}
              >
                {t.key && (
                  <span
                    aria-hidden="true"
                    className={cn("h-2 w-2 shrink-0 rounded-full", filter === t.key ? "bg-accent-ink" : STATUS_DOT[t.key])}
                  />
                )}
                {t.label} <span className="tabular opacity-80">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!leads?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">{filter ? `No leads in "${LEAD_STATUS_LABEL[filter]}"` : "No leads yet"}</h2>
          <p className="mt-2 text-[15px] text-muted">When someone submits the plan form on /servicios, it shows up here.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {leads.map((lead) => {
            const plan = tiers.find((t) => t.slug === lead.plan);
            const addons: AddonSnapshot[] = Array.isArray(lead.addons) ? (lead.addons as AddonSnapshot[]) : [];
            const totals = orderTotals(plan, addons);
            return (
              <li key={lead.id}>
                <Link
                  href={`/admin/prospectos/${lead.id}`}
                  className="grid gap-2 p-4 transition-colors duration-200 hover:bg-accent-soft/50 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6 sm:p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lead.name}</p>
                    <p className="truncate text-sm text-muted">
                      {lead.business} · {planName(lead.plan)} plan
                    </p>
                  </div>
                  <div className="tabular flex gap-4 text-sm sm:flex-col sm:gap-0.5 sm:text-right">
                    <span className="font-medium text-accent">{formatRD(totals.oneTime)}</span>
                    <span className="text-warm-ink">{formatRD(totals.monthly)}/mo</span>
                  </div>
                  <p className="tabular text-sm text-muted">{formatDate(lead.created_at)}</p>
                  <StatusBadge status={lead.status as LeadStatus} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
