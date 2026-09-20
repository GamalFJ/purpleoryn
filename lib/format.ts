// Prices always render as "RD$15,499.99": RD$ prefix, no space, two decimals.
const rd = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatRD(amount: number): string {
  return `RD$${rd.format(amount)}`;
}

// Market pricing spans currencies (DOP, USD, CAD); unlike formatRD, the
// symbol/placement follows the market's own currency, not a fixed RD$ prefix.
export function formatMarketPrice(amount: number | null, currency: string): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

// "1 venta", "14 ventas".
export function salesLabel(n: number): string {
  return `${formatCount(n)} ${n === 1 ? "venta" : "ventas"}`;
}

export function formatCount(n: number): string {
  return count.format(n);
}
