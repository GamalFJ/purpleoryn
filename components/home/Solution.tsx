import Image from "next/image";
import { cn } from "@/lib/cn";
import { WhatsAppMock } from "./WhatsAppMock";

const STEPS = [
  { title: "Un cliente escribe", text: "Pregunta desde tu sitio web, a cualquier hora." },
  { title: "El Agente de IA responde al instante", text: "Contesta sus dudas, le hace las preguntas clave y te lo pasa por WhatsApp con todo organizado." },
  { title: "Se agenda o se convierte en venta", text: "Tú confirmas la cita o cierras la venta con la información en la mano." },
];

// Official logos from svgl (github.com/pheralb/svgl). "Trabajamos con" covers
// both what the plans connect to and what the studio builds with (Claude).
const TOOLS = [
  { name: "WhatsApp", src: "/media/logos/whatsapp.svg" },
  { name: "Google Maps", src: "/media/logos/google-maps.svg" },
  { name: "Google Calendar", src: "/media/logos/google-calendar.svg" },
  { name: "Google Analytics", src: "/media/logos/google-analytics.svg" },
  { name: "Claude", src: "/media/logos/claude.svg" },
];

// Solución: one system (site + agent), shown as a three-step flow and the
// handoff as it lands on the business's WhatsApp.
export function Solution() {
  return (
    <section aria-labelledby="solucion-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="solucion-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
          Oryn Presence: un solo sistema que no deja enfriar a ningún cliente
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Un sitio que aparece cuando te buscan y un Agente de IA que atiende a cada cliente en el momento.
        </p>
      </div>

      <ol className="mt-12 grid gap-0 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li
              key={step.title}
              className={cn(
                "relative flex gap-4 pb-8 md:flex-col md:pb-0",
                // Connector: vertical on mobile, horizontal on desktop.
                !last &&
                  "before:absolute before:bottom-0 before:left-5 before:top-12 before:w-px before:bg-line md:before:hidden md:after:absolute md:after:left-14 md:after:right-0 md:after:top-5 md:after:h-px md:after:bg-line",
              )}
            >
              <span className="tabular relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display font-semibold text-accent-ink">
                {i + 1}
              </span>
              <div className="md:pr-6">
                <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-body">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-14 grid items-center gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <WhatsAppMock />
        <div>
          <h3 className="text-2xl font-semibold leading-tight sm:text-[1.75rem]">Así te llega cada cliente</h3>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-body">
            Aunque te escriban de noche, el asistente los atiende en tu sitio y te los pasa por WhatsApp con el servicio, la fecha que prefieren y
            la zona. Tú solo confirmas.
          </p>
          <p className="mt-8 text-sm font-semibold text-ink">Trabajamos con</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-2.5 pr-4 text-sm font-medium text-ink">
                <Image src={tool.src} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
                {tool.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
