import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ market?: string }>;

export default async function MarketOrdersRedirect({ searchParams }: { searchParams: SearchParams }) {
  const { market } = await searchParams;
  if (market) {
    redirect(`/admin/orders?market=${market}`);
  }
  redirect("/admin/orders");
}
