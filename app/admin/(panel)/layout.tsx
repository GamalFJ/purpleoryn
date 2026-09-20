import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChatCircleText,
  CurrencyCircleDollar,
  GearSix,
  ImageSquare,
  MapPinLine,
  Receipt,
  SquaresFour,
  Tag,
  Translate,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/tone";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// Each section gets its own tone, echoed from the dashboard cards, so the
// same color always means the same section everywhere in the panel.
const NAV: { href: string; label: string; icon: Icon; tone: Tone }[] = [
  { href: "/admin", label: "Overview", icon: SquaresFour, tone: "violet" },
  { href: "/admin/prospectos", label: "Leads", icon: UsersThree, tone: "violet" },
  { href: "/admin/conversaciones", label: "Conversations", icon: ChatCircleText, tone: "teal" },
  { href: "/admin/planes", label: "Plans & pricing", icon: Tag, tone: "amber" },
  { href: "/admin/portafolio", label: "Portfolio", icon: ImageSquare, tone: "rose" },
  { href: "/admin/ajustes", label: "Site settings", icon: GearSix, tone: "violet" },
  // Multi-market (us/ca/ht + do), distinct from the DR-only sections above —
  // labeled "Market ..." so they don't read as duplicates of Leads / Plans.
  { href: "/admin/market-pricing", label: "Market Pricing", icon: CurrencyCircleDollar, tone: "amber" },
  { href: "/admin/market-content", label: "Market Content", icon: Translate, tone: "violet" },
  { href: "/admin/market-leads", label: "Market Leads", icon: MapPinLine, tone: "teal" },
  { href: "/admin/market-orders", label: "Market Orders", icon: Receipt, tone: "rose" },
];

// One literal class per tone: Tailwind needs the full strings in source to
// generate them, so this can't be built from a template at runtime.
const NAV_HOVER: Record<Tone, string> = {
  violet: "hover:bg-accent-soft hover:text-accent",
  amber: "hover:bg-warm-soft hover:text-warm-ink",
  teal: "hover:bg-teal-soft hover:text-teal-ink",
  rose: "hover:bg-rose-soft hover:text-rose-ink",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-[100dvh] bg-paper">
      {/* The one spot of the plum, drifting-blob treatment from the public
          site's hero and closing CTA: enough personality in the chrome that
          this doesn't feel like a bare CRUD tool, without competing with the
          data-dense content below it. */}
      <header className="relative isolate overflow-hidden border-b border-line bg-plum">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#a21caf]/40 blur-3xl" />
          <div className="animate-drift absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-[#6d2fd8]/45 blur-3xl [--drift-x:-40px] [animation-duration:22s]" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5 font-display font-semibold text-plum-ink">
            <Image src="/media/logo.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
            <span className="hidden sm:inline">Purple Cove Labs</span> Admin
          </Link>

          <nav aria-label="Admin navigation" className="order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
            <ul className="flex gap-1 text-[15px]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-plum-muted transition-colors duration-200",
                      NAV_HOVER[n.tone],
                    )}
                  >
                    <n.icon size={16} weight="bold" aria-hidden="true" />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 text-sm text-plum-muted">
            <span className="hidden md:inline">{user.email}</span>
            <Link href="/" target="_blank" className="hover:text-plum-ink">
              View site
            </Link>
            <form action={signOut}>
              <button type="submit" className="cursor-pointer hover:text-plum-ink">
                Sign out
              </button>
            </form>
            {/* Purely decorative: Oryn keeping an eye on things. No chat, no
                backend, just a friendly presence in the corner of "your"
                panel. */}
            <Image
              src="/media/oryn.webp"
              alt=""
              width={32}
              height={32}
              className="animate-float hidden h-8 w-8 shrink-0 rounded-full ring-2 ring-plum-accent/40 sm:block"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
