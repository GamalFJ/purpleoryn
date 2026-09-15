import { SUPABASE_URL } from "@/lib/supabase/env";

export const MEDIA_BUCKET = "site-media";

const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;

// Paths of objects we own, derived from their public URL. Anything else (the
// bundled /media defaults, external URLs) returns null and is never deleted.
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url || !SUPABASE_URL || !url.startsWith(PUBLIC_PREFIX)) return null;
  return decodeURIComponent(url.slice(PUBLIC_PREFIX.length).split("?")[0]);
}
