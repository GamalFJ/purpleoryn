"use client";

import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import { formatRD } from "@/lib/format";
import { updateAddon } from "../actions";

export interface AddonRow {
  slug: string;
  name: string;
  description: string;
  one_time_price: number | string;
  monthly_price: number | string;
  included_units: number;
  unit_label: string;
  overage_rate: number | string;
  published: boolean;
}

export function AddonEditor({ addon }: { addon: AddonRow }) {
  const { state, pending, onSubmit } = useAdminForm(updateAddon.bind(null, addon.slug));
  const oneTime = Number(addon.one_time_price);
  const monthly = Number(addon.monthly_price);

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl font-semibold">{addon.name}</h3>
        <p className="tabular text-sm text-muted">
          En el sitio: {formatRD(oneTime)} + {formatRD(monthly)}/mes
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <TextField name="name" label="Nombre" defaultValue={addon.name} required />
        <TextField name="one_time_price" label="Pago único (RD$)" defaultValue={oneTime.toFixed(2)} inputMode="decimal" required />
        <TextField name="monthly_price" label="Mensualidad (RD$)" defaultValue={monthly.toFixed(2)} inputMode="decimal" required />
      </div>

      <div className="mt-5 grid gap-5">
        <TextField name="description" label="Descripción (una línea)" defaultValue={addon.description} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <TextField name="included_units" label="Incluido al mes" defaultValue={addon.included_units} inputMode="numeric" required />
        <TextField name="unit_label" label="Unidad (en plural)" defaultValue={addon.unit_label} help="Ej.: minutos" required />
        <TextField
          name="overage_rate"
          label="Unidad adicional (RD$)"
          defaultValue={Number(addon.overage_rate).toFixed(2)}
          inputMode="decimal"
          required
        />
      </div>

      <label className="mt-6 flex w-fit cursor-pointer items-center gap-3 text-[15px] font-medium">
        <input type="checkbox" name="published" defaultChecked={addon.published} className="h-5 w-5 accent-[var(--accent)]" />
        Publicado en el sitio
      </label>

      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Guardar ${addon.name}`} />
      </div>
    </form>
  );
}
