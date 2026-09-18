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

// The one payment rule that differs from the plans. Stated with these exact
// words wherever an add-on can be bought (order form, add-on section), and
// mirrored in the "Cómo trabajamos" document.
export const ADDON_PAYMENT_RULE =
  "Los módulos adicionales se pagan al 100% por adelantado, a diferencia de los planes, que se pagan 50% al inicio y 50% contra entrega.";

// What an order records about each add-on: the name and prices agreed to at
// submission time, so a later price change never rewrites a past order.
export interface AddonSnapshot {
  slug: string;
  name: string;
  oneTime: number;
  monthly: number;
}

export function addonSnapshot(a: Addon): AddonSnapshot {
  return { slug: a.slug, name: a.name, oneTime: a.oneTime, monthly: a.monthly };
}

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
