"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { submitLead } from "@/app/servicios/actions";
import { readAttribution, type Attribution } from "@/components/analytics/Attribution";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import { IconTile } from "@/components/ui/IconTile";
import { LEAD_FLAG, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatRD } from "@/lib/format";
import type { LeadActionState, LeadFieldErrors } from "@/lib/leads";
import { WHATSAPP_GENERAL, whatsappUrl } from "@/lib/links";
import { CTA } from "@/lib/site";
import type { Tier, TierSlug } from "@/lib/tiers";
import { usePlanSelection } from "./PlanSelection";

const fieldClass =
  "h-12 w-full rounded-[var(--radius-field)] border bg-paper px-4 text-base outline-none transition-colors focus:border-accent aria-[invalid=true]:border-danger";

function Field({
  name,
  label,
  optional,
  error,
  children,
}: {
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = `${useId()}-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label} {optional && <span className="font-normal text-muted">(opcional)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined })}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({ tiers }: { tiers: Tier[] }) {
  const { selected, select, averageSaleValue } = usePlanSelection();
  const [plan, setPlan] = useState<TierSlug | "">("");
  const [state, formAction, pending] = useActionState<LeadActionState, FormData>(submitLead, { status: "idle" });
  const [attribution, setAttribution] = useState<Attribution | null>(null);
  const startedAt = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    startedAt.current = Date.now();
    setAttribution(readAttribution());
  }, []);

  useEffect(() => {
    if (selected) setPlan(selected);
  }, [selected]);

  useEffect(() => {
    if (state.status !== "success") return;
    track("form_submitted", { plan: state.plan, form: "servicios_plan" });
    try {
      sessionStorage.setItem(LEAD_FLAG, state.plan);
    } catch {}
    router.push(`/gracias?plan=${encodeURIComponent(state.plan)}`);
  }, [state, router]);

  const errors: LeadFieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const chosen = tiers.find((t) => t.slug === plan);

  return (
    <section id="elegir-plan" aria-labelledby="formulario-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <IconTile icon={PaperPlaneTilt} tone="violet" size="lg" className="mb-5" />
          <h2 id="formulario-titulo" className="text-3xl font-semibold sm:text-4xl">
            {CTA.plan}
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-body">
            Envía tus datos y te contactamos por WhatsApp para confirmar los detalles antes de empezar.
          </p>
          <p className="mt-6 text-[15px] text-muted">
            ¿Prefieres escribir directo?{" "}
            <TrackedLink
              href={whatsappUrl(WHATSAPP_GENERAL)}
              event="whatsapp_click"
              location="servicios_form"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {CTA.whatsapp}
            </TrackedLink>
          </p>
        </div>

        <form
          // Submitted manually (not via `action`) so React doesn't reset the
          // fields when the server returns validation errors.
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            fd.set("started_at", String(startedAt.current));
            startTransition(() => formAction(fd));
          }}
          noValidate
          className="relative overflow-hidden rounded-[var(--radius-panel)] border border-accent/25 bg-surface p-6 shadow-[0_28px_60px_-40px_rgb(109_47_216/0.55)] sm:p-8"
        >
          <fieldset aria-describedby={errors.plan ? "plan-error" : undefined}>
            <legend className="text-[15px] font-semibold">Plan</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {tiers.map((t) => (
                <label
                  key={t.slug}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-[var(--radius-field)] border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    plan === t.slug ? "border-accent bg-accent-soft" : "border-line hover:border-accent",
                  )}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={t.slug}
                    checked={plan === t.slug}
                    onChange={() => {
                      setPlan(t.slug);
                      select(t.slug, "lead_form");
                    }}
                    className="sr-only"
                  />
                  <span className="font-medium">{t.name}</span>
                  <span className="tabular mt-1 text-sm text-muted">{formatRD(t.oneTime)}</span>
                </label>
              ))}
            </div>
            {errors.plan && (
              <p id="plan-error" className="mt-2 text-sm text-danger">
                {errors.plan}
              </p>
            )}
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Nombre y apellido" error={errors.name}>
              {(p) => <input {...p} name="name" autoComplete="name" required className={cn(fieldClass, "border-line")} />}
            </Field>
            <Field name="whatsapp" label="WhatsApp" error={errors.whatsapp}>
              {(p) => (
                <input {...p} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required className={cn(fieldClass, "border-line")} />
              )}
            </Field>
            <Field name="business" label="Nombre del negocio" error={errors.business}>
              {(p) => <input {...p} name="business" autoComplete="organization" required className={cn(fieldClass, "border-line")} />}
            </Field>
            <Field name="email" label="Correo" optional error={errors.email}>
              {(p) => <input {...p} name="email" type="email" autoComplete="email" className={cn(fieldClass, "border-line")} />}
            </Field>
            <div className="sm:col-span-2">
              <Field name="message" label="¿Algo que debamos saber?" optional error={errors.message}>
                {(p) => (
                  <textarea
                    {...p}
                    name="message"
                    rows={3}
                    className={cn(fieldClass, "h-auto resize-y border-line py-3")}
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Honeypot: hidden from people, filled by bots. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label>
              No llenar
              <input name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <input type="hidden" name="average_sale_value" value={averageSaleValue ?? ""} />
          <input type="hidden" name="utm_source" value={attribution?.utm_source ?? ""} />
          <input type="hidden" name="utm_medium" value={attribution?.utm_medium ?? ""} />
          <input type="hidden" name="utm_campaign" value={attribution?.utm_campaign ?? ""} />
          <input type="hidden" name="landing_page" value={attribution?.landing_page ?? ""} />
          <input type="hidden" name="referrer" value={attribution?.referrer ?? ""} />

          {state.status === "error" && (
            <p role="alert" className="mt-6 rounded-[var(--radius-field)] bg-danger/10 px-4 py-3 text-[15px] text-danger">
              {state.message}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Al enviar aceptas nuestra{" "}
              <Link href="/privacidad" className="underline underline-offset-2 hover:text-ink">
                política de privacidad
              </Link>
              .
            </p>
            <button type="submit" disabled={pending} className={buttonClass("primary", "lg", "shrink-0")}>
              {pending ? "Enviando..." : chosen ? `Solicitar plan ${chosen.name}` : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
