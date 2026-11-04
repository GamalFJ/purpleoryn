import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { MARKET_LEAD_STATUSES, MARKET_LEAD_STATUS_LABEL, type MarketLeadStatus } from "@/lib/marketLeads";
import { serviceClient } from "@/lib/supabase/service";
import { updateMarketLeadStatus } from "../actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ market?: string }>;

const dateFormat = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });

export default async function MarketLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { market: marketFilter } = await searchParams;
  await requireAdmin();
  const supabase = serviceClient();

  let leadsQuery = supabase.from("market_leads").select("*, markets(name)").order("created_at", { ascending: false }).limit(200);
  if (marketFilter) leadsQuery = leadsQuery.eq("market_id", marketFilter);

  const [{ data: markets }, { data: leads }] = await Promise.all([supabase.from("markets").select("id, name").order("id"), leadsQuery]);

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Market leads</h1>
      <p className="mt-1 text-sm text-muted sm:text-base">Inbound inquiries across every market, newest first.</p>

      <nav aria-label="Filter by market" className="mt-6 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/admin/market-leads"
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200",
                !marketFilter
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line bg-surface text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-ink",
              )}
            >
              All
            </Link>
          </li>
          {(markets ?? []).map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/market-leads?market=${m.id}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200",
                  marketFilter === m.id
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-surface text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-ink",
                )}
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {!leads?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold sm:text-xl">No leads yet</h2>
          <p className="mt-2 text-sm text-muted sm:text-[15px]">Inbound form leads and discovery inquiries will populate here.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {leads.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-3 p-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6 sm:p-5">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{lead.name || "No name"}</p>
                <p className="truncate text-xs sm:text-sm text-muted">
                  {lead.business_name || "No business"} · {lead.markets?.name ?? lead.market_id} · {lead.tier_interest ?? "no plan noted"}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <p className="text-xs sm:text-sm text-muted">{lead.channel ?? "—"}</p>
                <p className="tabular text-xs sm:text-sm text-muted">{dateFormat.format(new Date(lead.created_at))}</p>
              </div>
              <form action={updateMarketLeadStatus.bind(null, lead.id)} className="flex items-center gap-2 self-start sm:self-auto">
                <label htmlFor={`status-${lead.id}`} className="sr-only">
                  Status
                </label>
                <select
                  id={`status-${lead.id}`}
                  name="status"
                  defaultValue={lead.status as MarketLeadStatus}
                  className="h-9 rounded-full border border-line bg-paper px-3 text-base sm:text-xs outline-none focus:border-accent"
                >
                  {MARKET_LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {MARKET_LEAD_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-accent/40 hover:text-ink"
                >
                  Save
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
