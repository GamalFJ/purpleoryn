import { headers } from "next/headers";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { serviceClient } from "@/lib/supabase/service";

export interface Market {
  id: string;
  name: string;
  domain: string;
  language: string;
  currency: string;
  primaryChannel: string;
  whatsappNumber: string | null;
}

export interface MarketPricingTier {
  id: string;
  tierKey: string;
  tierName: string;
  oneTimePrice: number | null;
  monthlyPrice: number | null;
  conversationCap: number | null;
  overageRate: number | null;
  recommended: boolean;
  sortOrder: number;
}

export interface CurrentMarket {
  market: Market | null;
  pricing: MarketPricingTier[];
  content: Record<string, string>;
}

const EMPTY_MARKET: CurrentMarket = { market: null, pricing: [], content: {} };

export async function getCurrentMarket(): Promise<CurrentMarket> {
  if (!isServiceRoleConfigured()) return EMPTY_MARKET;

  const marketId = (await headers()).get("x-market") ?? "do";
  const supabase = serviceClient();

  const [{ data: market }, { data: pricing }, { data: contentRows }] = await Promise.all([
    supabase.from("markets").select("*").eq("id", marketId).single(),
    supabase.from("pricing_tiers").select("*").eq("market_id", marketId).order("sort_order"),
    supabase.from("market_content").select("section_key, content").eq("market_id", marketId),
  ]);

  const content = Object.fromEntries((contentRows ?? []).map((c) => [c.section_key, c.content as string]));

  return {
    market: market
      ? {
          id: market.id,
          name: market.name,
          domain: market.domain,
          language: market.language,
          currency: market.currency,
          primaryChannel: market.primary_channel,
          whatsappNumber: market.whatsapp_number,
        }
      : null,
    pricing: (pricing ?? []).map((t) => ({
      id: t.id,
      tierKey: t.tier_key,
      tierName: t.tier_name,
      oneTimePrice: t.one_time_price,
      monthlyPrice: t.monthly_price,
      conversationCap: t.conversation_cap,
      overageRate: t.overage_rate,
      recommended: t.recommended,
      sortOrder: t.sort_order,
    })),
    content,
  };
}
