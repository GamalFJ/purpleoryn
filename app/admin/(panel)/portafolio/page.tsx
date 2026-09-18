import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { IMAGE_RATIOS } from "@/lib/image";

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
        <h1 className="text-3xl font-semibold">Portfolio</h1>
        <Link href="/admin/portafolio/nuevo" className={buttonClass("primary", "md")}>
          Add case study
        </Link>
      </div>

      {!items?.length ? (
        <div className="mt-10 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">No case studies yet</h2>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted">
            While it&rsquo;s empty, the site shows &ldquo;Casos de éxito próximamente&rdquo;. Add a case, save it as a draft and publish it once
            you have the client&rsquo;s permission.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/admin/portafolio/${item.id}`} className="flex items-center gap-4 p-4 hover:bg-accent-soft/50 sm:p-5">
                <div className={cn("relative w-24 shrink-0 overflow-hidden rounded-lg bg-paper", IMAGE_RATIOS.landscape.className)}>
                  {item.cover_image_url && <Image src={item.cover_image_url} alt="" fill sizes="96px" className="object-cover object-center" />}
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
                  {item.published ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
