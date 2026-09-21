import { NextResponse, type NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";

// Fire-and-forget attribution beacon, POST only -- called via
// navigator.sendBeacon on an actual WhatsApp link click (see TrackedLink).
// Deliberately NOT a GET handler: a GET here was triggered by search-engine
// crawlers following the link and by Chrome's predictive link-preloading
// (hovering near a link can prefetch it), producing phantom "new lead"
// Telegram alerts with no real visitor behind them -- including one at
// 4:46am while nobody was on the site. Links themselves point straight at
// wa.me now; this endpoint only records the attribution, never redirects.
//
// Logs to market_leads, not the DR-only public.leads table -- that one
// already has its own submission path (the /servicios form) and its own
// Telegram alert wired directly in code (lib/telegram.ts). Writing here to
// `leads` instead would collide with a different, incompatible schema.
const VALID_MARKETS = new Set(["do", "us", "ca", "ht"]);

export async function POST(req: NextRequest) {
  let market = "do";
  try {
    const body = await req.json();
    if (typeof body?.market_id === "string" && VALID_MARKETS.has(body.market_id)) market = body.market_id;
  } catch {
    // Malformed or empty body: fall back to the default market rather than fail.
  }

  try {
    await serviceClient().from("market_leads").insert({ market_id: market, channel: "whatsapp", status: "new" });
  } catch (err) {
    console.error("[whatsapp beacon] lead insert failed:", err instanceof Error ? err.message : err);
  }

  return new NextResponse(null, { status: 204 });
}
