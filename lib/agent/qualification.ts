// What the visitor has told Oryn, kept in chat_sessions.qualification so the
// conversation does not depend on the last few messages alone. Purpose:
// conversational continuity, not lead creation. Only whitelisted keys, length-
// capped, and never contact details (phone, email, links, handles).

export const APPOINTMENTS_OR_ORDERS = ["appointments", "orders", "both", "neither"] as const;
// What the business sells, from the visitor's own description.
export const BUSINESS_MODELS = ["products", "services", "both"] as const;
// What the visitor wants the agent to do with THEIR customers (drives the plan, see plan-rubric.ts):
// presence_only = digital presence plus answering a few questions (a launch or a start-up);
// qualify_followup = qualify each lead and follow up, the owner closes;
// agent_completes = the agent books the appointment or takes the order by itself;
// unsure = the visitor does not know what they want.
export const CUSTOMER_INTERACTIONS = ["presence_only", "qualify_followup", "agent_completes", "unsure"] as const;

export interface Qualification {
  business_type?: string;
  has_website?: boolean;
  has_google_profile?: boolean;
  customer_channel?: string;
  appointments_or_orders?: (typeof APPOINTMENTS_OR_ORDERS)[number];
  average_sale?: number;
  goal?: string;
  timing?: string;
  pain?: string;
  business_model?: (typeof BUSINESS_MODELS)[number];
  customer_interaction?: (typeof CUSTOMER_INTERACTIONS)[number];
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
  "pain",
  "business_model",
  "customer_interaction",
];

const TEXT_LIMITS = { business_type: 80, customer_channel: 80, goal: 120, timing: 60, pain: 120 } as const;
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

  for (const key of ["business_type", "customer_channel", "goal", "timing", "pain"] as const) {
    const text = cleanText(src[key], TEXT_LIMITS[key]);
    if (text) out[key] = text;
  }
  if (typeof src.has_website === "boolean") out.has_website = src.has_website;
  if (typeof src.has_google_profile === "boolean") out.has_google_profile = src.has_google_profile;
  if (typeof src.appointments_or_orders === "string" && (APPOINTMENTS_OR_ORDERS as readonly string[]).includes(src.appointments_or_orders)) {
    out.appointments_or_orders = src.appointments_or_orders as Qualification["appointments_or_orders"];
  }
  if (typeof src.business_model === "string" && (BUSINESS_MODELS as readonly string[]).includes(src.business_model)) {
    out.business_model = src.business_model as Qualification["business_model"];
  }
  if (typeof src.customer_interaction === "string" && (CUSTOMER_INTERACTIONS as readonly string[]).includes(src.customer_interaction)) {
    out.customer_interaction = src.customer_interaction as Qualification["customer_interaction"];
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
  average_sale: "what a customer spends in ONE typical purchase or order, in RD$ (not a unit price, a volume or a daily or monthly total)",
  goal: "their main goal",
  timing: "how soon they want to start",
  pain: "what is not working in their business today, for example how customers reach them and what slips through",
  business_model: "whether they sell products, services or both",
  customer_interaction:
    "how they want the agent to deal with their customers: only give information and pass them on, qualify each lead and follow up while the owner closes, or take the appointment or order by itself",
};

export function isKnown(known: Qualification, key: QualificationKey): boolean {
  return known[key] !== undefined;
}

export function nextMissing(known: Qualification, order: readonly QualificationKey[]): QualificationKey | null {
  return order.find((key) => !isKnown(known, key)) ?? null;
}
