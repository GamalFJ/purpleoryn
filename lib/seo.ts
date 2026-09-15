import type { Metadata } from "next";
import { SITE } from "@/lib/site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

// Every page sets its own full Open Graph + Twitter block so nothing silently
// inherits the homepage's title/description. The og:image comes from each
// route's opengraph-image file.
export function pageMetadata({ title, description, path, noIndex }: PageMeta): Metadata {
  const url = new URL(path, SITE.url).toString();
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
