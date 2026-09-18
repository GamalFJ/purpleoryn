import Link from "next/link";
import { ChatCircleText, Gauge, ImageSquare, Tag, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { requireAdmin } from "@/lib/admin";
import type { Tone } from "@/lib/tone";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [{ count: newLeads }, { count: published }, { count: drafts }, { count: chats }] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "nuevo"),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
  ]);

  const cards: { href: string; title: string; desc: string; icon: typeof Gauge; tone: Tone }[] = [
    { href: "/admin/prospectos?estado=nuevo", title: "Leads", desc: `${newLeads ?? 0} new, not yet contacted.`, icon: UsersThree, tone: "violet" },
    { href: "/admin/conversaciones", title: "Conversations", desc: `${chats ?? 0} chats with Oryn saved.`, icon: ChatCircleText, tone: "teal" },
    {
      href: "/admin/planes",
      title: "Plans & pricing",
      desc: "Edit prices, included conversations, the recommended plan and add-ons.",
      icon: Tag,
      tone: "amber",
    },
    {
      href: "/admin/portafolio",
      title: "Portfolio",
      desc: `${published ?? 0} published, ${drafts ?? 0} in draft.`,
      icon: ImageSquare,
      tone: "rose",
    },
    { href: "/admin/ajustes", title: "Site settings", desc: "Homepage headline and subheadline, images and bio.", icon: Gauge, tone: "violet" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted">Changes publish to the live site as soon as you save.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_36px_-24px_rgb(28_16_48/0.5)]"
            >
              <IconTile icon={c.icon} tone={c.tone} size="lg" className="shrink-0" />
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
