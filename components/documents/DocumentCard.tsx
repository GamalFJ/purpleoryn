import Image from "next/image";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { documentMeta, type SiteDocument } from "@/lib/documents";
import { DownloadLink } from "./DownloadLink";

// The real pages of the document: the cover in front and, when there are
// any, two interior pages fanned behind it, so the preview shows what is
// inside rather than only a title page. Hovering spreads the fan.
function PageStack({ doc, width }: { doc: SiteDocument; width: number }) {
  const [cover, ...inside] = doc.previews;
  const h = Math.round(520 / doc.ratio);
  const page = "absolute inset-0 h-full w-full rounded-[5px] object-cover ring-1 ring-black/10";
  const motion = "transition-[translate,rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

  return (
    <span aria-hidden="true" className="relative block shrink-0" style={{ width, aspectRatio: doc.ratio }}>
      {inside.slice(0, 2).map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={520}
          height={h}
          className={cn(
            page,
            motion,
            "shadow-[0_10px_22px_-14px_rgb(28_16_48/0.7)]",
            i === 0
              ? "-translate-x-[16%] -rotate-6 group-hover:-translate-x-[26%] group-hover:-rotate-[9deg]"
              : "translate-x-[16%] rotate-6 group-hover:translate-x-[26%] group-hover:rotate-[9deg]",
          )}
        />
      ))}
      <Image
        src={cover}
        alt=""
        width={520}
        height={h}
        className={cn(page, motion, "shadow-[0_18px_34px_-16px_rgb(28_16_48/0.75)] group-hover:-translate-y-1")}
      />
    </span>
  );
}

// The whole card is one link, so there is a single, large target and a
// single tab stop per document.
export function DocumentCard({
  doc,
  location,
  variant = "feature",
  className,
}: {
  doc: SiteDocument;
  location: string;
  variant?: "feature" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <DownloadLink
        slug={doc.slug}
        location={location}
        className={cn(
          "group flex items-center gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-4 transition-colors hover:border-accent/40",
          className,
        )}
      >
        <PageStack doc={{ ...doc, previews: doc.previews.slice(0, 1) }} width={44} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">{doc.title}</span>
          <span className="mt-0.5 block text-sm text-muted">{documentMeta(doc)}</span>
        </span>
        <DownloadSimple
          size={22}
          weight="bold"
          aria-hidden="true"
          className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
        />
        <span className="sr-only">Descargar</span>
      </DownloadLink>
    );
  }

  return (
    <DownloadLink
      slug={doc.slug}
      location={location}
      className={cn(
        "group flex flex-col items-center gap-6 rounded-[var(--radius-panel)] border border-accent/25 bg-linear-to-br from-accent-soft via-surface to-surface p-6 shadow-[0_28px_60px_-44px_rgb(109_47_216/0.7)] transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_28px_60px_-36px_rgb(109_47_216/0.8)] sm:flex-row sm:items-center",
        className,
      )}
    >
      {/* Horizontal room for the fan so the rotated pages never clip. */}
      <span className="px-7 py-2">
        <PageStack doc={doc} width={112} />
      </span>
      <span className="min-w-0 text-center sm:text-left">
        <span className="block font-display text-xl font-semibold text-ink">{doc.title}</span>
        <span className="mt-1.5 block text-[15px] leading-relaxed text-body">{doc.description}</span>
        <span className={buttonClass("primary", "sm", "mt-4")}>
          <DownloadSimple size={18} weight="bold" aria-hidden="true" />
          Descargar el PDF
        </span>
        <span className="mt-2 block text-sm text-muted">{documentMeta(doc)}</span>
      </span>
    </DownloadLink>
  );
}
