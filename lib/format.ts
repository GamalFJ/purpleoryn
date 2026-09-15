// Prices always render as "RD$15,499.99": RD$ prefix, no space, two decimals.
const rd = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatRD(amount: number): string {
  return `RD$${rd.format(amount)}`;
}

const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatCount(n: number): string {
  return count.format(n);
}
