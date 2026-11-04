import Link from "next/link";
import { ChatCircleText, Gauge, ImageSquare, Receipt, Tag, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { requireAdmin } from "@/lib/admin";
import { serviceClient } from "@/lib/supabase/service";
import type { Tone } from "@/lib/tone";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const svc = serviceClient();

  const [
    { count: newLeads },
    { count: published },
    { count: drafts },
    { count: chats },
    { count: totalOrders },
    { count: pendingOrders },
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "nuevo"),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }),
    svc.from("orders").select("id", { count: "exact", head: true }),
    svc.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending_first_payment"),
  ]);

  const cards: { href: string; title: string; desc: string; icon: typeof Gauge; tone: Tone }[] = [
    {
      href: "/admin/orders",
      title: "Client Orders",
      desc: `${totalOrders ?? 0} confirmed orders (${pendingOrders ?? 0} awaiting payment). Full cards & billing.`,
      icon: Receipt,
      tone: "rose",
    },
    {
      href: "/admin/prospectos?estado=nuevo",
      title: "Leads",
      desc: `${newLeads ?? 0} new, not yet contacted.`,
      icon: UsersThree,
      tone: "violet",
    },
    {
      href: "/admin/conversaciones",
      title: "Conversations",
      desc: `${chats ?? 0} chats with Oryn saved.`,
      icon: ChatCircleText,
      tone: "teal",
    },
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
    {
      href: "/admin/ajustes",
      title: "Site settings",
      desc: "Homepage headline and subheadline, images and bio.",
      icon: Gauge,
      tone: "violet",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted sm:text-base">Real-time overview of client orders, leads, and agency operations.</p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full gap-3.5 rounded-[var(--radius-panel)] border border-line bg-surface p-4 sm:p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_36px_-24px_rgb(28_16_48/0.5)]"
            >
              <IconTile icon={c.icon} tone={c.tone} size="lg" className="shrink-0" />
              <div className="min-w-0">
                <h2 className="text-lg font-semibold sm:text-xl">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[15px]">{c.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
