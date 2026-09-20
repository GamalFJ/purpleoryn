import { NextResponse, type NextRequest } from "next/server";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { serviceClient } from "@/lib/supabase/service";

// Tags a WhatsApp click with the market it came from, then hands off to
// wa.me. Every visitor-facing WhatsApp link on the site points here
// (via whatsappRedirectUrl in lib/links.ts) instead of a raw wa.me link.
//
// Logs to market_leads, not the DR-only public.leads table -- that one
// already has its own submission path (the /servicios form) and its own
// Telegram alert wired directly in code (lib/telegram.ts). Writing here to
// `leads` instead would collide with a different, incompatible schema.
const VALID_MARKETS = new Set(["do", "us", "ca", "ht"]);

export async function GET(req: NextRequest) {
  const marketParam = req.nextUrl.searchParams.get("market");
  const market = marketParam && VALID_MARKETS.has(marketParam) ? marketParam : "do";
  const text = req.nextUrl.searchParams.get("text") || WHATSAPP_GENERAL;

  // Never let a DB hiccup block the redirect: the visitor must still reach
  // WhatsApp even if this attribution insert fails.
  try {
    await serviceClient().from("market_leads").insert({ market_id: market, channel: "whatsapp", status: "new" });
  } catch (err) {
    console.error("[whatsapp redirect] lead insert failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.redirect(whatsappUrl(text));
}
