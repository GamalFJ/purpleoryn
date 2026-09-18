import {
  CheckCircle,
  ClipboardText,
  CreditCard,
  FileText,
  Hammer,
  Microphone,
  MonitorPlay,
  RocketLaunch,
  type Icon,
} from "@phosphor-icons/react";
import type { Tone } from "@/lib/tone";

// The seven steps, the optional-modules branch and the road geometry they sit
// on. Source of truth for the copy is the client document "Cómo Trabajamos".
// Step 03's order language is kept word for word, because the document and the
// site have to say the same thing about what the /servicios form means. The
// document is written in usted; here it is tú, like the rest of the site.

export interface Waypoint {
  id: string;
  /** "01".."07", or null for the optional branch, which is not a step. */
  number: string | null;
  title: string;
  /** Shown on the road at rest. */
  short: string;
  /** Revealed on hover (desktop) or tap (touch). */
  detail: string;
  icon: Icon;
  tone: Tone;
}

export const STEPS: Waypoint[] = [
  {
    id: "presentacion",
    number: "01",
    title: "Presentación del Sistema",
    short: "Presentación",
    detail:
      "Según lo que mejor se ajuste a tu negocio, te mostramos purpleoryn.com funcionando en tiempo real, te preparamos una demostración rápida y específica, o te compartimos el documento Oryn Presence (Presencia), descargable desde el sitio, para que veas el sistema completo antes de invertir.",
    icon: MonitorPlay,
    tone: "teal",
  },
  {
    id: "propuesta",
    number: "02",
    title: "Propuesta",
    short: "Propuesta",
    detail:
      "Recibes por escrito el plan elegido (Presencia, Conversión o Autoridad), cualquier módulo adicional que decidas incluir, la inversión total con su calendario de pago (50% inicial y 50% final para el plan; 100% por adelantado para cualquier módulo adicional) y el plan de trabajo. Precio fijo según el plan, sin costos sorpresa.",
    icon: FileText,
    tone: "teal",
  },
  {
    id: "aprobacion-escrita",
    number: "03",
    title: "Aprobación Escrita",
    short: "Aprobación",
    detail:
      "Confirmas por WhatsApp, correo, o llenando y enviando el formulario de selección de plan en purpleoryn.com. Un formulario completado y enviado constituye una orden formal, con el mismo peso que una confirmación por WhatsApp o correo, por eso es importante leer toda la información del sitio y consultar a Oryn AI o las preguntas frecuentes antes de enviarlo. Cualquiera de las dos vías reserva tu cupo por 7 días calendario.",
    icon: CheckCircle,
    tone: "amber",
  },
  {
    id: "pago-inicial",
    number: "04",
    title: "Pago Inicial (50%)",
    short: "Pago inicial",
    detail:
      "Con el 50% inicial confirmado, tu proyecto queda activado y tu cupo asegurado. Si tu pedido incluye módulos adicionales, se pagan completos (100%) en este mismo momento. La mensualidad correspondiente a tu plan es parte de esta misma inversión, no un paso aparte, y comienza a contar desde la salida en vivo de tu sistema.",
    icon: CreditCard,
    tone: "amber",
  },
  {
    id: "formulario-configuracion",
    number: "05",
    title: "Formulario de Configuración",
    short: "Configuración",
    detail:
      "Nos envías logo, textos, fotos y datos del negocio en un solo formulario, completo. El formulario corresponde al plan elegido. El tiempo de entrega comienza a contar únicamente cuando el pago inicial está confirmado y este formulario llega completo.",
    icon: ClipboardText,
    tone: "violet",
  },
  {
    id: "construccion",
    number: "06",
    title: "Construcción y Revisión",
    short: "Construcción",
    detail:
      "Construimos tu sistema. Al terminar recibes una ronda completa de revisión antes de la entrega, que cubre textos, colores, espaciado y detalles visuales.",
    icon: Hammer,
    tone: "violet",
  },
  {
    id: "salida-en-vivo",
    number: "07",
    title: "Aprobación, Entrega y Salida en Vivo",
    short: "Salida en vivo",
    detail:
      "Apruebas la versión final, se realiza el pago final (50%) y tu sistema sale en vivo. Desde ese día empieza a contar la mensualidad de tu plan.",
    icon: RocketLaunch,
    tone: "rose",
  },
];

