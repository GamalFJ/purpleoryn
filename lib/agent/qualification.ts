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

// Evidence guard. The model decides what to save, but a fact is only kept if the visitor's own
// words support it. This is what stops a skipped question from being saved as "no" or "neither".
// Intentionally strict: a dropped fact only means the agent asks again.
const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const WEBSITE_RE = /\b(pagina|sitio|web|website|landing|dominio)\b/;
const GOOGLE_RE = /\b(google|perfil|ficha|maps|my business)\b/;
const ORDERS_RE = /\b(pedido|pedidos|orden|ordenes|encargo|encargos|compra|compras|compran|ordenan|piden|venta|ventas|vendo|vendemos)\b/;
const APPOINTMENTS_RE = /\b(cita|citas|reserva|reservas|reservan|reservar|agenda|agendar|agendan|turno|turnos|consulta|consultas|visita|visitas)\b/;
const NEITHER_RE = /\b(ninguno|ninguna|ningun)\b|\bni (citas|pedidos|reservas)\b|\bno (reservan|agendan|hacen pedidos|piden|necesitan (citas|pedidos))\b|\bsolo (informacion|consultas?|preguntas?|visitas?)\b/;

const STOPWORDS = new Set(["para", "como", "tengo", "quiero", "esta", "este", "sobre", "tipo", "algo", "unos", "unas", "pero", "porque", "cuando", "donde", "tiene", "hacer", "desde", "hasta", "entre"]);

function contentWords(text: string): Set<string> {
  return new Set(
    fold(text)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
  );
}

// Every number the visitor wrote: "2500", "2,500", "2.500", "2 500", "2.5k", "3 mil".
function numbersIn(text: string): number[] {
  const out: number[] = [];
  const t = fold(text);
  for (const m of t.matchAll(/(\d+(?:[.,]\d+)?)\s*(k|mil)\b/g)) out.push(parseFloat(m[1].replace(",", ".")) * 1000);
  for (const m of t.matchAll(/\d{1,3}(?:[.,\s]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?/g)) {
    const raw = m[0];
    const grouped = raw.replace(/[.,\s](?=\d{3}(?:\D|$))/g, "");
    out.push(parseFloat(grouped.replace(",", ".")));
  }
  return out.filter((n) => Number.isFinite(n));
}

// `allowRubricKeys` stays false until the prompt asks for business_model and customer_interaction:
// until then the model has no business writing them, and the plan rubric reads them.
export function guardQualification(patch: Qualification, visitorText: string, options: { allowRubricKeys?: boolean } = {}): Qualification {
  const text = fold(visitorText);
  const words = contentWords(visitorText);
  const out: Qualification = {};

  for (const key of ["business_type", "customer_channel", "goal", "timing", "pain"] as const) {
    const value = patch[key];
    if (value && [...contentWords(value)].some((w) => words.has(w))) out[key] = value;
  }
  if (patch.has_website !== undefined && WEBSITE_RE.test(text)) out.has_website = patch.has_website;
  if (patch.has_google_profile !== undefined && GOOGLE_RE.test(text)) out.has_google_profile = patch.has_google_profile;
  if (patch.appointments_or_orders) {
    const hasOrders = ORDERS_RE.test(text);
    const hasAppointments = APPOINTMENTS_RE.test(text);
    const ok =
      patch.appointments_or_orders === "orders"
        ? hasOrders
        : patch.appointments_or_orders === "appointments"
          ? hasAppointments
          : patch.appointments_or_orders === "both"
            ? hasOrders && hasAppointments
            : NEITHER_RE.test(text);
    if (ok) out.appointments_or_orders = patch.appointments_or_orders;
  }
  if (patch.average_sale !== undefined && numbersIn(visitorText).some((n) => Math.abs(n - patch.average_sale!) < 0.01)) {
    out.average_sale = patch.average_sale;
  }
  if (options.allowRubricKeys) {
    if (patch.business_model) out.business_model = patch.business_model;
    if (patch.customer_interaction) out.customer_interaction = patch.customer_interaction;
  }
  return out;
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
