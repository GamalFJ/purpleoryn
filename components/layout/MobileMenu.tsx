"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { buttonClass } from "@/components/ui/button";
import { CTA } from "@/lib/site";

export function MobileMenu({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    // Matches Header's `lg:block` nav switch: below 1024px this is the only
    // way to reach the nav links.
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-accent-soft"
      >
        {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 border-b border-line bg-paper px-4 pb-6 pt-2 shadow-[0_24px_40px_-24px_rgb(28_16_48/0.35)]"
          >
            <nav aria-label="Menú móvil">
              <ul className="divide-y divide-line">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex h-14 items-center text-lg font-medium" onClick={() => setOpen(false)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/servicios#elegir-plan" className={buttonClass("secondary", "lg", "mt-4 w-full")} onClick={() => setOpen(false)}>
              {CTA.plan}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
