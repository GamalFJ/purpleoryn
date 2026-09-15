import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPortafolioPage() {
  const { supabase } = await requireAdmin();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("id, title, summary, published, cover_image_url, updated_at")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Portafolio</h1>
        <Link href="/admin/portafolio/nuevo" className={buttonClass("primary", "md")}>
          Agregar caso
        </Link>
      </div>

      {!items?.length ? (
        <div className="mt-10 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">Todavía no hay casos</h2>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted">
            Mientras esté vacío, el sitio muestra “Casos de éxito próximamente”. Agrega un caso, guárdalo como borrador y publícalo cuando tengas
            el permiso del cliente.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/admin/portafolio/${item.id}`} className="flex items-center gap-4 p-4 hover:bg-accent-soft/50 sm:p-5">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-paper">
                  {item.cover_image_url && <Image src={item.cover_image_url} alt="" fill sizes="80px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.summary && <p className="truncate text-sm text-muted">{item.summary}</p>}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    item.published ? "bg-success/15 text-success" : "bg-line text-muted"
                  }`}
                >
                  {item.published ? "Publicado" : "Borrador"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
