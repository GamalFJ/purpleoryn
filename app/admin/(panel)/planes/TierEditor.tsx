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
  conversations_included: number;
  conversation_overage: number | string;
  recommended: boolean;
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
          On the site: {formatRD(oneTime)} + {formatRD(monthly)}/mo
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <TextField name="name" label="Name" defaultValue={tier.name} required />
        <TextField name="one_time_price" label="One-time price (RD$)" defaultValue={oneTime.toFixed(2)} inputMode="decimal" required />
        <TextField name="monthly_price" label="Monthly price (RD$)" defaultValue={monthly.toFixed(2)} inputMode="decimal" required />
      </div>

      <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-[15px] font-medium">
        <input type="checkbox" name="recommended" defaultChecked={tier.recommended} className="h-5 w-5 accent-[var(--accent)]" />
        Recommended plan (&ldquo;Recommended&rdquo; badge; only one at a time)
      </label>

      <h3 className="mt-8 text-lg font-semibold">Homepage summary</h3>
      <div className="mt-4 grid gap-5">
        <TextField name="tagline" label="Who it's for" defaultValue={tier.tagline} />
        <TextField
          name="highlights"
          label="Highlights"
          defaultValue={tier.highlights.join("\n")}
          multiline
          rows={4}
          help="One per line. Maximum 8."
        />
      </div>

      <h3 className="mt-8 text-lg font-semibold">Comparison table</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <TextField name="website" label="Website" defaultValue={tier.website} multiline />
        <TextField name="seo" label="SEO" defaultValue={tier.seo} multiline />
        <TextField name="gbp" label="Google Business Profile" defaultValue={tier.gbp} multiline />
        <TextField name="analytics" label="Analytics" defaultValue={tier.analytics} multiline />
        <TextField name="ai_agent" label="AI agent" defaultValue={tier.ai_agent} multiline />
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="conversations_included"
              label="Conversations included per month"
              defaultValue={tier.conversations_included}
              inputMode="numeric"
              required
            />
            <TextField
              name="conversation_overage"
              label="Extra conversation (RD$)"
              defaultValue={Number(tier.conversation_overage).toFixed(2)}
              inputMode="decimal"
              required
            />
          </div>
          <TextField name="support" label="Support" defaultValue={tier.support} />
        </div>
      </div>

      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Save ${tier.name}`} />
      </div>
    </form>
  );
}
