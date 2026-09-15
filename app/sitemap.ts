import type { MetadataRoute } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

// lastmod comes from the content that actually drives each page when the
// database is connected; static pages use the date their copy last changed.
async function latest(table: string, filter?: [string, boolean]): Promise<Date | null> {
  if (!isSupabaseConfigured()) return null;
  let query = publicClient().from(table).select("updated_at").order("updated_at", { ascending: false }).limit(1);
  if (filter) query = query.eq(filter[0], filter[1]);
  const { data } = await query;
  const value = data?.[0]?.updated_at;
  return typeof value === "string" ? new Date(value) : null;
}

const LAUNCH = new Date("2026-09-14");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tiers, settings, portfolio] = await Promise.all([
    latest("tiers"),
    latest("site_settings"),
    latest("portfolio_items", ["published", true]),
  ]);
  const max = (...dates: (Date | null)[]) => new Date(Math.max(LAUNCH.getTime(), ...dates.map((d) => d?.getTime() ?? 0)));

  return [
    { url: `${SITE.url}/`, lastModified: max(tiers, settings, portfolio), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/servicios`, lastModified: max(tiers), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/portafolio`, lastModified: max(portfolio), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/privacidad`, lastModified: LAUNCH, changeFrequency: "yearly", priority: 0.2 },
  ];
}
