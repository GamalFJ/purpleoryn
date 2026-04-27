import { TrendingUp, Clock, Gauge } from "lucide-react";

const promises = [
  {
    icon: TrendingUp,
    title: "Más ventas",
    desc: "Captamos y calificamos más leads automáticamente.",
  },
  {
    icon: Clock,
    title: "Más tiempo",
    desc: "Liberamos horas semanales eliminando lo manual.",
  },
  {
    icon: Gauge,
    title: "Más control",
    desc: "Visibilidad total de tu operación, en un solo lugar.",
  },
];

const Promise = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            La Promesa
          </div>
          <h2 className="font-extrabold">
            Construimos sistemas para que tengas{" "}
            <span className="gradient-text">resultados reales.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {promises.map((p) => (
            <div
              key={p.title}
              className="glass-card p-6 sm:p-7 text-center hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promise;
