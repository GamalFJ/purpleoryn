// Free-form key/value copy per market. Add a field here (no schema change
// needed) to make it editable in /admin/market-content.
export const MARKET_CONTENT_SECTIONS = [
  { key: "hero_headline", label: "Hero headline" },
  { key: "hero_subheadline", label: "Hero subheadline" },
  { key: "pain_point", label: "Pain point" },
  { key: "cta_label", label: "CTA label" },
] as const;

export type MarketContentSectionKey = (typeof MARKET_CONTENT_SECTIONS)[number]["key"];
