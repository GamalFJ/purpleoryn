"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { DOCUMENTS, type DocumentSlug } from "@/lib/documents";

// A same-origin static PDF, saved under a readable name, that records which
// document was downloaded and from where.
export function DownloadLink({
  slug,
  location,
  className,
  children,
}: {
  // A slug, not the document object, so server pages don't serialise the
  // preview list into the client payload just to render a link.
  slug: DocumentSlug;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  const doc = DOCUMENTS[slug];
  return (
    <a
      href={doc.href}
      download={doc.fileName}
      type="application/pdf"
      className={className}
      onClick={() => track("document_download", { document: doc.slug, cta_location: location })}
    >
      {children}
    </a>
  );
}
