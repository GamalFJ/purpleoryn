"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { MEDIA_BUCKET, storagePathFromUrl } from "@/lib/storage";
import { LEAD_STATUSES } from "@/lib/leads";
import { isTierSlug } from "@/lib/tiers";

export type AdminActionState = { status: "idle" } | { status: "saved"; message: string } | { status: "error"; message: string };

const text = (max: number) => z.string().trim().max(max);

// Public pages cache for 5 minutes; saving refreshes them immediately.
function refreshPublicSite() {
  revalidatePath("/", "layout");
}

async function removeStorageObjects(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], urls: (string | null | undefined)[]) {
  const paths = urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p));
  if (paths.length) await supabase.storage.from(MEDIA_BUCKET).remove(paths);
}

function parseWhole(raw: FormDataEntryValue | null) {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
}

function parsePrice(raw: FormDataEntryValue | null) {
  const n = Number(String(raw ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

// ─── tiers ──────────────────────────────────────────────────────────────────
const tierSchema = z.object({
  name: text(40).min(2, "El nombre es obligatorio."),
  one_time_price: z.number().min(0, "Precio inválido."),
  monthly_price: z.number().min(0, "Precio inválido."),
  website: text(600),
  seo: text(600),
  gbp: text(600),
  analytics: text(600),
  ai_agent: text(600),
  conversations_included: z.number({ message: "Conversaciones incluidas inválidas." }).int().min(0).max(1_000_000),
  conversation_overage: z.number().min(0, "Precio de conversación adicional inválido."),
  support: text(300),
  tagline: text(200),
  highlights: z.array(text(120)).max(8, "Máximo 8 puntos destacados."),
  recommended: z.boolean(),
});

export async function updateTier(slug: string, _prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  if (!isTierSlug(slug)) return { status: "error", message: "Plan desconocido." };

  const parsed = tierSchema.safeParse({
    name: formData.get("name"),
    one_time_price: parsePrice(formData.get("one_time_price")),
    monthly_price: parsePrice(formData.get("monthly_price")),
    website: formData.get("website"),
    seo: formData.get("seo"),
    gbp: formData.get("gbp"),
    analytics: formData.get("analytics"),
    ai_agent: formData.get("ai_agent"),
    conversations_included: parseWhole(formData.get("conversations_included")),
    conversation_overage: parsePrice(formData.get("conversation_overage")),
    support: formData.get("support"),
    tagline: formData.get("tagline"),
    highlights: String(formData.get("highlights") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    recommended: formData.get("recommended") === "on",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los campos." };

  // Only one plan can be recommended (unique index): clear the others first.
  if (parsed.data.recommended) {
    const { error } = await supabase.from("tiers").update({ recommended: false }).neq("slug", slug).eq("recommended", true);
    if (error) return { status: "error", message: "No se pudo guardar. Vuelve a intentarlo." };
  }
  const { error } = await supabase.from("tiers").update(parsed.data).eq("slug", slug);
  if (error) return { status: "error", message: "No se pudo guardar. Vuelve a intentarlo." };

  refreshPublicSite();
  return { status: "saved", message: `Plan ${parsed.data.name} guardado.` };
}

// ─── add-ons ────────────────────────────────────────────────────────────────
const addonSchema = z.object({
  name: text(60).min(2, "El nombre es obligatorio."),
  description: text(300),
  one_time_price: z.number().min(0, "Precio inválido."),
  monthly_price: z.number().min(0, "Precio inválido."),
  included_units: z.number({ message: "Cantidad incluida inválida." }).int().min(0).max(1_000_000),
  unit_label: text(30).min(1, "Escribe la unidad, por ejemplo minutos."),
  overage_rate: z.number().min(0, "Precio por unidad adicional inválido."),
  published: z.boolean(),
});

export async function updateAddon(slug: string, _prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = addonSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    one_time_price: parsePrice(formData.get("one_time_price")),
    monthly_price: parsePrice(formData.get("monthly_price")),
    included_units: parseWhole(formData.get("included_units")),
    unit_label: formData.get("unit_label"),
    overage_rate: parsePrice(formData.get("overage_rate")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los campos." };

  const { error } = await supabase.from("addons").update(parsed.data).eq("slug", slug);
  if (error) return { status: "error", message: "No se pudo guardar. Vuelve a intentarlo." };

  refreshPublicSite();
  return { status: "saved", message: `${parsed.data.name} guardado.` };
}

// ─── site settings ──────────────────────────────────────────────────────────
const settingsSchema = z.object({
  hero_headline: text(140),
  hero_subheadline: text(220),
  hero_image_url: text(500),
  about_image_url: text(500),
  about_bio: text(1200),
});

export async function updateSettings(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los campos." };

  const { data: before } = await supabase.from("site_settings").select("hero_image_url, about_image_url").eq("id", 1).single();
  const { error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1);
  if (error) return { status: "error", message: "No se pudo guardar. Vuelve a intentarlo." };

  // Delete images that were replaced or removed.
  await removeStorageObjects(supabase, [
    before?.hero_image_url !== parsed.data.hero_image_url ? before?.hero_image_url : null,
    before?.about_image_url !== parsed.data.about_image_url ? before?.about_image_url : null,
  ]);

  refreshPublicSite();
  return { status: "saved", message: "Ajustes guardados." };
}

// ─── portfolio ──────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const portfolioSchema = z
  .object({
    title: text(120).min(2, "El título es obligatorio."),
    slug: text(80),
    summary: text(300),
    description: text(4000),
    results: text(400),
    results_source: text(200),
    link: text(300).refine((v) => v === "" || /^https?:\/\//.test(v), "El enlace debe empezar con https://"),
    cover_image_url: text(500),
    image_urls: z.array(text(500)).max(12, "Máximo 12 imágenes en la galería."),
    published: z.boolean(),
    sort_order: z.number().int().min(0).max(999),
  })
  .refine((v) => !v.published || v.results === "" || v.results_source !== "", {
    message: "Para publicar resultados, indica de dónde salen (fuente).",
  });

export async function savePortfolioItem(id: string | null, _prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();

  const parsed = portfolioSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    results: formData.get("results"),
    results_source: formData.get("results_source"),
    link: formData.get("link"),
    cover_image_url: formData.get("cover_image_url"),
    image_urls: formData.getAll("image_urls").map(String).filter(Boolean),
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Revisa los campos." };

  const v = parsed.data;
  const row = {
    title: v.title,
    slug: slugify(v.slug || v.title) || crypto.randomUUID().slice(0, 8),
    summary: v.summary,
    description: v.description,
    results: v.results,
    results_source: v.results_source,
    link: v.link || null,
    cover_image_url: v.cover_image_url || null,
    cover_image_path: storagePathFromUrl(v.cover_image_url),
    image_urls: v.image_urls,
    image_paths: v.image_urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p)),
    published: v.published,
    sort_order: v.sort_order,
  };

  if (id) {
    const { data: before } = await supabase.from("portfolio_items").select("cover_image_url, image_urls").eq("id", id).single();
    const { error } = await supabase.from("portfolio_items").update(row).eq("id", id);
    if (error) {
      return { status: "error", message: error.code === "23505" ? "Ya existe un caso con ese slug." : "No se pudo guardar." };
    }
    const keep = new Set([row.cover_image_url, ...row.image_urls]);
    await removeStorageObjects(
      supabase,
      [before?.cover_image_url, ...((before?.image_urls as string[] | null) ?? [])].filter((u) => u && !keep.has(u)),
    );
    refreshPublicSite();
    return { status: "saved", message: v.published ? "Caso guardado y publicado." : "Borrador guardado." };
  }

  const { data: created, error } = await supabase.from("portfolio_items").insert(row).select("id").single();
  if (error || !created) {
    return { status: "error", message: error?.code === "23505" ? "Ya existe un caso con ese slug." : "No se pudo crear el caso." };
  }
  refreshPublicSite();
  redirect(`/admin/portafolio/${created.id}?creado=1`);
}

export async function deletePortfolioItem(id: string) {
  const { supabase } = await requireAdmin();
  const { data: before } = await supabase.from("portfolio_items").select("cover_image_url, image_urls").eq("id", id).single();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (!error) {
    await removeStorageObjects(supabase, [before?.cover_image_url, ...((before?.image_urls as string[] | null) ?? [])]);
    refreshPublicSite();
  }
  redirect("/admin/portafolio");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─── leads ──────────────────────────────────────────────────────────────────
export async function updateLeadStatus(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = String(formData.get("status"));
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/prospectos", "layout");
}

export async function deleteLead(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("leads").delete().eq("id", id);
  revalidatePath("/admin/prospectos", "layout");
  redirect("/admin/prospectos");
}
