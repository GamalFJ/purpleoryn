// Every answer is derived from the tier table, the ROI method, the GBP service
// area or the client payment policy (brand/docs/pcl-politica-cliente.pdf).
// Nothing about delivery times or plan changes is stated because neither is
// defined yet.
import { BONUSES_TEXT, CAP_TEXT, GUARANTEE_TEXT } from "@/lib/offer";
import { SHOW_GUARANTEE } from "@/lib/site";

export const FAQ_ITEMS: { id: string; q: string; a: string }[] = [
  {
    id: "incluye",
    q: "¿Qué incluye Oryn Presence?",
    a: "Oryn Presence incluye el diseño y desarrollo de su sitio web enfocado en conversión, la configuración completa de su Google Business Profile, analítica digital y un agente de IA que atiende clientes 24/7 y los transfiere calificados a WhatsApp. Cada nivel amplía el alcance de estas áreas según las metas de su negocio.",
  },
  {
    id: "retorno",
    q: "¿Cómo sé si mi negocio califica para Oryn Presence?",
    a: "Agende una asesoría de 20 minutos con nosotros. Evaluamos su volumen actual de clientes, su proceso de atención y sus metas comerciales para confirmar si Oryn Presence es la solución adecuada para su negocio.",
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
    q: "¿Cómo es el proceso de contratación?",
    a: "Iniciamos con una asesoría sin costo donde evaluamos su negocio y confirmamos si califica. Luego definimos el plan y alcance ideal para sus necesidades, y coordinamos los detalles de inicio y configuración.",
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
