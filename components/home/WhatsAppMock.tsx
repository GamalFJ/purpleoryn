"use client";

import { ArrowLeft, Camera, Checks, DotsThreeVertical, Microphone, Paperclip, Phone, Smiley, VideoCamera } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/hooks/useInView";

type Item =
  | { kind: "date"; text: string }
  | { kind: "system"; text: string }
  | { kind: "in" | "out"; text: string; time: string };

// Seen from the business owner's WhatsApp: the website agent qualified the
// customer at night and handed them over with a summary; the owner books them
// first thing in the morning. Matches what the plans include (the agent
// answers on the website and passes the customer to WhatsApp).
const THREAD: Item[] = [
  { kind: "date", text: "Ayer" },
  { kind: "system", text: "Oryn atendió a Ana en tu sitio web a las 9:38 p. m. y te la pasó por WhatsApp." },
  {
    kind: "in",
    time: "9:41 p. m.",
    text: "Hola, vengo de su página web. Esto es lo que hablé con el asistente:\n• Servicio: limpieza dental\n• Paciente nueva\n• Prefiere: sábado en la mañana\n• Zona: Santo Domingo Este",
  },
  { kind: "date", text: "Hoy" },
  { kind: "out", time: "8:04 a. m.", text: "¡Buenos días, Ana! Tenemos el sábado a las 10:00 a. m. ¿Te lo reservo?" },
  { kind: "in", time: "8:05 a. m.", text: "¡Sí, perfecto! Gracias." },
  { kind: "out", time: "8:06 a. m.", text: "Listo, quedó agendada para el sábado a las 10:00 a. m. Te esperamos." },
];

// WhatsApp's own light and dark palettes, scoped to this mock.
const C = {
  frame: "border-[#1c1c1e] bg-[#1c1c1e] dark:ring-1 dark:ring-white/15",
  header: "bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]",
  headerMuted: "text-[#667781] dark:text-[#8696a0]",
  wall: "bg-[#efeae2] dark:bg-[#0b141a]",
  in: "bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]",
  out: "bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]",
  meta: "text-[#667781] dark:text-[#8696a0]",
  date: "bg-white text-[#54656f] dark:bg-[#182229] dark:text-[#8696a0]",
  system: "bg-[#ffeecd] text-[#54656f] dark:bg-[#182229] dark:text-[#ffd279]",
  bar: "bg-[#f0f2f5] dark:bg-[#202c33]",
  field: "bg-white text-[#667781] dark:bg-[#2a3942] dark:text-[#8696a0]",
};

export function WhatsAppMock() {
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.3);
  const hidden = armed && !inView;

  return (
    <figure className="mx-auto w-full max-w-[22rem]">
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-[2.5rem] border-[10px] shadow-[0_32px_64px_-32px_rgb(28_16_48/0.55)]", C.frame)}
        aria-label="Ejemplo de conversación de WhatsApp"
        role="group"
      >
        <div className={cn("flex items-center gap-2 px-3 py-2.5", C.header)} aria-hidden="true">
          <ArrowLeft size={20} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe5e7] text-sm font-semibold text-[#54656f] dark:bg-[#6a7175] dark:text-[#e9edef]">
            AM
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[15px] font-medium">Ana Martínez</p>
            <p className={cn("text-xs", C.headerMuted)}>en línea</p>
          </div>
          <VideoCamera size={20} />
          <Phone size={19} className="ml-3" />
          <DotsThreeVertical size={20} weight="bold" className="ml-2" />
        </div>

        <ol
          className={cn(
            "flex min-h-[26rem] flex-col gap-1.5 px-3 py-3 [background-image:radial-gradient(rgb(0_0_0/0.035)_1px,transparent_1px)] [background-size:14px_14px] dark:[background-image:radial-gradient(rgb(255_255_255/0.03)_1px,transparent_1px)]",
            C.wall,
          )}
        >
          {THREAD.map((item, i) => {
            const reveal = cn(
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
              hidden ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
            );
            const style = { transitionDelay: hidden ? "0ms" : `${i * 450}ms` };

            if (item.kind === "date" || item.kind === "system") {
              return (
                <li key={i} className={cn("my-1.5 flex justify-center", reveal)} style={style}>
                  <span
                    className={cn(
                      "rounded-lg px-3 py-1 text-center shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]",
                      item.kind === "date" ? cn("text-xs font-medium", C.date) : cn("max-w-[92%] text-[12.5px] leading-snug", C.system),
                    )}
                  >
                    {item.text}
                  </span>
                </li>
              );
            }

            const out = item.kind === "out";
            return (
              <li key={i} className={cn("flex", out ? "justify-end" : "justify-start", reveal)} style={style}>
                <p
                  className={cn(
                    "relative max-w-[85%] whitespace-pre-line rounded-lg px-2.5 pb-1.5 pt-1.5 text-[14px] leading-[1.35] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]",
                    out ? cn("rounded-tr-none", C.out) : cn("rounded-tl-none", C.in),
                  )}
                >
                  <span className="sr-only">{out ? "Tu negocio: " : "Ana: "}</span>
                  {item.text}
                  <span className={cn("float-right ml-2.5 mt-1.5 inline-flex translate-y-0.5 items-center gap-0.5 text-[11px]", C.meta)}>
                    {item.time}
                    {out && <Checks size={15} weight="bold" className="text-[#53bdeb]" aria-label="leído" />}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>

        <div className={cn("flex items-center gap-1.5 px-2 py-2", C.bar)} aria-hidden="true">
          <div className={cn("flex h-10 flex-1 items-center gap-2.5 rounded-full px-3 text-[15px]", C.field)}>
            <Smiley size={22} />
            <span className="flex-1">Mensaje</span>
            <Paperclip size={20} />
            <Camera size={20} />
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1daa61] text-white">
            <Microphone size={20} weight="fill" />
          </span>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-sm text-muted">Conversación de ejemplo, vista desde el WhatsApp de tu negocio.</figcaption>
    </figure>
  );
}
