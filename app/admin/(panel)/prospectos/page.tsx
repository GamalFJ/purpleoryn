import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";
import { DEFAULT_TIERS, isTierSlug } from "@/lib/tiers";
import { StatusBadge, formatDate } from "./shared";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ estado?: string }>;

export default async function ProspectosPage({ searchParams }: { searchParams: SearchParams }) {
  const { estado } = await searchParams;
  const filter = (LEAD_STATUSES as readonly string[]).includes(estado ?? "") ? (estado as LeadStatus) : null;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("leads")
    .select("id, created_at, plan, name, business, whatsapp, status, source")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter) query = query.eq("status", filter);

  const [{ data: leads }, { data: all }] = await Promise.all([query, supabase.from("leads").select("status")]);
  const counts = new Map<string, number>();
  for (const row of all ?? []) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);

  const planName = (slug: string | null) => DEFAULT_TIERS.find((t) => isTierSlug(slug) && t.slug === slug)?.name ?? "Sin plan";
  const tabs: { key: LeadStatus | null; label: string; count: number }[] = [
    { key: null, label: "Todos", count: all?.length ?? 0 },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: LEAD_STATUS_LABEL[s], count: counts.get(s) ?? 0 })),
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Prospectos</h1>
      <p className="mt-2 text-muted">Solicitudes del formulario de planes, de la más reciente a la más antigua.</p>

      <nav aria-label="Filtrar por estado" className="mt-6 overflow-x-auto">
        <ul className="flex gap-2">
          {tabs.map((t) => (
            <li key={t.label}>
              <Link
                href={t.key ? `/admin/prospectos?estado=${t.key}` : "/admin/prospectos"}
                aria-current={filter === t.key ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-4 py-2 text-sm",
                  filter === t.key ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-muted hover:text-ink",
                )}
              >
                {t.label} <span className="tabular opacity-80">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!leads?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">{filter ? `No hay prospectos en “${LEAD_STATUS_LABEL[filter]}”` : "Todavía no hay prospectos"}</h2>
          <p className="mt-2 text-[15px] text-muted">Cuando alguien envíe el formulario de /servicios, aparecerá aquí.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link href={`/admin/prospectos/${lead.id}`} className="grid gap-1 p-4 hover:bg-accent-soft/50 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:p-5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{lead.name}</p>
                  <p className="truncate text-sm text-muted">
                    {lead.business} · Plan {planName(lead.plan)}
                  </p>
                </div>
                <p className="tabular text-sm text-muted">{formatDate(lead.created_at)}</p>
                <StatusBadge status={lead.status as LeadStatus} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
