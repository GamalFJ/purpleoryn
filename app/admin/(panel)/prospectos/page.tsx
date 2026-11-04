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
      <h1 className="text-2xl font-bold sm:text-3xl">Leads</h1>
      <p className="mt-1 text-sm text-muted sm:text-base">Dominican Republic plan inquiries, newest first.</p>

      <nav aria-label="Filter by status" className="mt-6 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-2">
          {tabs.map((t) => (
            <li key={t.label}>
              <Link
                href={t.key ? `/admin/prospectos?estado=${t.key}` : "/admin/prospectos"}
                aria-current={filter === t.key ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-200",
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
                {t.label} <span className="tabular opacity-80">({t.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!leads?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold sm:text-xl">{filter ? `No leads in "${LEAD_STATUS_LABEL[filter]}"` : "No leads yet"}</h2>
          <p className="mt-2 text-sm text-muted sm:text-[15px]">When someone submits the plan form on /servicios, it shows up here.</p>
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
                  className="flex flex-col gap-2.5 p-4 transition-colors duration-200 hover:bg-accent-soft/50 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6 sm:p-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 sm:block">
                      <p className="truncate font-semibold text-ink sm:font-medium">{lead.name}</p>
                      <div className="sm:hidden">
                        <StatusBadge status={lead.status as LeadStatus} />
                      </div>
                    </div>
                    <p className="truncate text-xs sm:text-sm text-muted mt-0.5">
                      {lead.business} · {planName(lead.plan)} plan
                    </p>
                  </div>
                  <div className="tabular flex items-baseline justify-between gap-4 text-xs sm:flex-col sm:gap-0.5 sm:text-right sm:text-sm">
                    <span className="font-semibold text-accent">{formatRD(totals.oneTime)}</span>
                    <span className="text-warm-ink">{formatRD(totals.monthly)}/mo</span>
                  </div>
                  <p className="tabular text-xs sm:text-sm text-muted">{formatDate(lead.created_at)}</p>
                  <div className="hidden sm:block">
                    <StatusBadge status={lead.status as LeadStatus} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
