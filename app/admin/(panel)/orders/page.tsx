import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import type { AddonSnapshot } from "@/lib/addons";
import { getTiers } from "@/lib/content";
import { orderTotals } from "@/lib/orders";
import { serviceClient } from "@/lib/supabase/service";
import type { OrderItem } from "./OrderCard";
import { OrdersDashboardClient } from "./OrdersDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Orders | Admin",
  robots: { index: false, follow: false },
};

const marketFlags: Record<string, string> = {
  us: "🇺🇸",
  ca: "🇨🇦",
  ht: "🇭🇹",
  do: "🇩🇴",
};

const tierDisplayNames: Record<string, string> = {
  presence: "Presence",
  conversion: "Conversion (Recommended)",
  authority: "Authority",
  presencia: "Presencia",
  autoridad: "Autoridad",
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = serviceClient();

  const [
    { data: ordersRaw },
    { data: marketsRaw },
    { data: leadsRaw },
    tiers,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*, markets(id, name, currency, language, domain), market_leads(*)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("markets").select("id, name, currency").order("id"),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
    getTiers(),
  ]);

  const orders: OrderItem[] = [];
  const processedOrderIds = new Set<string>();

  // 1. Map orders table rows
  for (const row of ordersRaw ?? []) {
    processedOrderIds.add(row.id);
    const mLead = row.market_leads;
    const mkt = row.markets;
    const marketId = row.market_id || "us";
    const marketName = mkt?.name || (marketId === "do" ? "Dominican Republic" : marketId.toUpperCase());
    const flag = marketFlags[marketId] || "🌐";
    const currency = row.currency || mkt?.currency || (marketId === "ca" ? "CAD" : marketId === "do" ? "DOP" : "USD");

    // Extract preferred contact & notes from message string if present
    let notes = mLead?.message || null;
    let preferredContact = "SMS / Phone";
    if (notes && notes.includes("Preferred contact:")) {
      const matchPref = notes.match(/Preferred contact:\s*([^.]+)/i);
      if (matchPref) preferredContact = matchPref[1].trim();
      const matchNotes = notes.match(/Notes:\s*(.*)/i);
      if (matchNotes) notes = matchNotes[1].trim();
    } else if (marketId === "do" || marketId === "ht") {
      preferredContact = "WhatsApp";
    }

    const tierKey = row.tier_key || "conversion";
    const tierName = tierDisplayNames[tierKey] || tierKey;

    orders.push({
      id: row.id,
      createdAt: row.created_at,
      marketId,
      marketName,
      marketFlag: flag,
      currency,
      tierKey,
      tierName,
      addon: row.addon ? (row.addon === "voice" ? "24/7 AI Voice Receptionist" : row.addon) : null,
      oneTimePrice: Number(row.one_time_price) || 0,
      monthlyPrice: Number(row.monthly_price) || 0,
      paymentStatus: row.payment_status || "pending_first_payment",
      clientName: mLead?.name || "Client Order",
      businessName: mLead?.business_name || "Business",
      email: mLead?.email || null,
      phone: mLead?.phone || "No phone provided",
      preferredContact,
      notes: notes && notes !== "None" && notes !== "Ninguna" ? notes : null,
      source: mLead?.source || "Direct Form",
    });
  }

  // 2. Synthesize historical leads from Dominican Republic if not already in orders
  // Check if any leads have not been mirrored to orders
  const existingClientNames = new Set(orders.map((o) => `${o.clientName.toLowerCase()}_${o.phone}`));

  for (const lead of leadsRaw ?? []) {
    const key = `${String(lead.name || "").toLowerCase()}_${lead.whatsapp}`;
    if (!existingClientNames.has(key)) {
      const plan = tiers.find((t) => t.slug === lead.plan);
      const addons: AddonSnapshot[] = Array.isArray(lead.addons) ? (lead.addons as AddonSnapshot[]) : [];
      const totals = orderTotals(plan, addons);

      orders.push({
        id: lead.id,
        createdAt: lead.created_at,
        marketId: "do",
        marketName: "Dominican Republic",
        marketFlag: "🇩🇴",
        currency: "DOP",
        tierKey: lead.plan,
        tierName: plan?.name || lead.plan,
        addon: addons.length ? addons.map((a: AddonSnapshot) => a.name).join(", ") : null,
        oneTimePrice: totals.oneTime,
        monthlyPrice: totals.monthly,
        paymentStatus: "pending_first_payment",
        clientName: lead.name,
        businessName: lead.business,
        email: lead.email || null,
        phone: lead.whatsapp,
        preferredContact: "WhatsApp",
        notes: lead.message,
        source: lead.source || "servicios_form",
      });
    }
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markets = (marketsRaw ?? []).map((m) => ({ id: m.id, name: m.name }));

  return <OrdersDashboardClient initialOrders={orders} markets={markets} />;
}
