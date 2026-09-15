import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import { calUrl } from "@/lib/links";
import { CTA, NAV_LINKS, SITE } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name}, inicio`}>
          <Image src="/media/logo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-full" priority />
          <span className="hidden font-display text-[17px] font-semibold tracking-tight sm:inline">{SITE.name}</span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-7 text-[15px] text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Visible at every width: roughly half the traffic is mobile. */}
        <TrackedLink
          href={calUrl()}
          event="cal_click"
          location="header"
          className={buttonClass("primary", "sm", "ml-auto md:ml-6")}
        >
          {CTA.call}
        </TrackedLink>

        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
