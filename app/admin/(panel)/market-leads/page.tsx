import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Envelope,
  Globe,
  MapPinLine,
  Phone,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { MARKET_LEAD_STATUSES, MARKET_LEAD_STATUS_LABEL, type MarketLeadStatus } from "@/lib/marketLeads";
import { serviceClient } from "@/lib/supabase/service";
import { updateBookingStatus, updateMarketLeadStatus } from "../actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ market?: string; tab?: string }>;

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function MarketLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { market: marketFilter, tab: currentTab = "leads" } = await searchParams;
  await requireAdmin();
  const supabase = serviceClient();

  // Queries
  let leadsQuery = supabase
    .from("market_leads")
    .select("*, markets(name)")
    .order("last_activity_at", { ascending: false })
    .limit(200);

  if (marketFilter) {
    leadsQuery = leadsQuery.eq("market_id", marketFilter);
  }

  let bookingsQuery = supabase
    .from("market_bookings")
    .select("*, market_leads(id, name, business_name, email, phone)")
    .order("booking_start", { ascending: false })
    .limit(200);

  if (marketFilter) {
    bookingsQuery = bookingsQuery.eq("market_id", marketFilter);
  }

  const [{ data: markets }, { data: leads }, { data: bookings }] =
    await Promise.all([
      supabase.from("markets").select("id, name").order("id"),
      leadsQuery,
      bookingsQuery,
    ]);

  const isBookingsTab = currentTab === "bookings";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Inquiries & CRM</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">
            U.S. website inquiries, demo bookings, and lead management.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface p-1 text-xs self-start sm:self-auto">
          <Link
            href={marketFilter ? `/admin/market-leads?tab=leads&market=${marketFilter}` : `/admin/market-leads?tab=leads`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors",
              !isBookingsTab
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-ink"
            )}
          >
            <MapPinLine size={14} weight="bold" />
            <span>Inquiries & Leads</span>
            <span className="tabular opacity-80">({leads?.length ?? 0})</span>
          </Link>

          <Link
            href={marketFilter ? `/admin/market-leads?tab=bookings&market=${marketFilter}` : `/admin/market-leads?tab=bookings`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors",
              isBookingsTab
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-ink"
            )}
          >
            <CalendarCheck size={14} weight="bold" />
            <span>Cal.com Bookings</span>
            <span className="tabular opacity-80">({bookings?.length ?? 0})</span>
          </Link>
        </div>
      </div>

      {/* Market Selector Filter */}
      <nav
        aria-label="Filter by market"
        className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex gap-2">
          <li>
            <Link
              href={`/admin/market-leads?tab=${currentTab}`}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200",
                !marketFilter
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line bg-surface text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-ink"
              )}
            >
              All Markets
            </Link>
          </li>
          {(markets ?? []).map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/market-leads?tab=${currentTab}&market=${m.id}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200",
                  marketFilter === m.id
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-surface text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-ink"
                )}
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ─── TAB 1: INQUIRIES & LEADS ────────────────────────────────────────── */}
      {!isBookingsTab && (
        <div>
          {!leads?.length ? (
            <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8 text-center sm:text-left">
              <h2 className="text-lg font-semibold sm:text-xl">No inquiries found</h2>
              <p className="mt-2 text-sm text-muted sm:text-[15px]">
                Inbound form submissions from the U.S. website and international landing pages will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface overflow-hidden">
              {leads.map((lead) => {
                const isUsMarket = lead.market_id === "us";
                return (
                  <div
                    key={lead.id}
                    className="flex flex-col gap-3 p-4 sm:p-5 transition-colors duration-200 hover:bg-accent-soft/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink sm:text-base">
                            {lead.name || "Anonymous Contact"}
                          </p>
                          {isUsMarket && (
                            <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[10px] font-semibold text-teal-ink">
                              U.S. Home Services
                            </span>
                          )}
                          <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-mono text-muted">
                            {lead.source || "direct"}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs sm:text-sm text-muted">
                          <strong className="text-ink font-medium">
                            {lead.business_name || "No Company Specified"}
                          </strong>
                          {lead.service_category && ` · ${lead.service_category}`}
                          {lead.tier_interest && ` · ${lead.tier_interest}`}
                        </p>
                      </div>

                      {/* Status Update Form */}
                      <form
                        action={updateMarketLeadStatus.bind(null, lead.id)}
                        className="flex items-center gap-2"
                      >
                        <label htmlFor={`status-${lead.id}`} className="sr-only">
                          Status
                        </label>
                        <select
                          id={`status-${lead.id}`}
                          name="status"
                          defaultValue={lead.status as MarketLeadStatus}
                          className="h-8 rounded-full border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-accent"
                        >
                          {MARKET_LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {MARKET_LEAD_STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="cursor-pointer rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-accent hover:text-ink transition-colors"
                        >
                          Save
                        </button>
                      </form>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1 hover:text-ink hover:underline"
                        >
                          <Envelope size={14} className="shrink-0" />
                          <span>{lead.email}</span>
                        </a>
                      )}
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1 hover:text-ink hover:underline font-mono"
                        >
                          <Phone size={14} className="shrink-0" />
                          <span>{lead.phone}</span>
                        </a>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-accent hover:underline"
                        >
                          <Globe size={14} className="shrink-0" />
                          <span className="truncate max-w-[200px]">{lead.website}</span>
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="shrink-0 text-muted" />
                        <span>
                          Last active:{" "}
                          {dateTimeFormat.format(new Date(lead.last_activity_at || lead.created_at))}
                        </span>
                      </span>
                    </div>

                    {/* Notes & Message Preview */}
                    {(lead.notes || lead.message) && (
                      <div className="rounded-xl border border-line/70 bg-paper p-2.5 text-xs text-muted">
                        {lead.notes && (
                          <p className="text-ink">
                            <strong>Notes:</strong> {lead.notes}
                          </p>
                        )}
                        {lead.message && (
                          <p className={lead.notes ? "mt-1 text-[11px]" : "text-ink"}>
                            {lead.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: CAL.COM DEMO BOOKINGS ────────────────────────────────────── */}
      {isBookingsTab && (
        <div>
          {!bookings?.length ? (
            <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8 text-center sm:text-left">
              <h2 className="text-lg font-semibold sm:text-xl">No demo bookings found</h2>
              <p className="mt-2 text-sm text-muted sm:text-[15px]">
                Events scheduled through Cal.com will sync via webhook and populate here idempotently.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface overflow-hidden">
              {bookings.map((booking) => {
                const statusTone =
                  booking.booking_status === "created"
                    ? "bg-teal-soft text-teal-ink border-teal-ink/20"
                    : booking.booking_status === "rescheduled"
                    ? "bg-warm-soft text-warm-ink border-warm-ink/20"
                    : "bg-rose-soft text-rose-ink border-rose-ink/20";

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 p-4 sm:p-5 transition-colors duration-200 hover:bg-accent-soft/30"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink sm:text-base">
                            {booking.attendee_name}
                          </p>
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                              statusTone
                            )}
                          >
                            {booking.booking_status}
                          </span>
                          <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-mono text-muted">
                            {booking.booking_source || "calcom"}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs sm:text-sm text-muted">
                          <strong className="text-ink font-medium">{booking.event_title}</strong>
                          {booking.market_leads?.business_name && (
                            <span> · {booking.market_leads.business_name}</span>
                          )}
                        </p>
                      </div>

                      {/* Status changer */}
                      <form
                        action={updateBookingStatus.bind(null, booking.id)}
                        className="flex items-center gap-2"
                      >
                        <select
                          name="status"
                          defaultValue={booking.booking_status}
                          className="h-8 rounded-full border border-line bg-paper px-3 text-xs text-ink outline-none focus:border-accent"
                        >
                          <option value="created">Created (Confirmed)</option>
                          <option value="rescheduled">Rescheduled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          type="submit"
                          className="cursor-pointer rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-accent hover:text-ink transition-colors"
                        >
                          Update
                        </button>
                      </form>
                    </div>

                    {/* Booking Time & Contact details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-line/70 bg-paper p-3 space-y-1">
                        <p className="font-medium text-ink flex items-center gap-1.5">
                          <CalendarCheck size={16} className="text-accent" />
                          <span>Scheduled Time</span>
                        </p>
                        <p className="text-body font-mono">
                          {dateTimeFormat.format(new Date(booking.booking_start))} -{" "}
                          {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
                            new Date(booking.booking_end)
                          )}
                        </p>
                        <p className="text-[11px] text-muted">
                          Time Zone: {booking.attendee_time_zone || "America/Chicago"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-line/70 bg-paper p-3 space-y-1">
                        <p className="font-medium text-ink flex items-center gap-1.5">
                          <Envelope size={16} className="text-accent" />
                          <span>Attendee Contact</span>
                        </p>
                        <p className="text-body">
                          <a href={`mailto:${booking.attendee_email}`} className="hover:underline">
                            {booking.attendee_email}
                          </a>
                        </p>
                        {booking.attendee_phone && (
                          <p className="text-muted font-mono">
                            <a href={`tel:${booking.attendee_phone}`} className="hover:underline">
                              {booking.attendee_phone}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Telegram Sync */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted pt-1 border-t border-line/40">
                      <span className="font-mono">
                        External ID: {booking.external_booking_id}
                      </span>

                      <div className="flex items-center gap-1">
                        {booking.telegram_notified ? (
                          <span className="flex items-center gap-1 text-teal-ink font-medium">
                            <CheckCircle size={14} weight="bold" />
                            <span>Telegram Alert Delivered</span>
                          </span>
                        ) : booking.telegram_error ? (
                          <span className="flex items-center gap-1 text-danger font-medium" title={booking.telegram_error}>
                            <WarningCircle size={14} weight="bold" />
                            <span>Telegram Failed: {booking.telegram_error}</span>
                          </span>
                        ) : (
                          <span>Telegram Alert Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
