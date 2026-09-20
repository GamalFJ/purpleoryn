"use client";

import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import { MARKET_CONTENT_SECTIONS } from "@/lib/marketContent";
import { upsertMarketContent } from "../actions";

interface ContentRow {
  market_id: string;
  section_key: string;
  content: string;
}

export function MarketContentEditor({ marketId, marketName, content }: { marketId: string; marketName: string; content: ContentRow[] }) {
  const { state, pending, onSubmit } = useAdminForm(upsertMarketContent.bind(null, marketId));
  const valueFor = (key: string) => content.find((c) => c.section_key === key)?.content ?? "";

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">{marketName}</h2>
      <div className="mt-6 grid gap-5">
        {MARKET_CONTENT_SECTIONS.map((s) => (
          <TextField key={s.key} name={s.key} label={s.label} defaultValue={valueFor(s.key)} multiline rows={s.key.includes("headline") ? 2 : 3} />
        ))}
      </div>
      <div className="mt-8">
        <SaveBar state={state} pending={pending} label={`Save ${marketName} content`} />
      </div>
    </form>
  );
}
