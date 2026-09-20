import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/service";
import { PricingTierEditor, type MarketPricingTierRow } from "./PricingTierEditor";

export const dynamic = "force-dynamic";

export default async function MarketPricingPage() {
  // requireAdmin() is the auth gate; pricing_tiers itself has no RLS policy
  // for the session client, so reads go through the service-role client.
  await requireAdmin();
  const supabase = serviceClient();
  const [{ data: markets }, { data: tiers }] = await Promise.all([
    supabase.from("markets").select("*").order("id"),
    supabase.from("pricing_tiers").select("*").order("market_id").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Market pricing</h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        Pricing per market. Feeds each domain&apos;s homepage. Leave a price blank until the real cost is confirmed — blank prices don&apos;t
        render on the public site.
      </p>

      <div className="mt-10 space-y-12">
        {(markets ?? []).map((market) => {
          const marketTiers = ((tiers as MarketPricingTierRow[] | null) ?? []).filter((t) => t.market_id === market.id);
          return (
            <section key={market.id}>
              <h2 className="text-2xl font-semibold">
                {market.name} <span className="text-base font-normal text-muted">({market.currency})</span>
              </h2>
              <div className="mt-6 space-y-6">
                {marketTiers.length ? (
                  marketTiers.map((t) => <PricingTierEditor key={t.id} tier={t} currency={market.currency} />)
                ) : (
                  <p className="text-muted">No pricing tiers for this market yet.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
