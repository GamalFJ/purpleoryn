// Every answer is derived from the tier table, the ROI method, the GBP service
// area or the client payment policy (brand/docs/pcl-politica-cliente.pdf).
// Nothing about delivery times or plan changes is stated because neither is
// defined yet.
import { BONUSES_TEXT, CAP_TEXT, GUARANTEE_TEXT } from "@/lib/offer";
import { SHOW_GUARANTEE } from "@/lib/site";

export const FAQ_ITEMS: { id: string; q: string; a: string }[] = [
  {
    id: "incluye",
    q: "¿Qué cubre el pago único y qué cubre la mensualidad?",
    a: "El pago único cubre la construcción: el sitio web, la configuración de su Google Business Profile, la analítica y el agente de IA. La mensualidad mantiene todo funcionando y cubre lo que se repite cada mes según su plan, como el soporte y las conversaciones del agente.",
  },
  {
    id: "retorno",
    q: "¿Cómo sé si la inversión vale la pena para mi negocio?",
    a: "Use la calculadora de la página de servicios. Con el valor promedio de una venta de su negocio le dice cuántas ventas necesita para recuperar la inversión del primer año y cuántas para triplicarla.",
  },
  {
    id: "empezar",
    q: "¿Necesito tener sitio web o perfil en Google antes de empezar?",
    a: "No. Los tres planes incluyen el sitio web y la configuración completa de su Google Business Profile.",
  },
  {
    id: "agente",
    q: "¿El agente de IA reemplaza a mi equipo?",
    a: "No. El agente responde las preguntas frecuentes, hace preguntas para calificar al cliente y se lo pasa a usted por WhatsApp con la información organizada. Usted o su equipo cierran la venta. En el plan Autoridad también agenda citas y toma pedidos.",
  },
  {
    id: "pago",
    q: "¿Cómo se paga?",
    a: "El pago único de su plan se divide 50% al confirmar su pedido y 50% contra entrega. Los módulos adicionales no siguen esa división: se pagan 100% por adelantado. La mensualidad (la de su plan más la de cualquier módulo adicional, sumadas en un solo cobro) no se paga por adelantado: se factura a partir del mes siguiente a la salida en vivo de su sistema. Aceptamos efectivo y transferencia bancaria.",
  },
  {
    id: "zonas",
    q: "¿En qué zonas trabajan?",
    a: "Nuestra área de servicio es Santo Domingo, Santo Domingo Este y Santo Domingo Oeste.",
  },
  ...(SHOW_GUARANTEE ? [{ id: "garantia", q: "¿Tienen garantía?", a: GUARANTEE_TEXT }] : []),
  { id: "bonos", q: "¿Qué bonos incluye cada plan?", a: BONUSES_TEXT },
  { id: "cupos", q: "¿Cuántos negocios nuevos aceptan por mes?", a: CAP_TEXT },
];
