import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Plan Básico",
    price: "RD$ 10,675",
    period: "/mes",
    desc: "Soporte esencial y monitoreo activo del sistema en horario laboral.",
    features: ["Monitoreo del sistema", "Corrección de errores menores", "Soporte por WhatsApp en horario laboral"],
    highlight: false,
  },
  {
    name: "Plan Estándar",
    price: "RD$ 18,000",
    period: "/mes",
    desc: "Mantenimiento profesional y operación continua del ecosistema digital.",
    features: [
      "Gestión de automatizaciones",
      "Depuración y mantenimiento de APIs",
      "Garantía de operación continua",
      "Mejora progresiva del sistema",
    ],
    highlight: true,
  },
  {
    name: "Plan AI Partner",
    price: "RD$ 35,000",
    period: "/mes",
    desc: "Todo lo del Estándar, potenciado con Inteligencia Artificial activa.",
    features: [
      "Todo lo del Plan Estándar",
      "Integración activa de IA",
      "Chatbot de WhatsApp con IA",
      "Llamada estratégica mensual",
    ],
    highlight: false,
  },
];

const RetainersPreview = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            Planes Mensuales
          </div>
          <h2 className="font-extrabold">
            Sigue creciendo con <span className="gradient-text">soporte continuo</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Mantén tu sistema operando, mejorando y escalando — sin preocupaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`glass-card p-6 sm:p-7 flex flex-col relative transition-all duration-300 hover:-translate-y-1 ${
                p.highlight ? "border-primary/60 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]" : "hover:border-primary/40"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Más Popular
                </div>
              )}
              <h3 className="font-bold text-foreground text-lg mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed min-h-[40px]">{p.desc}</p>
              <div className="mb-5">
                <span className="text-2xl sm:text-3xl font-extrabold text-price-yellow">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/planes"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 min-h-[48px] text-sm font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            Ver todos los planes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RetainersPreview;
