import { SUPABASE_URL } from "@/lib/supabase/env";

export const MEDIA_BUCKET = "site-media";
export const DOCS_BUCKET = "site-docs";

function pathFromUrl(bucket: string, url: string | null | undefined): string | null {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
  if (!url || !SUPABASE_URL || !url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length).split("?")[0]);
}

// Paths of objects we own, derived from their public URL. Anything else (the
// bundled /media defaults, external URLs) returns null and is never deleted.
export function storagePathFromUrl(url: string | null | undefined): string | null {
  return pathFromUrl(MEDIA_BUCKET, url);
}

// Same idea for the uploaded-PDF bucket (site-docs).
export function docsPathFromUrl(url: string | null | undefined): string | null {
  return pathFromUrl(DOCS_BUCKET, url);
}
