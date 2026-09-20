import Image from "next/image";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { getCurrentMarket } from "@/lib/market";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Coming soon",
  description: "This market's site is launching soon.",
  path: "/coming-soon",
  noIndex: true,
});

// Middleware sends every public route to this page for a market not yet in
// READY_MARKETS (see middleware.ts). Deliberately placeholder, English-only
// copy: real per-market translated marketing content is still pending, not
// something to invent here.
export default async function ComingSoonPage() {
  const { market } = await getCurrentMarket();

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-4 text-center">
      <Image src="/media/logo.webp" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
      <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">
        {SITE.name} is coming to {market?.name ?? "your market"}
      </h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-body">
        We&apos;re still setting things up here. In the meantime, reach out directly and we&apos;ll get back to you.
      </p>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-6 py-3 text-base font-medium text-ink transition-colors duration-200 hover:border-accent/40 hover:text-accent"
      >
        <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
        {SITE.email}
      </a>
    </main>
  );
}
