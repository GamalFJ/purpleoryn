import { z } from "zod";

// Dominican numbers: 809/829/849 + 7 digits, optionally with the +1 country code.
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((d) => /^1?(809|829|849)\d{7}$/.test(d), "Escribe un número dominicano de 10 dígitos, por ejemplo 809-555-1234.")
  .transform((d) => `+1${d.slice(-10)}`);

export const leadSchema = z.object({
  plan: z.enum(["presencia", "conversion", "autoridad"], { message: "Elige un plan." }),
  // Sending this form is a formal order, so the confirmation is validated on
  // the server too: a disabled submit button is a courtesy, not a record.
  confirmed: z
    .string()
    .refine((v) => v === "on", "Marca la confirmación para enviar tu pedido."),
  // Add-on slugs; checked against the live `addons` table in the action.
  addons: z.array(z.string().trim().min(1).max(60)).max(10),
  name: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  whatsapp: phone,
  email: z
    .string()
    .trim()
    .max(160)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Revisa el correo o déjalo en blanco."),
  business: z.string().trim().min(2, "Escribe el nombre de tu negocio.").max(160),
  // Free text with on-page suggestions, not a fixed enum: a niche the list
  // doesn't cover must never be rejected.
  businessNiche: z.string().trim().min(2, "Escribe el rubro de tu negocio.").max(120),
  // Optional: a handle, or a link to any platform, not only Instagram.
  socialHandle: z.string().trim().max(200),
  message: z.string().trim().max(1500),
  averageSaleValue: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v > 0), "Valor inválido."),
  utmSource: z.string().max(120),
  utmMedium: z.string().max(120),
  utmCampaign: z.string().max(120),
  landingPage: z.string().max(300),
  referrer: z.string().max(300),
});

// Suggestions for the "rubro o tipo de negocio" field, offered through a
// native <datalist> so typing is never blocked: picking one is a shortcut,
// not a requirement. Matches the niches Purple Cove Labs actually serves.
export const BUSINESS_NICHE_SUGGESTIONS = [
  "Restaurante o comida",
  "Colmado o minimarket",
  "Tienda o boutique",
  "Ferretería",
  "Salón de belleza o spa",
  "Clínica dental",
  "Consultorio médico",
  "Veterinaria",
  "Bienes raíces",
  "Construcción",
  "Taller mecánico o autopartes",
  "Abogados o servicios legales",
  "Contabilidad o consultoría",
  "Educación o academia",
  "Fotografía o eventos",
  "Gimnasio o fitness",
  "Joyería",
  "Farmacia",
  "Imprenta o rotulación",
] as const;

export type LeadInput = z.input<typeof leadSchema>;

export type LeadFieldErrors = Partial<
  Record<
    | "plan"
    | "addons"
    | "confirmed"
    | "name"
    | "whatsapp"
    | "email"
    | "business"
    | "businessNiche"
    | "socialHandle"
    | "message",
    string
  >
>;

export type LeadActionState =
  | { status: "idle" }
  | { status: "success"; plan: string; addons: string[] }
  | { status: "error"; message: string; fieldErrors?: LeadFieldErrors };

export const LEAD_STATUSES = ["nuevo", "contactado", "propuesta", "ganado", "perdido"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// Displayed in the (English) admin panel; the keys themselves stay Spanish
// because they're the actual `leads.status` database values.
export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "New",
  contactado: "Contacted",
  propuesta: "Proposal sent",
  ganado: "Won",
  perdido: "Lost",
};
