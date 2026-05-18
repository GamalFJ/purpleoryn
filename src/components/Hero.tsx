import { Layers, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient purple glow behind the founder photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[120px] opacity-30"
        style={{ background: "hsl(270 100% 65%)" }}
      />
      {/* Soft accent glow — bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20"
        style={{ background: "hsl(280 100% 70%)" }}
      />

      <div className="container mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 items-center min-h-[92vh] sm:min-h-screen pt-24 sm:pt-28 pb-12 sm:pb-16">

          {/* ── LEFT: copy ── */}
          <div className="flex flex-col justify-center order-2 lg:order-1 pb-8 lg:pb-0">
            <div className="inline-flex w-fit items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
              🔥 Últimos cupos del mes disponibles
            </div>

            <h1 className="font-extrabold leading-[1.05] tracking-tight mb-5">
              <span className="block text-foreground">Sistemas que hacen</span>
              <span className="block text-foreground">crecer tu negocio.</span>
              <span className="block mt-2">
                <span className="gradient-text">Más ventas.</span>{" "}
                <span className="text-primary neon-text">Menos trabajo.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
              Más de 10 negocios ya automatizan con nosotros.{" "}
              <span className="text-primary font-semibold">
                Los cupos se llenan rápido.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <Link
                to="/demos"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300"
              >
                <Layers className="w-5 h-5 shrink-0" />
                Ver Demos
              </Link>

              <Link
                to="/portafolio"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <FolderOpen className="w-5 h-5 shrink-0" />
                Ver Portafolio
              </Link>
            </div>
          </div>

          {/* ── RIGHT: founder photo ── */}
          <div className="flex items-end justify-center lg:justify-end order-1 lg:order-2 pt-0 lg:pt-0">
            <img
              src="/lovable-uploads/Hero Founder Image 1.0.png"
              alt="Gamal — Purple Cove Labs"
              className="relative z-10 w-[260px] sm:w-[340px] lg:w-[420px] xl:w-[480px] max-h-[55vh] sm:max-h-[70vh] lg:max-h-[80vh] object-contain object-bottom select-none"
              style={{
                filter:
                  "drop-shadow(0 0 48px hsl(270 100% 65% / 0.45)) drop-shadow(0 0 16px hsl(280 100% 70% / 0.3))",
              }}
            />
          </div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, hsl(270 50% 8%) 0%, transparent 100%)",
        }}
      />
    </section>
  );
};

export default Hero;
