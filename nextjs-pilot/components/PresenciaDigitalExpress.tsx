import Image from "next/image";
import { Globe, Link2, MessageCircle, Smartphone, Zap, RefreshCw, ExternalLink, Building2, Calculator, Heart } from "lucide-react";

const WA_URL = "https://wa.me/+18096034113?text=Hola,%20me%20interesa%20la%20Presencia%20Digital%20Express";

const demos = [
  {
    niche: "Clínica Dental",
    description: "Atrae nuevos pacientes y agenda citas al instante",
    url: "https://pagina-de-captura-clinica-dental-so.vercel.app/",
    img: "/demo-dental.png.jpeg",
    Icon: Smartphone,
    color: "#a855f7",
  },
  {
    niche: "Constructora",
    description: "Capta proyectos residenciales y comerciales",
    url: "https://pagina-de-captura-constructora-elit.vercel.app/",
    img: "/demo-constructora.png.jpeg",
    Icon: Building2,
    color: "#0ea5e9",
  },
  {
    niche: "Contadores",
    description: "Convierte emprendedores en clientes recurrentes",
    url: "https://pagina-de-captura-contadores-del-ca.vercel.app/",
    img: "/demo-contadoras.png.jpeg",
    Icon: Calculator,
    color: "#22c55e",
  },
  {
    niche: "Clínica Veterinaria",
    description: "Agenda consultas y fideliza dueños de mascotas",
    url: "https://pagina-de-captura-clinica-veterinar.vercel.app/",
    img: "/demo-veterinaria.png.jpeg",
    Icon: Heart,
    color: "#ec4899",
  },
];

const items = [
  { label: "Página de Captura con su marca y colores", Icon: Globe, color: "#7C3AED", bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.4)" },
  { label: "Dominio propio por 1 año", Icon: Link2, color: "#0ea5e9", bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.35)" },
  { label: "Botón directo a WhatsApp", Icon: MessageCircle, color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
  { label: "Optimizada para móvil", Icon: Smartphone, color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)" },
  { label: "Entrega en 3 días hábiles", Icon: Zap, color: "#eab308", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)" },
  { label: "1 ronda de ajustes incluida", Icon: RefreshCw, color: "#ec4899", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.35)" },
];

function DemoThumbnail({ img, niche }: { img: string; niche: string }) {
  return (
    <div className="w-full overflow-hidden relative aspect-[4/3]">
      <Image src={img} alt={`Demo ${niche}`} fill loading="lazy" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
    </div>
  );
}

const PresenciaDigitalExpress = () => {
  return (
    <section id="presencia-digital-express" className="py-10 sm:py-14 px-4 sm:px-6" style={{ backgroundColor: "#1a0040" }}>
      <div className="container mx-auto max-w-2xl">
        <div
          className="relative rounded-2xl border border-[#7C3AED]/50 p-6 sm:p-10 text-white animate-card-glow overflow-hidden"
          style={{ backgroundColor: "#100028" }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#ec4899] to-[#0ea5e9]" />

          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ backgroundColor: "#7C3AED" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-10" style={{ backgroundColor: "#0ea5e9" }} />

          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ec4899] shrink-0" />
              Oferta Especial
            </span>
          </div>

          <h2
            className="text-center font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-2 text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Su{" "}
            <span style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Página de Captura
            </span>{" "}
            en 3 días.
          </h2>

          <p className="text-center text-xs text-white/50 mb-6 max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Una página enfocada en convertir visitantes en clientes — no un sitio web completo.
          </p>

          <div className="text-center mb-7">
            <p
              className="text-5xl sm:text-6xl font-extrabold leading-none"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 60%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              RD$9,500
            </p>
            <p className="text-sm text-white/55 mt-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Pago único. Sin mensualidades.
            </p>
          </div>

          <div className="border-t border-[#7C3AED]/20 mb-7" />

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {items.map(({ label, Icon, color, bg, border }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
                  <Icon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
                </span>
                <span className="text-sm text-white/85 leading-snug">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/40 mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Ejemplos reales por nicho — haga clic para ver el demo
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demos.map(({ niche, description, url, img, Icon, color }) => (
                <a
                  key={niche}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-[#7C3AED]/30 hover:border-[#ec4899]/60 overflow-hidden transition-all duration-300"
                  style={{ backgroundColor: "rgba(124,58,237,0.07)", boxShadow: "0 0 18px -6px rgba(124,58,237,0.2)" }}
                >
                  <DemoThumbnail img={img} niche={niche} />
                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18`, border: `1px solid ${color}40` }}>
                        <Icon className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
                      </span>
                      <span className="font-bold text-sm text-white leading-snug" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {niche}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {description}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto transition-colors duration-200 group-hover:text-[#ec4899]"
                      style={{ color, fontFamily: "var(--font-dm-sans)" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver Demo →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #7C3AED, #ec4899)", boxShadow: "0 0 32px -4px rgba(236, 72, 153, 0.5)", fontFamily: "var(--font-dm-sans)" }}
            >
              Solicitar Ahora →
            </a>
            <p className="text-xs text-white/45 mt-3 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Pago 100% adelantado para reservar su fecha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresenciaDigitalExpress;
