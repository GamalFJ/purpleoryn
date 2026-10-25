import { SHOW_GUARANTEE } from "@/lib/site";

// Guarantee, bonuses and monthly intake cap. One source for the /servicios
// block, the note above the order button, the home FAQ and the Oryn agent.
// The guarantee exists only while SHOW_GUARANTEE is true.
export const GUARANTEE_TEXT =
  "Su sistema en vivo en 7 días hábiles desde que recibimos su primer pago, su formulario de configuración completo y su WhatsApp conectado. Si no cumplimos, su primera mensualidad va por nuestra cuenta.";

export const BONUSES_TEXT =
  "Con cualquier plan: su Lista de Lanzamiento en Google, para que vea cada paso que hacemos por usted, y la Guía de Respuestas Rápidas para WhatsApp para su equipo.";

export const CAP_TEXT = "Trabajo personalmente cada proyecto, por eso solo tomo 4 negocios nuevos por mes.";

export const OFFER_HEADING = SHOW_GUARANTEE ? "Garantía, bonos y cupos" : "Bonos y cupos";

export const OFFER_POINTS: { id: "garantia" | "bonos" | "cupos"; title: string; text: string; short: string }[] = [
  ...(SHOW_GUARANTEE
    ? [
        {
          id: "garantia" as const,
          title: "Garantía",
          text: GUARANTEE_TEXT,
          short: "Su sistema en vivo en 7 días hábiles o su primera mensualidad va por nuestra cuenta.",
        },
      ]
    : []),
  { id: "bonos", title: "Bonos", text: BONUSES_TEXT, short: "Lista de Lanzamiento en Google y Guía de Respuestas Rápidas para WhatsApp." },
  { id: "cupos", title: "Cupos", text: CAP_TEXT, short: "Solo 4 negocios nuevos por mes." },
];
