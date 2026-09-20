"use client";

import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import { formatMarketPrice } from "@/lib/format";
import { updateMarketPricingTier } from "../actions";

export interface MarketPricingTierRow {
  id: string;
  market_id: string;
  tier_key: string;
  tier_name: string;
  one_time_price: number | null;
  monthly_price: number | null;
  conversation_cap: number | null;
  overage_rate: number | null;
  recommended: boolean;
  sort_order: number;
}

export function PricingTierEditor({ tier, currency }: { tier: MarketPricingTierRow; currency: string }) {
  const { state, pending, onSubmit } = useAdminForm(updateMarketPricingTier.bind(null, tier.id));

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold">
          {tier.tier_name} <span className="text-sm font-normal text-muted">({tier.tier_key})</span>
        </h3>
        <p className="tabular text-sm text-muted">
          On the site: {formatMarketPrice(tier.one_time_price, currency)} + {formatMarketPrice(tier.monthly_price, currency)}/mo
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <TextField name="tier_name" label="Name" defaultValue={tier.tier_name} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="one_time_price"
            label={`One-time price (${currency})`}
            defaultValue={tier.one_time_price ?? ""}
            inputMode="decimal"
            help="Blank = not shown on the public site."
          />
          <TextField
            name="monthly_price"
            label={`Monthly price (${currency})`}
            defaultValue={tier.monthly_price ?? ""}
            inputMode="decimal"
            help="Blank = not shown on the public site."
          />
          <TextField name="conversation_cap" label="Conversation cap" defaultValue={tier.conversation_cap ?? ""} inputMode="numeric" />
          <TextField name="overage_rate" label={`Extra conversation (${currency})`} defaultValue={tier.overage_rate ?? ""} inputMode="decimal" />
        </div>
      </div>

      <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-[15px] font-medium">
        <input type="checkbox" name="recommended" defaultChecked={tier.recommended} className="h-5 w-5 accent-[var(--accent)]" />
        Recommended tier for this market (only one at a time)
      </label>

      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Save ${tier.tier_name}`} />
      </div>
    </form>
  );
}
