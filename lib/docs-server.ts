import { readFile } from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";

// Serves the two downloadable PDFs at their existing same-origin URLs
// (/docs/oryn-presence.pdf, /docs/como-trabajamos.pdf), so every consumer —
// DownloadLink, the AI agent's prompt, servicios/page.tsx — keeps working
// without changes. The admin panel can override either file (see
// app/admin/(panel)/ajustes); with no override, the bundled default under
// public/docs/default is served instead. Proxying the bytes (not redirecting
// to the Supabase Storage URL) keeps the response same-origin, which is what
// makes the anchor's `download` attribute name the file correctly.
type DocSlug = "oryn-presence" | "como-trabajamos";

const SETTINGS_COLUMN: Record<DocSlug, string> = {
  "oryn-presence": "oryn_presence_doc_url",
  "como-trabajamos": "como_trabajamos_doc_url",
};

const DEFAULT_FILE: Record<DocSlug, string> = {
  "oryn-presence": "public/docs/default/oryn-presence.pdf",
  "como-trabajamos": "public/docs/default/como-trabajamos.pdf",
};

async function getOverrideUrl(slug: DocSlug): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const column = SETTINGS_COLUMN[slug];
  const { data } = await publicClient().from("site_settings").select(column).eq("id", 1).maybeSingle();
  const url = (data as Record<string, string> | null)?.[column];
  return url || null;
}

export async function servePdf(slug: DocSlug): Promise<Response> {
  const overrideUrl = await getOverrideUrl(slug);

  if (overrideUrl) {
    const upstream = await fetch(overrideUrl, { cache: "no-store" });
    if (upstream.ok && upstream.body) {
      return new Response(upstream.body, {
        headers: { "Content-Type": "application/pdf", "Cache-Control": "public, max-age=300" },
      });
    }
  }

  const file = await readFile(path.join(process.cwd(), DEFAULT_FILE[slug]));
  return new Response(new Uint8Array(file), {
    headers: { "Content-Type": "application/pdf", "Cache-Control": "public, max-age=3600" },
  });
}
