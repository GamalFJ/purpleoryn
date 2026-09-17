import { publicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DEFAULT_ADDONS, type Addon } from "@/lib/addons";
import { DEFAULT_TIERS, isTierSlug, type Tier } from "@/lib/tiers";

export interface SiteSettings {
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  aboutBio: string;
}

// PLACEHOLDER COPY — pending Gamal's real hero headline and bio. Factual only:
// what PCL sells (from the tier table) and who runs it. Replace in the admin
// panel's site settings; no code change needed.
export const DEFAULT_SETTINGS: SiteSettings = {
  heroHeadline: "Sitios web, SEO y agentes de IA para negocios en Santo Domingo",
  heroSubheadline: "Tres planes con precio fijo para que tu negocio aparezca en Google y reciba clientes por WhatsApp.",
  heroImageUrl: "/media/fundador.webp",
  aboutImageUrl: "/media/fundador-2.webp",
  aboutBio:
    "Purple Cove Labs es un estudio de desarrollo web e inteligencia artificial fundado por Gamal Jastram. Trabajamos con negocios de Santo Domingo, Santo Domingo Este y Santo Domingo Oeste.",
};

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  results: string;
  resultsSource: string;
  link: string | null;
  coverImageUrl: string | null;
  imageUrls: string[];
}

type Row = Record<string, unknown>;
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : typeof v === "string" ? Number(v) : fallback);

export async function getTiers(): Promise<Tier[]> {
  if (!isSupabaseConfigured()) return DEFAULT_TIERS;
  const { data, error } = await publicClient().from("tiers").select("*").order("sort_order");
  if (error || !data?.length) return DEFAULT_TIERS;
  return (data as Row[])
    .filter((r) => isTierSlug(r.slug))
    .map((r) => mapTier(r));
}

// Columns added by 20260916000000_pricing_addons.sql fall back to the defaults
// until that migration is applied, so a deploy can't show "0 al mes".
function mapTier(r: Row): Tier {
  const fallback = DEFAULT_TIERS.find((d) => d.slug === r.slug) ?? DEFAULT_TIERS[0];
  const has = (col: string) => col in r && r[col] !== null;
  return {
    slug: r.slug as Tier["slug"],
    name: str(r.name),
    oneTime: num(r.one_time_price),
    monthly: num(r.monthly_price),
    website: str(r.website),
    seo: str(r.seo),
    gbp: str(r.gbp),
    analytics: str(r.analytics),
    aiAgent: str(r.ai_agent),
    conversationsIncluded: has("conversations_included") ? num(r.conversations_included) : fallback.conversationsIncluded,
    conversationOverage: has("conversation_overage") ? num(r.conversation_overage) : fallback.conversationOverage,
    support: str(r.support),
    tagline: str(r.tagline),
    highlights: Array.isArray(r.highlights) ? (r.highlights as string[]) : [],
    recommended: has("recommended") ? r.recommended === true : fallback.recommended,
  };
}

export async function getAddons(): Promise<Addon[]> {
  if (!isSupabaseConfigured()) return DEFAULT_ADDONS;
  const { data, error } = await publicClient().from("addons").select("*").eq("published", true).order("sort_order");
  if (error || !data) return DEFAULT_ADDONS;
  return (data as Row[]).map((r) => ({
    slug: str(r.slug),
    name: str(r.name),
    description: str(r.description),
    oneTime: num(r.one_time_price),
    monthly: num(r.monthly_price),
    includedUnits: num(r.included_units),
    unitLabel: str(r.unit_label),
    overageRate: num(r.overage_rate),
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;
  const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  const r = data as Row;
  return {
    heroHeadline: str(r.hero_headline) || DEFAULT_SETTINGS.heroHeadline,
    heroSubheadline: str(r.hero_subheadline) || DEFAULT_SETTINGS.heroSubheadline,
    heroImageUrl: str(r.hero_image_url) || DEFAULT_SETTINGS.heroImageUrl,
    aboutImageUrl: str(r.about_image_url) || DEFAULT_SETTINGS.aboutImageUrl,
    aboutBio: str(r.about_bio) || DEFAULT_SETTINGS.aboutBio,
  };
}

export async function getPortfolio(limit?: number): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured()) return [];
  let query = publicClient()
    .from("portfolio_items")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as Row[]).map((r) => ({
    id: str(r.id),
    slug: str(r.slug),
    title: str(r.title),
    summary: str(r.summary),
    description: str(r.description),
    results: str(r.results),
    resultsSource: str(r.results_source),
    link: str(r.link) || null,
    coverImageUrl: str(r.cover_image_url) || null,
    imageUrls: Array.isArray(r.image_urls) ? (r.image_urls as string[]) : [],
  }));
}
