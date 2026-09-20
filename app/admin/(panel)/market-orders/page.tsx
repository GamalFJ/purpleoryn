import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { formatMarketPrice } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/service";
import { updateMarketOrderPaymentStatus } from "../actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ market?: string }>;

const dateFormat = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });

export default async function MarketOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { market: marketFilter } = await searchParams;
  await requireAdmin();
  const supabase = serviceClient();

  let ordersQuery = supabase.from("orders").select("*, markets(name)").order("created_at", { ascending: false }).limit(200);
  if (marketFilter) ordersQuery = ordersQuery.eq("market_id", marketFilter);

  const [{ data: markets }, { data: orders }] = await Promise.all([supabase.from("markets").select("id, name").order("id"), ordersQuery]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Market orders</h1>
      <p className="mt-2 text-muted">Orders across every market, newest first.</p>

      <nav aria-label="Filter by market" className="mt-6 overflow-x-auto">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/admin/market-orders"
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-200",
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
                href={`/admin/market-orders?market=${m.id}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-200",
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

      {!orders?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-[15px] text-muted">Nothing writes to orders yet — this fills in once a market has a live checkout flow.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {orders.map((order) => (
            <li key={order.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6 sm:p-5">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {order.tier_key} {order.addon ? `+ ${order.addon}` : ""}
                </p>
                <p className="truncate text-sm text-muted">{order.markets?.name ?? order.market_id}</p>
              </div>
              <p className="tabular text-sm text-muted">
                {formatMarketPrice(order.one_time_price, order.currency ?? "USD")} + {formatMarketPrice(order.monthly_price, order.currency ?? "USD")}/mo
              </p>
              <p className="tabular text-sm text-muted">{dateFormat.format(new Date(order.created_at))}</p>
              <form action={updateMarketOrderPaymentStatus.bind(null, order.id)} className="flex items-center gap-2">
                <label htmlFor={`status-${order.id}`} className="sr-only">
                  Payment status
                </label>
                <input
                  id={`status-${order.id}`}
                  name="payment_status"
                  defaultValue={order.payment_status}
                  className="h-9 w-40 rounded-full border border-line bg-paper px-3 text-xs outline-none focus:border-accent"
                />
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
