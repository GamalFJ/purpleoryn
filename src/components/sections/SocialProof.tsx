import { Star, Quote } from "lucide-react";

const stats = [
  { value: "+40%", label: "Leads calificados" },
  { value: "20h", label: "Ahorradas / semana" },
  { value: "24/7", label: "Operación automática" },
];

const testimonials = [
  {
    quote:
      "Pasamos de responder mensajes a mano a tener un sistema que califica leads mientras dormimos.",
    name: "Cliente Estudio de Arquitectura",
    role: "Fundador, ArKyTeK",
  },
  {
    quote:
      "El equipo de Purple Cove Labs entiende el negocio antes de tocar código. Marcó la diferencia.",
    name: "Cliente E-commerce",
    role: "CEO",
  },
  {
    quote:
      "Por fin tengo visibilidad real de mis operaciones. Todo conectado, todo medible.",
    name: "Cliente Servicios Profesionales",
    role: "Director de Operaciones",
  },
];

const SocialProof = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            Resultados
          </div>
          <h2 className="font-extrabold">
            Negocios reales,{" "}
            <span className="gradient-text">resultados medibles</span>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-10 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card p-5 sm:p-6 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-primary/60 mb-3" />
              <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
              <div className="border-t border-border/40 pt-3">
                <div className="font-semibold text-sm text-foreground">
                  {t.name}
                </div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
