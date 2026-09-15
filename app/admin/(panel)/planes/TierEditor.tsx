"use client";

import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import { formatRD } from "@/lib/format";
import { updateTier } from "../actions";

export interface TierRow {
  slug: string;
  name: string;
  one_time_price: number | string;
  monthly_price: number | string;
  website: string;
  seo: string;
  gbp: string;
  analytics: string;
  ai_agent: string;
  conversation_cap: string;
  support: string;
  tagline: string;
  highlights: string[];
}

export function TierEditor({ tier }: { tier: TierRow }) {
  const { state, pending, onSubmit } = useAdminForm(updateTier.bind(null, tier.slug));
  const oneTime = Number(tier.one_time_price);
  const monthly = Number(tier.monthly_price);

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold">{tier.name}</h2>
        <p className="tabular text-sm text-muted">
          En el sitio: {formatRD(oneTime)} + {formatRD(monthly)}/mes
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <TextField name="name" label="Nombre" defaultValue={tier.name} required />
        <TextField name="one_time_price" label="Pago único (RD$)" defaultValue={oneTime.toFixed(2)} inputMode="decimal" required />
        <TextField name="monthly_price" label="Mensualidad (RD$)" defaultValue={monthly.toFixed(2)} inputMode="decimal" required />
      </div>

      <h3 className="mt-8 text-lg font-semibold">Resumen en la portada</h3>
      <div className="mt-4 grid gap-5">
        <TextField name="tagline" label="Para quién es" defaultValue={tier.tagline} />
        <TextField
          name="highlights"
          label="Puntos destacados"
          defaultValue={tier.highlights.join("\n")}
          multiline
          rows={4}
          help="Uno por línea. Máximo 8."
        />
      </div>

      <h3 className="mt-8 text-lg font-semibold">Tabla comparativa</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <TextField name="website" label="Sitio web" defaultValue={tier.website} multiline />
        <TextField name="seo" label="SEO" defaultValue={tier.seo} multiline />
        <TextField name="gbp" label="Google Business Profile" defaultValue={tier.gbp} multiline />
        <TextField name="analytics" label="Analítica" defaultValue={tier.analytics} multiline />
        <TextField name="ai_agent" label="Agente de IA" defaultValue={tier.ai_agent} multiline />
        <div className="grid gap-5">
          <TextField name="conversation_cap" label="Conversaciones del agente" defaultValue={tier.conversation_cap} />
          <TextField name="support" label="Soporte" defaultValue={tier.support} />
        </div>
      </div>

      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Guardar ${tier.name}`} />
      </div>
    </form>
  );
}
