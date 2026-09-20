import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/service";
import { MarketContentEditor } from "./MarketContentEditor";

export const dynamic = "force-dynamic";

export default async function MarketContentPage() {
  await requireAdmin();
  const supabase = serviceClient();
  const [{ data: markets }, { data: content }] = await Promise.all([
    supabase.from("markets").select("*").order("id"),
    supabase.from("market_content").select("market_id, section_key, content"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Market content</h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        Copy per market. US/CA/HT have no rows yet — saving here creates them (upsert), nothing to set up first. Add a new field by extending{" "}
        <code className="rounded bg-line px-1.5 py-0.5 text-sm">MARKET_CONTENT_SECTIONS</code> in <code className="rounded bg-line px-1.5 py-0.5 text-sm">lib/marketContent.ts</code>.
      </p>
      <div className="mt-10 space-y-10">
        {(markets ?? []).map((market) => (
          <MarketContentEditor
            key={market.id}
            marketId={market.id}
            marketName={market.name}
            content={(content ?? []).filter((c) => c.market_id === market.id)}
          />
        ))}
      </div>
    </div>
  );
}
