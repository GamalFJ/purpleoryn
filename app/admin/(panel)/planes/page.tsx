import { requireAdmin } from "@/lib/admin";
import { AddonEditor, type AddonRow } from "./AddonEditor";
import { TierEditor, type TierRow } from "./TierEditor";

export const dynamic = "force-dynamic";

export default async function AdminPlanesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: tiers }, { data: addons }] = await Promise.all([
    supabase.from("tiers").select("*").order("sort_order"),
    supabase.from("addons").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Plans &amp; pricing</h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        This data feeds the homepage, the services table, the calculator, the order form and the AI agent. Prices always show exact, with two
        decimals.
      </p>
      <div className="mt-10 space-y-10">
        {((tiers as TierRow[] | null) ?? []).map((t) => (
          <TierEditor key={t.slug} tier={t} />
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Add-ons</h2>
      <p className="mt-2 max-w-[60ch] text-muted">Shown in their own section on /servicios, never as a fourth plan.</p>
      <div className="mt-8 space-y-10">
        {((addons as AddonRow[] | null) ?? []).map((a) => (
          <AddonEditor key={a.slug} addon={a} />
        ))}
      </div>
    </div>
  );
}
