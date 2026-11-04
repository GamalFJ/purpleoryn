"use client";

import { useMemo, useState } from "react";
import {
  CurrencyCircleDollar,
  MagnifyingGlass,
  Receipt,
  TrendUp,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { formatMarketPrice } from "@/lib/format";
import { OrderCard, type OrderItem } from "./OrderCard";

export function OrdersDashboardClient({
  initialOrders,
  markets,
}: {
  initialOrders: OrderItem[];
  markets: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_upfront" | "highest_monthly">("newest");

  // Filter calculations
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return initialOrders
      .filter((o) => {
        // Market filter
        if (selectedMarket !== "all" && o.marketId !== selectedMarket) return false;

        // Payment status filter
        if (selectedStatus !== "all") {
          if (selectedStatus === "pending" && o.paymentStatus !== "pending_first_payment") return false;
          if (selectedStatus === "paid" && o.paymentStatus !== "paid") return false;
          if (selectedStatus === "partially_paid" && o.paymentStatus !== "partially_paid") return false;
          if (selectedStatus === "cancelled" && o.paymentStatus !== "cancelled") return false;
        }

        // Search text
        if (q) {
          const matchName = o.clientName.toLowerCase().includes(q);
          const matchBiz = o.businessName.toLowerCase().includes(q);
          const matchPhone = o.phone.toLowerCase().includes(q);
          const matchEmail = (o.email || "").toLowerCase().includes(q);
          const matchId = o.id.toLowerCase().includes(q);
          const matchTier = o.tierName.toLowerCase().includes(q);
          const matchNotes = (o.notes || "").toLowerCase().includes(q);
          return matchName || matchBiz || matchPhone || matchEmail || matchId || matchTier || matchNotes;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "highest_upfront") {
          return b.oneTimePrice - a.oneTimePrice;
        }
        if (sortBy === "highest_monthly") {
          return b.monthlyPrice - a.monthlyPrice;
        }
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [initialOrders, search, selectedMarket, selectedStatus, sortBy]);

  // Overall KPIs
  const stats = useMemo(() => {
    let pendingCount = 0;
    let paidCount = 0;
    let pendingOwedUSD = 0;
    let paidUSD = 0;
    let totalMonthlyUSD = 0;

    for (const o of initialOrders) {
      if (o.paymentStatus === "paid") {
        paidCount++;
        paidUSD += o.oneTimePrice;
      } else if (o.paymentStatus !== "cancelled") {
        pendingCount++;
        pendingOwedUSD += o.oneTimePrice;
      }
      totalMonthlyUSD += o.monthlyPrice;
    }

    return {
      total: initialOrders.length,
      pendingCount,
      paidCount,
      pendingOwedUSD,
      paidUSD,
      totalMonthlyUSD,
    };
  }, [initialOrders]);

  // Market counts
  const marketCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialOrders.length };
    for (const o of initialOrders) {
      counts[o.marketId] = (counts[o.marketId] || 0) + 1;
    }
    return counts;
  }, [initialOrders]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { all: initialOrders.length, pending: 0, paid: 0, partially_paid: 0, cancelled: 0 };
    for (const o of initialOrders) {
      if (o.paymentStatus === "pending_first_payment") counts.pending++;
      else if (o.paymentStatus === "paid") counts.paid++;
      else if (o.paymentStatus === "partially_paid") counts.partially_paid++;
      else if (o.paymentStatus === "cancelled") counts.cancelled++;
    }
    return counts;
  }, [initialOrders]);

  const flags: Record<string, string> = {
    us: "🇺🇸",
    ca: "🇨🇦",
    ht: "🇭🇹",
    do: "🇩🇴",
  };

  return (
    <div className="space-y-6">
      {/* ─── Page Title & Overview ────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Client Orders</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            Verified orders with full client contact dossiers, chosen plans, amount owed, and payment tracking.
          </p>
        </div>
      </div>

      {/* ─── Metric Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Orders */}
        <div className="rounded-xl border border-line bg-surface p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Receipt size={16} className="text-accent" />
            <span>Total Orders</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-ink sm:text-2xl tabular-nums">
            {stats.total}
          </p>
          <p className="text-[11px] text-muted mt-0.5">Across all markets</p>
        </div>

        {/* Money Owed Upfront */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Wallet size={16} />
            <span>Owed Upfront</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-amber-300 sm:text-2xl tabular-nums">
            {stats.pendingCount} <span className="text-xs font-medium text-amber-200">orders</span>
          </p>
          <p className="text-[11px] text-amber-200/80 mt-0.5">
            Awaiting deposit
          </p>
        </div>

        {/* Paid Revenue */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CurrencyCircleDollar size={16} />
            <span>Paid in Full</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-emerald-400 sm:text-2xl tabular-nums">
            {stats.paidCount} <span className="text-xs font-medium text-emerald-300">orders</span>
          </p>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">Verified collected</p>
        </div>

        {/* Monthly Retainer */}
        <div className="rounded-xl border border-line bg-surface p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <TrendUp size={16} className="text-warm-ink" />
            <span>Monthly MRR</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-warm-ink sm:text-2xl tabular-nums">
            {formatMarketPrice(stats.totalMonthlyUSD, "USD")}
          </p>
          <p className="text-[11px] text-muted mt-0.5">Active recurring pipeline</p>
        </div>
      </div>

      {/* ─── Search & Sort Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, business, phone, or order ID..."
            className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-9 text-base sm:text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-by-select" className="text-xs font-medium text-muted">
            Sort:
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest_upfront" | "highest_monthly")}
            className="h-10 rounded-full border border-line bg-paper px-3 text-base sm:text-xs font-medium text-ink outline-none focus:border-accent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_upfront">Highest Upfront Amount</option>
            <option value="highest_monthly">Highest Monthly Retainer</option>
          </select>
        </div>
      </div>

      {/* ─── Filter Tabs: Markets & Payment Status ────────────────────────── */}
      <div className="space-y-2.5">
        {/* Market Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedMarket("all")}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedMarket === "all"
                ? "bg-accent text-accent-ink"
                : "border border-line bg-surface text-muted hover:text-ink hover:border-accent/40"
            }`}
          >
            All Markets ({marketCounts.all || 0})
          </button>
          {markets.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMarket(m.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedMarket === m.id
                  ? "bg-accent text-accent-ink"
                  : "border border-line bg-surface text-muted hover:text-ink hover:border-accent/40"
              }`}
            >
              <span>{flags[m.id] || "🌐"}</span>
              <span>{m.name}</span>
              <span className="opacity-70 font-normal">({marketCounts[m.id] || 0})</span>
            </button>
          ))}
        </div>

        {/* Payment Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedStatus("all")}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedStatus === "all"
                ? "bg-ink text-paper"
                : "border border-line bg-paper text-muted hover:text-ink"
            }`}
          >
            All Statuses ({statusCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("pending")}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedStatus === "pending"
                ? "bg-amber-400 text-amber-950 font-bold"
                : "border border-line bg-paper text-amber-300 hover:border-amber-400"
            }`}
          >
            <span>🟡 Owed Upfront ({statusCounts.pending})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("paid")}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedStatus === "paid"
                ? "bg-emerald-500 text-emerald-950 font-bold"
                : "border border-line bg-paper text-emerald-400 hover:border-emerald-500"
            }`}
          >
            <span>🟢 Paid in Full ({statusCounts.paid})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("partially_paid")}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedStatus === "partially_paid"
                ? "bg-blue-500 text-blue-950 font-bold"
                : "border border-line bg-paper text-blue-400 hover:border-blue-500"
            }`}
          >
            <span>🔵 Partial ({statusCounts.partially_paid})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("cancelled")}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedStatus === "cancelled"
                ? "bg-slate-400 text-slate-950 font-bold"
                : "border border-line bg-paper text-slate-400 hover:border-slate-400"
            }`}
          >
            <span>⚪ Cancelled ({statusCounts.cancelled})</span>
          </button>
        </div>
      </div>

      {/* ─── Orders List ──────────────────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
          <Receipt size={40} className="mx-auto text-muted/60" />
          <h2 className="mt-3 text-lg font-bold text-ink sm:text-xl">No orders found</h2>
          <p className="mt-1 text-sm text-muted">
            {search || selectedMarket !== "all" || selectedStatus !== "all"
              ? "No orders match the selected filters or search query. Try clearing your search."
              : "Confirmed orders submitted across any market checkout will appear here as rich client cards."}
          </p>
          {(search || selectedMarket !== "all" || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedMarket("all");
                setSelectedStatus("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-ink hover:border-accent"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted px-1">
            <span>
              Showing <strong>{filteredOrders.length}</strong> of {initialOrders.length} orders
            </span>
          </div>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
