import { Check } from "lucide-react";

const WA_URL =
  "https://wa.me/+18096343232?text=Hola,%20me%20interesa%20la%20Presencia%20Digital%20Express";

const items = [
  "Página profesional con su marca",
  "Dominio propio por 1 año",
  "Botón directo a WhatsApp",
  "Optimizada para móvil",
  "Entrega en 3 días hábiles",
  "1 ronda de ajustes incluida",
];

const PresenciaDigitalExpress = () => {
  return (
    <section
      className="py-10 sm:py-14 px-4 sm:px-6"
      style={{ backgroundColor: "#1a0040" }}
    >
      <div className="container mx-auto max-w-2xl">
        <div
          className="relative rounded-2xl border border-[#7C3AED]/50 p-6 sm:p-10 text-white animate-card-glow overflow-hidden"
          style={{ backgroundColor: "#100028" }}
        >
          {/* Top gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#a855f7] to-[#7C3AED]" />

          {/* Ambient glow orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "#7C3AED" }}
          />

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-full px-4 py-1.5 animate-urgency-pulse">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] shrink-0" />
              Oferta Especial · Disponible Esta Semana
            </span>
          </div>

          {/* Headline — Syne */}
          <h2
            className="text-center font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4 text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Su negocio en línea en{" "}
            <span style={{ color: "#a855f7" }}>3 días.</span>
          </h2>

          {/* Price block */}
          <div className="text-center mb-7">
            <p
              className="text-5xl sm:text-6xl font-extrabold leading-none"
              style={{ color: "#a855f7", fontFamily: "'Syne', sans-serif" }}
            >
              RD$9,500
            </p>
            <p
              className="text-sm text-white/55 mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Pago único. Sin mensualidades.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#7C3AED]/20 mb-7" />

          {/* Checklist */}
          <ul
            className="space-y-3 mb-8 max-w-xs mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#a855f7]" strokeWidth={3} />
                </span>
                <span className="text-sm text-white/85 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="text-center">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #9333ea)",
                boxShadow: "0 0 32px -4px rgba(124, 58, 237, 0.65)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Solicitar Ahora →
            </a>
            <p
              className="text-xs text-white/45 mt-3 max-w-xs mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Cupos limitados esta semana. Pago 100% adelantado para reservar su
              fecha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresenciaDigitalExpress;
