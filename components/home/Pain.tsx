import { ChartBar, ClockCountdown, MapPinArea, Storefront } from "@phosphor-icons/react/dist/ssr";

const PAINS = [
  {
    icon: ClockCountdown,
    title: "Respuestas que llegan tarde",
    text: "Un cliente pregunta y espera horas por una respuesta. Muchos le compran a quien responde primero, así que esa espera ya puede ser una venta perdida.",
  },
  {
    icon: MapPinArea,
    title: "Invisible cuando te buscan cerca",
    text: "Alguien busca lo que vendes en tu zona y tu negocio no aparece.",
  },
  {
    icon: ChartBar,
    title: "Consultas que nadie cuenta",
    text: "No tienes forma de saber cuántas consultas se están perdiendo.",
  },
  {
    icon: Storefront,
    title: "Sin presencia real",
    text: "Tienes un sitio genérico, o ninguno, mientras tu competencia sí tiene presencia real.",
  },
];

// Dolor: the problem, named specifically, before the solution.
export function Pain() {
  return (
    <section aria-labelledby="dolor-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <h2 id="dolor-titulo" className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Lo que hoy le está costando clientes a tu negocio
      </h2>
      <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
        {PAINS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 border-t border-line py-6">
            <Icon size={28} weight="duotone" className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-body">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
