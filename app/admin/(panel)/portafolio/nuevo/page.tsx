import { requireAdmin } from "@/lib/admin";
import { PortfolioForm } from "../PortfolioForm";

export const dynamic = "force-dynamic";

export default async function NuevoCasoPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-3xl font-semibold">New case study</h1>
      <p className="mt-2 text-muted">Saved as a draft until you check &ldquo;Published on the site&rdquo;.</p>
      <PortfolioForm item={null} />
    </div>
  );
}
