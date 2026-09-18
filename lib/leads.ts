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
  name: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  whatsapp: phone,
  email: z
    .string()
    .trim()
    .max(160)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Revisa el correo o déjalo en blanco."),
  business: z.string().trim().min(2, "Escribe el nombre de tu negocio.").max(160),
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

export type LeadInput = z.input<typeof leadSchema>;

export type LeadFieldErrors = Partial<
  Record<"plan" | "confirmed" | "name" | "whatsapp" | "email" | "business" | "message", string>
>;

export type LeadActionState =
  | { status: "idle" }
  | { status: "success"; plan: string }
  | { status: "error"; message: string; fieldErrors?: LeadFieldErrors };

export const LEAD_STATUSES = ["nuevo", "contactado", "propuesta", "ganado", "perdido"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  propuesta: "Propuesta enviada",
  ganado: "Ganado",
  perdido: "Perdido",
};
