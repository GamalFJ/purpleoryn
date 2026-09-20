// Status values for market_leads (multi-market). Deliberately English, unlike
// leads.status (Spanish) -- these are the actual DB values, not a display
// translation, matching the default set in the Phase 1 schema.
export const MARKET_LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type MarketLeadStatus = (typeof MARKET_LEAD_STATUSES)[number];

export const MARKET_LEAD_STATUS_LABEL: Record<MarketLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const MARKET_LEAD_STATUS_BADGE: Record<MarketLeadStatus, string> = {
  new: "bg-accent text-accent-ink",
  contacted: "bg-teal-soft text-teal-ink",
  quoted: "bg-warm-soft text-warm-ink",
  won: "bg-success/15 text-success",
  lost: "bg-line text-muted",
};
