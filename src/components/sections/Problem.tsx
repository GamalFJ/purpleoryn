import { AlertTriangle, UserX, Repeat } from "lucide-react";

const problems = [
  {
    icon: UserX,
    text: "Pierdes clientes por procesos manuales",
  },
  {
    icon: AlertTriangle,
    text: "Tu negocio depende demasiado de ti",
  },
  {
    icon: Repeat,
    text: "Pierdes tiempo en tareas repetitivas",
  },
];

const Problem = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-destructive bg-destructive/10 border border-destructive/30 rounded-full px-4 py-1.5 mb-4">
            El Problema
          </div>
          <h2 className="font-extrabold">
            Si tu negocio funciona{" "}
            <span className="text-destructive">a pulso</span>, no escala.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {problems.map((p) => (
            <div
              key={p.text}
              className="glass-card p-5 sm:p-6 text-center hover:-translate-y-1 hover:border-destructive/40 transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                <p.icon className="w-5 h-5 text-destructive" />
              </div>
              <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
