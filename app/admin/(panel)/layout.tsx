import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/prospectos", label: "Prospectos" },
  { href: "/admin/conversaciones", label: "Conversaciones" },
  { href: "/admin/planes", label: "Planes y precios" },
  { href: "/admin/portafolio", label: "Portafolio" },
  { href: "/admin/ajustes", label: "Ajustes del sitio" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-[100dvh]">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-display font-semibold">
            <Image src="/media/logo.webp" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
            Panel
          </Link>
          <nav aria-label="Panel" className="order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
            <ul className="flex gap-1 text-[15px]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block whitespace-nowrap rounded-full px-3 py-2 text-muted hover:bg-accent-soft hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm text-muted">
            <span className="hidden sm:inline">{user.email}</span>
            <Link href="/" target="_blank" className="hover:text-ink">
              Ver sitio
            </Link>
            <form action={signOut}>
              <button type="submit" className="cursor-pointer hover:text-ink">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