// Written so a second module can join the offer without restructuring the road
// or this copy, the same way the client document is written.
export const BRANCH: Waypoint = {
  id: "modulos-opcionales",
  number: null,
  title: "Módulos opcionales",
  short: "Módulos opcionales",
  detail:
    "Además de los tres planes ofrecemos módulos adicionales, como el Agente de Voz IA, que se agregan por separado, incluso en el mismo formulario de tu pedido. Cada módulo tiene su propia inversión (pago único y/o mensualidad, según corresponda) y, a diferencia de los planes, se paga al 100% por adelantado. Puede agregarse desde el inicio del proyecto o en cualquier momento después de la salida en vivo. Los módulos disponibles al momento de tu propuesta, y su inversión, se indican ahí.",
  icon: Microphone,
  tone: "amber",
};

export const WAYPOINTS: Waypoint[] = [...STEPS, BRANCH];

/**
 * A road drawn in its own coordinate space. The container locks
 * `aspect-ratio: width / height`, so a node at (x, y) maps to
 * `left: x/width%, top: y/height%` exactly, with no measuring on resize.
 * `branch` starts on a point of `path`, so the side road looks like it leaves
 * the main one instead of floating beside it.
 */
export interface Road {
  width: number;
  height: number;
  path: string;
  branch: string;
  /** Node centres in road coordinates, in WAYPOINTS order. */
  nodes: { x: number; y: number; side: "left" | "right" }[];
}

// Desktop: a serpentine running the height of the page. Each card opens toward
// the inside of its bend, so it never leaves the container.
export const ROAD_DESKTOP: Road = {
  width: 1000,
  height: 1700,
  path: [
    "M 200 110",
    "C 200 220, 800 220, 800 330",
    "C 800 440, 200 440, 200 550",
    "C 200 660, 800 660, 800 770",
    "C 800 880, 200 880, 200 990",
    "C 200 1100, 800 1100, 800 1210",
    "C 800 1380, 480 1400, 300 1560",
  ].join(" "),
  branch: "M 618 1389 C 700 1420, 760 1450, 760 1520",
  nodes: [
    { x: 200, y: 110, side: "right" },
    { x: 800, y: 330, side: "left" },
    { x: 200, y: 550, side: "right" },
    { x: 800, y: 770, side: "left" },
    { x: 200, y: 990, side: "right" },
    { x: 800, y: 1210, side: "left" },
    { x: 300, y: 1560, side: "right" },
    { x: 760, y: 1520, side: "left" },
  ],
};

// Mobile: the same road with tighter bends. Cards are centred over the road
// rather than beside it, so a narrow viewport never clips them.
export const ROAD_MOBILE: Road = {
  width: 380,
  height: 1820,
  path: [
    "M 110 170",
    "C 110 270, 270 250, 270 350",
    "C 270 470, 110 470, 110 590",
    "C 110 710, 270 710, 270 830",
    "C 270 950, 110 950, 110 1070",
    "C 110 1190, 270 1190, 270 1310",
    "C 270 1480, 240 1540, 140 1700",
  ].join(" "),
  branch: "M 254 1475 C 290 1505, 302 1550, 285 1600",
  nodes: [
    { x: 110, y: 170, side: "right" },
    { x: 270, y: 350, side: "left" },
    { x: 110, y: 590, side: "right" },
    { x: 270, y: 830, side: "left" },
    { x: 110, y: 1070, side: "right" },
    { x: 270, y: 1310, side: "left" },
    { x: 140, y: 1700, side: "right" },
    { x: 285, y: 1600, side: "left" },
  ],
};

// Homepage teaser: the same journey read left to right, small enough to sit
// between two sections without becoming a second copy of the page.
export const ROAD_TEASER: Road = {
  width: 1000,
  height: 360,
  path: [
    "M 60 210",
    "C 125 210, 125 130, 190 130",
    "C 255 130, 255 210, 320 210",
    "C 385 210, 385 130, 450 130",
    "C 515 130, 515 210, 580 210",
    "C 645 210, 645 130, 710 130",
    "C 775 130, 775 170, 830 170",
  ].join(" "),
  branch: "M 775 150 C 830 200, 890 250, 930 300",
  nodes: [
    { x: 60, y: 210, side: "right" },
    { x: 190, y: 130, side: "left" },
    { x: 320, y: 210, side: "right" },
    { x: 450, y: 130, side: "left" },
    { x: 580, y: 210, side: "right" },
    { x: 710, y: 130, side: "left" },
    { x: 830, y: 170, side: "right" },
    { x: 930, y: 300, side: "left" },
  ],
};
