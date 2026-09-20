// Fires on INSERT into market_leads / orders via a Supabase Database Webhook
// (wired in the dashboard, not in code -- see Phase 4 notes). Deliberately
// separate from lib/telegram.ts, which already alerts on the DR-only public
// leads table via a direct call from app/servicios/actions.ts: wiring this
// function to `leads` too would double-alert every Dominican lead.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;
// Deployed with verify_jwt off (Database Webhooks don't send a Supabase
// JWT), so this shared secret is the only thing stopping an arbitrary
// caller from spamming the bot. Set the same value as a custom header
// ("x-webhook-secret") when creating each webhook in the dashboard.
const WEBHOOK_SECRET = Deno.env.get("TELEGRAM_WEBHOOK_SECRET");

interface WebhookPayload {
  table: string;
  record: Record<string, unknown>;
}

// One shared bot/chat with the existing DR alerts: this is the visual
// separator (flag + code) so a market alert is unmistakable in the same
// Telegram thread as the Spanish-language DR lead alerts from lib/telegram.ts.
const MARKET_FLAG: Record<string, string> = {
  do: "🇩🇴", // DO
  us: "🇺🇸", // US
  ca: "🇨🇦", // CA
  ht: "🇭🇹", // HT
};

function marketLabel(marketId: unknown): string {
  const id = String(marketId ?? "").toLowerCase();
  const flag = MARKET_FLAG[id];
  return id ? `${flag ?? "🌍"} ${id.toUpperCase()}` : "🌍 UNKNOWN";
}

Deno.serve(async (req: Request) => {
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = (await req.json()) as WebhookPayload;
  const { table, record } = payload;

  let text: string;
  if (table === "market_leads") {
    text =
      `🆕 New lead — ${marketLabel(record.market_id)}\n` +
      `${record.name ?? "No name"} (${record.business_name ?? "-"})\n` +
      `Channel: ${record.channel ?? "-"} · Phone: ${record.phone ?? "-"} · Email: ${record.email ?? "-"}\n` +
      `Interested in: ${record.tier_interest ?? "-"}`;
  } else if (table === "orders") {
    text =
      `💰 New order — ${marketLabel(record.market_id)}\n` +
      `Tier: ${record.tier_key}${record.addon ? ` + ${record.addon}` : ""}\n` +
      `${record.one_time_price ?? "-"} ${record.currency ?? ""} one-time`;
  } else {
    return new Response("ignored: unhandled table", { status: 200 });
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
  if (!res.ok) console.error("Telegram alert failed:", res.status, await res.text());

  return new Response("ok", { status: 200 });
});
