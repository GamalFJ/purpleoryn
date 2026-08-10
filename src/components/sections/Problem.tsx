import { AlertTriangle, UserX, Repeat, BarChart2 } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";

const problems = [
  {
    icon: UserX,
    text: "Pierdes clientes por procesos manuales lentos",
  },
  {
    icon: AlertTriangle,
    text: "Tu negocio depende demasiado de ti para funcionar",
  },
  {
    icon: Repeat,
    text: "Tu equipo pierde horas en tareas repetitivas",
  },
  {
    icon: BarChart2,
    text: "No tienes visibilidad real de tu operación",
  },
];

const Problem = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <Meteors number={12} className="opacity-60" />
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-destructive bg-destructive/10 border border-destructive/30 rounded-full px-4 py-1.5 mb-4">
            El Problema
          </div>
          <h2 className="font-extrabold">
            Si tu negocio funciona{" "}
            <span className="text-destructive">a pulso</span>, no escala.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
