import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { PortfolioForm, type PortfolioRow } from "../PortfolioForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ created?: string }>;

export default async function EditarCasoPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await supabase.from("portfolio_items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold">{data.title}</h1>
      <PortfolioForm item={data as PortfolioRow} justCreated={created === "1"} />
    </div>
  );
}
