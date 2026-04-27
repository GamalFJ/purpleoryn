import { Search, Wrench, TrendingUp } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Diagnóstico",
    desc: "Mapeamos tu operación, identificamos cuellos de botella y definimos qué automatizar primero.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "Implementación",
    desc: "Construimos, integramos y desplegamos tu sistema — con documentación y capacitación.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Optimización",
    desc: "Medimos resultados, ajustamos y escalamos. Tu sistema mejora cada mes.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
            Cómo Funciona
          </div>
          <h2 className="font-extrabold">
            Un sistema en{" "}
            <span className="gradient-text">3 pasos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((s) => (
            <div
              key={s.n}
              className="glass-card p-6 sm:p-7 text-center relative hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative w-14 h-14 mx-auto mb-4">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 blur-xl" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-primary tracking-widest mb-2">
                {s.n}
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
