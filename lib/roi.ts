// The Oryn ROI Method.
//   Year 1 Investment        = one-time + (retainer × 12)
//   Break-even sales         = Year 1 Investment ÷ ASV
//   3x target sales / year   = (Year 1 Investment × 3) ÷ ASV
//   3x target sales / month  = 3x target sales / year ÷ 12
export interface RoiInput {
  oneTime: number;
  monthly: number;
  averageSaleValue: number;
}

export interface RoiResult {
  yearOneInvestment: number;
  breakEvenSales: number;
  targetSalesPerYear: number;
  targetSalesPerMonth: number;
}

// Reads a typed amount ("15,000", "RD$2500.50"); null unless it is > 0.
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function computeRoi({ oneTime, monthly, averageSaleValue }: RoiInput): RoiResult | null {
  if (!(averageSaleValue > 0)) return null;
  const yearOneInvestment = oneTime + monthly * 12;
  const targetSalesPerYear = (yearOneInvestment * 3) / averageSaleValue;
  return {
    yearOneInvestment,
    breakEvenSales: yearOneInvestment / averageSaleValue,
    targetSalesPerYear,
    targetSalesPerMonth: targetSalesPerYear / 12,
  };
}
