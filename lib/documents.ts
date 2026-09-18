// Downloadable documents, served as static files from public/docs. Page counts
// and sizes are stated up front because a prospect on mobile data should know
// what they are about to download.
export type DocumentSlug = "oryn-presence" | "como-trabajamos";

export interface SiteDocument {
  slug: DocumentSlug;
  title: string;
  description: string;
  href: string;
  /** Name the file is saved under. */
  fileName: string;
  pages: number;
  sizeLabel: string;
  /** Cover first, then interior pages shown fanned behind it. */
  previews: string[];
  /** Page aspect ratio, width / height. */
  ratio: number;
}

export const DOCUMENTS: Record<DocumentSlug, SiteDocument> = {
  "oryn-presence": {
    slug: "oryn-presence",
    title: "Oryn Presence",
    description: "El sistema completo antes de invertir: qué es, cómo funciona, los tres planes con su precio y el método Oryn ROI.",
    href: "/docs/oryn-presence.pdf",
    fileName: "Oryn Presence - Purple Cove Labs.pdf",
    pages: 19,
    sizeLabel: "4.5 MB",
    previews: [
      "/media/docs/oryn-presence-cover.webp",
      "/media/docs/oryn-presence-p03.webp",
      "/media/docs/oryn-presence-p13.webp",
    ],
    ratio: 612 / 792,
  },
  "como-trabajamos": {
    slug: "como-trabajamos",
    title: "Cómo trabajamos",
    description: "Los siete pasos del proyecto, los compromisos y las políticas, con la hoja de contacto autorizado para firmar.",
    href: "/docs/como-trabajamos.pdf",
    fileName: "Como Trabajamos - Purple Cove Labs.pdf",
    pages: 4,
    sizeLabel: "270 KB",
    previews: ["/media/docs/como-trabajamos-cover.webp"],
    ratio: 595 / 842,
  },
};

export function documentMeta(d: SiteDocument): string {
  return `PDF, ${d.pages} páginas, ${d.sizeLabel}`;
}
