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
          On the site: {formatRD(oneTime)} + {formatRD(monthly)}/mo
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <TextField name="name" label="Name" defaultValue={addon.name} required />
        <TextField name="one_time_price" label="One-time price (RD$)" defaultValue={oneTime.toFixed(2)} inputMode="decimal" required />
        <TextField name="monthly_price" label="Monthly price (RD$)" defaultValue={monthly.toFixed(2)} inputMode="decimal" required />
      </div>

      <div className="mt-5 grid gap-5">
        <TextField name="description" label="Description (one line)" defaultValue={addon.description} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <TextField name="included_units" label="Included per month" defaultValue={addon.included_units} inputMode="numeric" required />
        <TextField name="unit_label" label="Unit (plural)" defaultValue={addon.unit_label} help="E.g.: minutes" required />
        <TextField
          name="overage_rate"
          label="Extra unit (RD$)"
          defaultValue={Number(addon.overage_rate).toFixed(2)}
          inputMode="decimal"
          required
        />
      </div>

      <label className="mt-6 flex w-fit cursor-pointer items-center gap-3 text-[15px] font-medium">
        <input type="checkbox" name="published" defaultChecked={addon.published} className="h-5 w-5 accent-[var(--accent)]" />
        Published on the site
      </label>

      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Save ${addon.name}`} />
      </div>
    </form>
  );
}
