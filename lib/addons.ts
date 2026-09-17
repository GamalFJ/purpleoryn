import { formatCount, formatRD } from "@/lib/format";

// Add-ons are sold on top of a plan and are never shown as a fourth plan
// card. Table `addons` owns this data; DEFAULT_ADDONS is the seed and the
// fallback when the database is unreachable.
export interface Addon {
  slug: string;
  name: string;
  description: string;
  oneTime: number;
  monthly: number;
  includedUnits: number;
  // Plural unit name, e.g. "minutos".
  unitLabel: string;
  overageRate: number;
}

// Section anchor on /servicios.
export const ADDONS_ANCHOR = "complementos";

export const DEFAULT_ADDONS: Addon[] = [
  {
    slug: "agente-de-voz",
    name: "Agente de Voz IA",
    description: "Un agente de IA que contesta las llamadas de tu negocio.",
    oneTime: 20000,
    monthly: 2199.99,
    includedUnits: 150,
    unitLabel: "minutos",
    overageRate: 16,
  },
];

// "150 minutos al mes. Cada minuto adicional: RD$16.00"
export function addonUsageText(a: Pick<Addon, "includedUnits" | "unitLabel" | "overageRate">): string {
  const singular = a.unitLabel.replace(/s$/, "");
  return `${formatCount(a.includedUnits)} ${a.unitLabel} al mes. Cada ${singular} adicional: ${formatRD(a.overageRate)}`;
}
