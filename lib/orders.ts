// The order total is the plan plus every add-on, summed. Shared by the
// Telegram alert and the admin panel so the two never drift apart.
export interface OrderTotals {
  /** Due upfront: the plan's 50% (or the ROI snapshot's price if it differs) plus 100% of every add-on. */
  oneTime: number;
  /** The recurring monthly retainer once the system is live: plan + add-ons, summed. */
  monthly: number;
}

export function orderTotals(
  plan: { oneTime: number; monthly: number } | null | undefined,
  addons: { oneTime: number; monthly: number }[],
): OrderTotals {
  const addonOneTime = addons.reduce((sum, a) => sum + a.oneTime, 0);
  const addonMonthly = addons.reduce((sum, a) => sum + a.monthly, 0);
  return {
    oneTime: (plan?.oneTime ?? 0) + addonOneTime,
    monthly: (plan?.monthly ?? 0) + addonMonthly,
  };
}
