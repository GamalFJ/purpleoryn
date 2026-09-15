import { requireAdmin } from "@/lib/admin";
import { PortfolioForm } from "../PortfolioForm";

export const dynamic = "force-dynamic";

export default async function NuevoCasoPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-3xl font-semibold">Nuevo caso</h1>
      <p className="mt-2 text-muted">Se guarda como borrador hasta que marques “Publicado en el sitio”.</p>
      <PortfolioForm item={null} />
    </div>
  );
}
