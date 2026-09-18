"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { leadSchema, type LeadActionState, type LeadFieldErrors } from "@/lib/leads";
import { computeRoi } from "@/lib/roi";
import { addonSnapshot } from "@/lib/addons";
import { getAddons, getTiers } from "@/lib/content";
import { orderTotals } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/telegram";

const MIN_FILL_MS = 2500;

// Saves the order to Supabase. This is the record of truth: per the client
// "Cómo Trabajamos" document, a completed and submitted plan-selection form is
// a formal order, with the same weight as a WhatsApp or email approval. That is
// why `confirmed` is required here and not only in the UI. WhatsApp and Cal.com
// come after, on the confirmation page, as conveniences.
export async function submitLead(_prev: LeadActionState, formData: FormData): Promise<LeadActionState> {
  const field = (name: string) => String(formData.get(name) ?? "");

  // Spam guards: hidden honeypot field + a minimum time on the form.
  if (field("company_website")) return { status: "success", plan: field("plan"), addons: [] };
  const startedAt = Number(field("started_at"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "No pudimos enviar el formulario. Espera un momento y vuelve a intentarlo." };
  }

  const parsed = leadSchema.safeParse({
    plan: field("plan"),
    confirmed: field("confirmed"),
    addons: formData.getAll("addons").map(String),
    name: field("name"),
    whatsapp: field("whatsapp"),
    email: field("email"),
    business: field("business"),
    businessNiche: field("businessNiche"),
    socialHandle: field("socialHandle"),
    message: field("message"),
    averageSaleValue: field("average_sale_value"),
    utmSource: field("utm_source"),
    utmMedium: field("utm_medium"),
    utmCampaign: field("utm_campaign"),
    landingPage: field("landing_page"),
    referrer: field("referrer"),
  });

  if (!parsed.success) {
    const fieldErrors: LeadFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors };
  }

  const lead = parsed.data;
  const [tiers, addons] = await Promise.all([getTiers(), getAddons()]);
  const tier = tiers.find((t) => t.slug === lead.plan);

  // Prices come from the live table, never from the browser. An unknown slug
  // means the add-on was unpublished after the page loaded (or the form was
  // tampered with); a binding order must not silently drop part of itself.
  const chosenSlugs = [...new Set(lead.addons)];
  const chosenAddons = chosenSlugs.map((slug) => addons.find((a) => a.slug === slug));
  if (chosenAddons.some((a) => !a)) {
    return {
      status: "error",
      message: "Uno de los módulos que elegiste ya no está disponible. Recarga la página y revisa tu pedido.",
      fieldErrors: { addons: "Este módulo ya no está disponible." },
    };
  }
  const addonsSnapshot = chosenAddons.filter((a) => a !== undefined).map(addonSnapshot);

  if (!isSupabaseConfigured()) {
    console.error("[lead] Supabase is not configured; lead was not saved.");
    return {
      status: "error",
      message: "El formulario todavía no está conectado. Escríbenos por WhatsApp mientras tanto.",
    };
  }

  const roi =
    tier && lead.averageSaleValue
      ? { oneTime: tier.oneTime, monthly: tier.monthly, ...computeRoi({ oneTime: tier.oneTime, monthly: tier.monthly, averageSaleValue: lead.averageSaleValue }) }
      : null;

  const { error } = await publicClient()
    .from("leads")
    .insert({
      plan: lead.plan,
      name: lead.name,
      whatsapp: lead.whatsapp,
      email: lead.email || null,
      business: lead.business,
      business_niche: lead.businessNiche,
      social_handle: lead.socialHandle || null,
      message: lead.message || null,
      average_sale_value: lead.averageSaleValue,
      roi_snapshot: roi,
      addons: addonsSnapshot,
      source: "servicios_form",
      utm_source: lead.utmSource || null,
      utm_medium: lead.utmMedium || null,
      utm_campaign: lead.utmCampaign || null,
      landing_page: lead.landingPage || null,
      referrer: lead.referrer || null,
      user_agent: (await headers()).get("user-agent")?.slice(0, 300) ?? null,
    });

  if (error) {
    console.error("[lead] insert failed:", error.message);
    return {
      status: "error",
      message: "No pudimos guardar tu pedido. Vuelve a intentarlo o escríbenos por WhatsApp.",
    };
  }

  // Sent after the response so the visitor never waits on Telegram.
  after(() =>
    notifyNewLead({
      planName: tier?.name ?? null,
      addons: addonsSnapshot,
      totals: orderTotals(tier, addonsSnapshot),
      name: lead.name,
      business: lead.business,
      businessNiche: lead.businessNiche,
      socialHandle: lead.socialHandle || null,
      whatsapp: lead.whatsapp,
      email: lead.email || null,
      message: lead.message || null,
      averageSaleValue: lead.averageSaleValue,
      utmSource: lead.utmSource || null,
      landingPage: lead.landingPage || null,
    }),
  );

  return { status: "success", plan: lead.plan, addons: addonsSnapshot.map((a) => a.slug) };
}
