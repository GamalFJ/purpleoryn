"use client";

import { useState, useTransition } from "react";
import {
  Briefcase,
  CalendarBlank,
  ChatCircleText,
  CheckCircle,
  Clock,
  Copy,
  EnvelopeSimple,
  HourglassHigh,
  Phone,
  Receipt,
  Sparkle,
  WhatsappLogo,
  XCircle,
} from "@phosphor-icons/react";
import { formatMarketPrice } from "@/lib/format";
import { setOrderPaymentStatus } from "../actions";

export interface OrderItem {
  id: string;
  createdAt: string;
  marketId: string;
  marketName: string;
  marketFlag: string;
  currency: string;
  tierKey: string;
  tierName: string;
  addon: string | null;
  oneTimePrice: number;
  monthlyPrice: number;
  paymentStatus: "paid" | "pending_first_payment" | "partially_paid" | "cancelled" | string;
  clientName: string;
  businessName: string;
  email: string | null;
  phone: string;
  preferredContact: string;
  notes: string | null;
  source: string | null;
}

export function OrderCard({ order }: { order: OrderItem }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(order.paymentStatus);
  const [isPending, startTransition] = useTransition();

  const isPaid = currentStatus === "paid";
  const isPartiallyPaid = currentStatus === "partially_paid";
  const isCancelled = currentStatus === "cancelled";

  // Amount owed calculation
  const amountOwed = isPaid ? 0 : order.oneTimePrice;

  // Relative date
  const orderDate = new Date(order.createdAt);
  const fullDateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(orderDate);

  const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
  const relativeTime =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  const orderShortId = order.id.slice(0, 8).toUpperCase();

  // WhatsApp link preparation
  const cleanPhone = order.phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const firstName = order.clientName.split(" ")[0] || "there";
  const isFrench = order.marketId === "ca" || order.marketId === "ht";
  const isSpanish = order.marketId === "do";

  let waGreeting = `Hello ${firstName}, this is Gamal from Purple Cove Labs. We received your order for the ${order.tierName} plan for ${order.businessName}.`;
  if (isSpanish) {
    waGreeting = `Hola ${firstName}, le escribe Gamal de Purple Cove Labs. Recibimos su pedido del plan ${order.tierName} para ${order.businessName}.`;
  } else if (isFrench) {
    waGreeting = `Bonjour ${firstName}, c'est Gamal de Purple Cove Labs. Nous avons bien reçu votre commande pour le plan ${order.tierName} pour ${order.businessName}.`;
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waGreeting)}`
    : null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await setOrderPaymentStatus(order.id, newStatus);
    });
  };

  const copyOrderSummary = () => {
    const summary = [
      `ORDER #${orderShortId} (${order.marketFlag} ${order.marketName})`,
      `Client: ${order.clientName} | ${order.businessName}`,
      `Phone: ${order.phone} | Email: ${order.email || "N/A"}`,
      `Plan: ${order.tierName}${order.addon ? ` + ${order.addon}` : ""}`,
      `Upfront Due: ${formatMarketPrice(order.oneTimePrice, order.currency)}`,
      `Monthly Retainer: ${formatMarketPrice(order.monthlyPrice, order.currency)}/mo`,
      `Status: ${currentStatus.toUpperCase()}`,
      `Amount Owed: ${isPaid ? "PAID IN FULL" : formatMarketPrice(amountOwed, order.currency)}`,
      order.notes ? `Notes: ${order.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    handleCopy(summary, "summary");
  };

  return (
    <article
      className="group relative rounded-2xl border border-line bg-surface p-4 sm:p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-[0_12px_28px_-16px_rgb(28_16_48/0.4)]"
      aria-labelledby={`order-heading-${order.id}`}
    >
      {/* ─── Top Bar: ID, Date, Market, Status ──────────────────────────── */}
      <div className="flex flex-col gap-3 pb-4 border-b border-line sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Order reference tag */}
          <button
            type="button"
            onClick={() => handleCopy(orderShortId, "id")}
            title="Click to copy Order ID"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-accent/50 hover:bg-accent-soft/30"
          >
            <Receipt size={14} className="text-accent" />
            <span>#{orderShortId}</span>
            <Copy size={12} className="text-muted" />
            {copied === "id" && <span className="text-[10px] text-accent font-bold">Copied!</span>}
          </button>

          {/* Market Badge */}
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
            <span aria-hidden="true" className="text-sm">
              {order.marketFlag}
            </span>
            <span>{order.marketName}</span>
            <span className="font-semibold text-ink">· {order.currency}</span>
          </span>

          {/* Timestamp */}
          <span className="flex items-center gap-1 text-xs text-muted">
            <CalendarBlank size={13} className="shrink-0" />
            <span>{fullDateFormatted}</span>
            <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-ink">
              {relativeTime}
            </span>
          </span>
        </div>

        {/* Payment Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isPaid ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
              <CheckCircle size={15} weight="fill" />
              <span>PAID IN FULL</span>
            </span>
          ) : isPartiallyPaid ? (
            <span className="flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
              <HourglassHigh size={15} weight="fill" />
              <span>PARTIAL PAYMENT</span>
            </span>
          ) : isCancelled ? (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-500/15 border border-slate-500/30 px-3 py-1 text-xs font-bold text-slate-400">
              <XCircle size={15} weight="fill" />
              <span>CANCELLED</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 px-3 py-1 text-xs font-bold text-amber-300">
              <Clock size={15} weight="fill" />
              <span>OWES UPFRONT</span>
            </span>
          )}
        </div>
      </div>

      {/* ─── Main Content Grid: Client Dossier & Financials ─────────────── */}
      <div className="mt-4 grid gap-5 lg:grid-cols-12">
        {/* Left Column: Client Details (7 cols on desktop) */}
        <div className="flex flex-col gap-3 lg:col-span-7">
          <div>
            <h2 id={`order-heading-${order.id}`} className="text-lg font-bold text-ink sm:text-xl">
              {order.clientName}
            </h2>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted mt-0.5">
              <Briefcase size={15} className="shrink-0 text-accent" />
              <span>{order.businessName}</span>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {order.phone && (
              <a
                href={`tel:${order.phone}`}
                className="flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-ink transition-colors hover:border-accent/50"
              >
                <Phone size={13} className="text-muted" />
                <span>{order.phone}</span>
              </a>
            )}

            {order.email && (
              <a
                href={`mailto:${order.email}`}
                className="flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-ink transition-colors hover:border-accent/50"
              >
                <EnvelopeSimple size={13} className="text-muted" />
                <span className="max-w-[200px] truncate">{order.email}</span>
              </a>
            )}

            {order.preferredContact && (
              <span className="rounded-full bg-accent-soft/40 px-2.5 py-1 text-xs font-medium text-accent">
                Prefers: {order.preferredContact}
              </span>
            )}

            {order.source && (
              <span className="rounded-full bg-surface border border-line px-2 py-0.5 text-[11px] text-muted">
                via {order.source}
              </span>
            )}
          </div>

          {/* Customer Requirements / Notes */}
          {order.notes ? (
            <div className="mt-1 rounded-xl border border-line/70 bg-paper/60 p-3 text-xs leading-relaxed text-muted">
              <div className="flex items-center gap-1 font-semibold text-ink text-[11px] mb-1 uppercase tracking-wider">
                <ChatCircleText size={13} className="text-accent" />
                <span>Client Notes &amp; Instructions</span>
              </div>
              <p className="break-words whitespace-pre-wrap">{order.notes}</p>
            </div>
          ) : (
            <p className="text-xs italic text-muted/70">No additional project notes provided.</p>
          )}
        </div>

        {/* Right Column: Plan Breakdown & Financial Balance (5 cols on desktop) */}
        <div className="flex flex-col justify-between rounded-xl border border-line bg-paper/50 p-3.5 sm:p-4 lg:col-span-5">
          <div>
            {/* Plan Badge */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-line">
              <span className="text-xs uppercase font-bold tracking-wider text-muted">Plan Selected</span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-ink">
                {order.tierName}
              </span>
            </div>

            {/* Modules & Addons */}
            <div className="py-2.5 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>Core Setup:</span>
                <span className="tabular-nums font-medium text-ink">
                  {formatMarketPrice(order.oneTimePrice, order.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted mt-1">
                <span>Monthly Retainer:</span>
                <span className="tabular-nums font-medium text-ink">
                  {formatMarketPrice(order.monthlyPrice, order.currency)}/mo
                </span>
              </div>
              {order.addon && (
                <div className="flex items-center gap-1.5 mt-2 rounded-lg bg-surface border border-line p-2 text-xs text-ink font-medium">
                  <Sparkle size={14} className="text-amber-400 shrink-0" />
                  <span>Add-on: {order.addon}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Balance Callout: HOW MUCH THEY OWE */}
          <div
            className={`mt-2 rounded-xl p-3 border transition-colors ${
              isPaid
                ? "bg-emerald-500/10 border-emerald-500/30"
                : isCancelled
                ? "bg-slate-500/10 border-slate-500/30"
                : "bg-amber-500/10 border-amber-500/40"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {isPaid ? "Payment Status" : "Balance Due / Owed"}
              </span>
              <span
                className={`text-base sm:text-lg font-extrabold tabular-nums ${
                  isPaid ? "text-emerald-400" : isCancelled ? "text-slate-400" : "text-amber-300"
                }`}
              >
                {isPaid
                  ? "$0.00 (Fully Settled)"
                  : isCancelled
                  ? "Cancelled"
                  : `${formatMarketPrice(amountOwed, order.currency)} Due`}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              {isPaid
                ? "Upfront commitment verified and collected."
                : isCancelled
                ? "This order was cancelled."
                : "Awaiting initial 50% deposit / add-on upfront to initiate onboarding."}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Bottom Action Bar: User-Friendly Buttons ────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-line">
        {/* Payment Status Dropdown Form */}
        <div className="flex items-center gap-2">
          <label htmlFor={`status-select-${order.id}`} className="text-xs font-medium text-muted">
            Status:
          </label>
          <select
            id={`status-select-${order.id}`}
            value={currentStatus}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 rounded-full border border-line bg-paper px-3 text-xs sm:text-sm font-medium text-ink outline-none transition-colors focus:border-accent disabled:opacity-50"
          >
            <option value="pending_first_payment">Pending Payment</option>
            <option value="paid">Paid in Full</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Quick Toggle Button */}
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange(isPaid ? "pending_first_payment" : "paid")}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              isPaid
                ? "border border-line text-muted hover:text-ink hover:border-accent/40"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
            }`}
          >
            {isPaid ? "Mark as Pending" : "Mark as Paid ✓"}
          </button>
        </div>

        {/* Action Buttons: WhatsApp, Copy, Email */}
        <div className="flex flex-wrap items-center gap-2">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-3.5 py-1.5 text-xs font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/25"
            >
              <WhatsappLogo size={15} weight="bold" />
              <span>WhatsApp Client</span>
            </a>
          )}

          {order.email && (
            <a
              href={`mailto:${order.email}?subject=${encodeURIComponent(
                `Purple Cove Labs — Your ${order.tierName} Plan Confirmation`,
              )}`}
              className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink hover:border-accent/40"
            >
              <EnvelopeSimple size={14} />
              <span>Email</span>
            </a>
          )}

          <button
            type="button"
            onClick={copyOrderSummary}
            className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink hover:border-accent/40"
          >
            <Copy size={13} />
            <span>{copied === "summary" ? "Summary Copied!" : "Copy Card"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
