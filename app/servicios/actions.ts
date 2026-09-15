"use server";

import { headers } from "next/headers";
import { leadSchema, type LeadActionState, type LeadFieldErrors } from "@/lib/leads";
import { computeRoi } from "@/lib/roi";
import { getTiers } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/server";

const MIN_FILL_MS = 2500;

// Saves the lead to Supabase. This is the record of truth: WhatsApp and Cal.com
// come after, on the thank-you page, as conveniences.
export async function submitLead(_prev: LeadActionState, formData: FormData): Promise<LeadActionState> {
  const field = (name: string) => String(formData.get(name) ?? "");

  // Spam guards: hidden honeypot field + a minimum time on the form.
  if (field("company_website")) return { status: "success", plan: field("plan") };
  const startedAt = Number(field("started_at"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "No pudimos enviar el formulario. Espera un momento y vuelve a intentarlo." };
  }

  const parsed = leadSchema.safeParse({
    plan: field("plan"),
    name: field("name"),
    whatsapp: field("whatsapp"),
    email: field("email"),
    business: field("business"),
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

  if (!isSupabaseConfigured()) {
    console.error("[lead] Supabase is not configured; lead was not saved.");
    return {
      status: "error",
      message: "El formulario todavía no está conectado. Escríbenos por WhatsApp mientras tanto.",
    };
  }

  const lead = parsed.data;
  const tier = (await getTiers()).find((t) => t.slug === lead.plan);
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
      message: lead.message || null,
      average_sale_value: lead.averageSaleValue,
      roi_snapshot: roi,
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
      message: "No pudimos guardar tu solicitud. Vuelve a intentarlo o escríbenos por WhatsApp.",
    };
  }

  return { status: "success", plan: lead.plan };
}
