import { requireAdmin } from "@/lib/admin";
import { TierEditor, type TierRow } from "./TierEditor";

export const dynamic = "force-dynamic";

export default async function AdminPlanesPage() {
  const { supabase } = await requireAdmin();
  const { data: tiers } = await supabase.from("tiers").select("*").order("sort_order");

  return (
    <div>
      <h1 className="text-3xl font-semibold">Planes y precios</h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        Estos datos alimentan la portada, la tabla de servicios, la calculadora, el formulario y el asistente de IA. Los precios se muestran
        exactos con dos decimales.
      </p>
      <div className="mt-10 space-y-10">
        {((tiers as TierRow[] | null) ?? []).map((t) => (
          <TierEditor key={t.slug} tier={t} />
        ))}
      </div>
    </div>
  );
}
