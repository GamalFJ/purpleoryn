// What the visitor has told Oryn, kept in chat_sessions.qualification so the
// conversation does not depend on the last few messages alone. Purpose:
// conversational continuity, not lead creation. Only whitelisted keys, length-
// capped, and never contact details (phone, email, links, handles).

export const APPOINTMENTS_OR_ORDERS = ["appointments", "orders", "both", "neither"] as const;

export interface Qualification {
  business_type?: string;
  has_website?: boolean;
  has_google_profile?: boolean;
  customer_channel?: string;
  appointments_or_orders?: (typeof APPOINTMENTS_OR_ORDERS)[number];
  average_sale?: number;
  goal?: string;
  timing?: string;
}

export type QualificationKey = keyof Qualification;

export const QUALIFICATION_KEYS: readonly QualificationKey[] = [
  "business_type",
  "has_website",
  "has_google_profile",
  "customer_channel",
  "appointments_or_orders",
  "average_sale",
  "goal",
  "timing",
];

const TEXT_LIMITS = { business_type: 80, customer_channel: 80, goal: 120, timing: 60 } as const;
const MAX_AVERAGE_SALE = 1_000_000_000;

// Anything that looks like an email, a link, a handle or a phone number.
const CONTACT_RE = /(@|https?:\/\/|www\.|\d[\d\s().-]{6,}\d)/i;

function cleanText(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  if (!text || CONTACT_RE.test(text)) return undefined;
  return text.slice(0, max);
}

// Used for tool arguments and for whatever is read back from the database:
// unknown keys, wrong types and contact-like text are dropped.
export function sanitizeQualification(raw: unknown): Qualification {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const out: Qualification = {};

  for (const key of ["business_type", "customer_channel", "goal", "timing"] as const) {
    const text = cleanText(src[key], TEXT_LIMITS[key]);
    if (text) out[key] = text;
  }
  if (typeof src.has_website === "boolean") out.has_website = src.has_website;
  if (typeof src.has_google_profile === "boolean") out.has_google_profile = src.has_google_profile;
  if (typeof src.appointments_or_orders === "string" && (APPOINTMENTS_OR_ORDERS as readonly string[]).includes(src.appointments_or_orders)) {
    out.appointments_or_orders = src.appointments_or_orders as Qualification["appointments_or_orders"];
  }
  const sale = typeof src.average_sale === "number" ? src.average_sale : NaN;
  if (Number.isFinite(sale) && sale > 0 && sale <= MAX_AVERAGE_SALE) out.average_sale = Math.round(sale * 100) / 100;

  return out;
}

export function mergeQualification(known: Qualification, patch: Qualification): Qualification {
  return { ...known, ...patch };
}

// Order in which the next useful question is picked, per capability.
export const SALES_QUALIFICATION_ORDER: readonly QualificationKey[] = [
  "business_type",
  "appointments_or_orders",
  "average_sale",
  "has_website",
  "has_google_profile",
  "customer_channel",
];
// Enough to run the ROI method and pick a plan; the rest is optional.
export const SALES_ENOUGH: readonly QualificationKey[] = ["business_type", "appointments_or_orders", "average_sale"];
export const BOOKING_QUALIFICATION_ORDER: readonly QualificationKey[] = ["business_type", "goal", "timing"];

export const QUESTION_HINT: Record<QualificationKey, string> = {
  business_type: "what type of business they have",
  has_website: "whether they already have a website",
  has_google_profile: "whether they have a Google Business Profile",
  customer_channel: "how customers find them today",
  appointments_or_orders: "whether their customers need to book appointments or place orders",
  average_sale: "the average value of one sale, in RD$",
  goal: "their main goal",
  timing: "how soon they want to start",
};

export function isKnown(known: Qualification, key: QualificationKey): boolean {
  return known[key] !== undefined;
}

export function nextMissing(known: Qualification, order: readonly QualificationKey[]): QualificationKey | null {
  return order.find((key) => !isKnown(known, key)) ?? null;
}
