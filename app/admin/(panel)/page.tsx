import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [{ count: newLeads }, { count: published }, { count: drafts }, { count: chats }] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "nuevo"),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/admin/prospectos?estado=nuevo", title: "Prospectos", desc: `${newLeads ?? 0} nuevos sin contactar.` },
    { href: "/admin/conversaciones", title: "Conversaciones", desc: `${chats ?? 0} chats con Oryn guardados.` },
    { href: "/admin/planes", title: "Planes y precios", desc: "Edita precios, conversaciones incluidas, el plan recomendado y los complementos." },
    {
      href: "/admin/portafolio",
      title: "Portafolio",
      desc: `${published ?? 0} publicados, ${drafts ?? 0} en borrador.`,
    },
    { href: "/admin/ajustes", title: "Ajustes del sitio", desc: "Título y subtítulo de la portada, imágenes y biografía." },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Panel</h1>
      <p className="mt-2 text-muted">Los cambios se publican en el sitio al guardar.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block h-full rounded-[var(--radius-panel)] border border-line bg-surface p-6 hover:border-accent">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
