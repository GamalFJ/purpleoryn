import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import { ArrowRight, ExternalLink, Search, Users, TrendingUp, ShoppingBag, Smartphone, MessageCircle, Globe, Link2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Productos & Apps — Purple Cove Labs",
  description: "Software real que hemos construido: una app de pedidos en producción, un sistema de páginas de captura y las herramientas internas que usamos para operar.",
  alternates: { canonical: "/apps" },
  openGraph: {
    title: "Productos & Apps — Purple Cove Labs",
    description: "Software real que hemos construido: una app de pedidos en producción, un sistema de páginas de captura y las herramientas internas que usamos para operar.",
    url: "https://purpleoryn.com/apps",
  },
};

const products = [
  {
    key: "un-taco-mas",
    badge: "Cliente real · En producción",
    badgeClass: "bg-success-green/15 text-success-green border-success-green/30",
    title: "Un Taco Más — App de Pedidos",
    subtitle: "Restaurante · Santo Domingo Este",
    image: "/apps/un-taco-mas.png",
    imageAlt: "Taco preparado para Un Taco Más",
    description:
      "App móvil (PWA) de pedidos para un restaurante real. El cliente arma su pedido con precios en vivo por categoría — tacos, combos, bebidas, extras, postres — completa sus datos de entrega y lo envía directo por WhatsApp. Sin llamadas, sin errores de comunicación, sin depender de un mesero disponible.",
    features: [
      { icon: ShoppingBag, title: "Menú digital con precios en vivo", desc: "Categorías, disponibilidad y precios actualizados sin tocar código." },
      { icon: MessageCircle, title: "Pedido directo a WhatsApp", desc: "El pedido armado llega formateado y listo para confirmar." },
      { icon: Smartphone, title: "PWA instalable", desc: "El cliente la agrega a su pantalla de inicio como una app nativa." },
    ],
    cta: { label: "Ver App en Vivo", href: "https://un-taco-mas.vercel.app", external: true },
  },
  {
    key: "pagina-de-captura",
    badge: "Desde RD$9,500",
    badgeClass: "bg-price-yellow/15 text-price-yellow border-price-yellow/30",
    title: "Página de Captura Express",
    subtitle: "Entrega en 3 días hábiles",
    image: "/demo-dental.png.jpeg",
    imageAlt: "Ejemplo de Página de Captura — Clínica Dental",
    description:
      "Una página enfocada 100% en convertir visitantes en clientes — con su marca y colores, dominio propio por 1 año y botón directo a WhatsApp. No es un sitio web completo: es la forma más rápida de tener presencia digital profesional y empezar a recibir contactos.",
    features: [
      { icon: Globe, title: "Con su marca y colores", desc: "Diseñada para su negocio, no una plantilla genérica." },
      { icon: Link2, title: "Dominio propio incluido", desc: "1 año de dominio propio, sin costos ocultos." },
      { icon: Zap, title: "Entrega en 3 días hábiles", desc: "De la conversación inicial a la página en vivo." },
    ],
    cta: { label: "Ver Ejemplos por Nicho", href: "/#presencia-digital-express" },
  },
  {
    key: "prospect-dashboard",
    badge: "Uso interno · Purple Cove Labs",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    title: "Prospect Intelligence Dashboard",
    subtitle: "Herramienta interna",
    image: "/apps/prospect-dashboard-logo.png",
    imageAlt: "Prospect Intelligence Dashboard",
    description:
      "El sistema que usamos internamente para identificar, enriquecer y priorizar prospectos de alto valor para nuestra propia operación — no es un producto a la venta, sino un ejemplo del tipo de herramienta de datos que podemos construir a medida para tu negocio.",
    features: [
      { icon: Search, title: "Búsqueda inteligente de prospectos", desc: "Identifica prospectos de alto valor usando datos en tiempo real." },
      { icon: Users, title: "Enriquecimiento de contactos", desc: "Completa automáticamente contacto, empresa y cargo." },
      { icon: TrendingUp, title: "Scoring y priorización", desc: "Clasifica los mejores prospectos automáticamente." },
    ],
    cta: { label: "Conversemos sobre algo similar", href: "https://wa.me/18096034113", external: true },
  },
];

export default function Apps() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              Productos & Apps
            </div>
            <h1 className="font-extrabold mb-4">
              Software que <span className="gradient-text">ya está funcionando</span>.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              No son mockups. Esto es lo que construimos para clientes reales y para nuestra propia operación.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl space-y-6 sm:space-y-8">
            {products.map((p) => (
              <div
                key={p.key}
                className="glass-card p-4 sm:p-8 lg:p-10 relative overflow-hidden hover:border-primary/40 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
                  <div className="lg:w-64 shrink-0">
                    <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden border border-border/40 bg-glass-bg/40">
                      <Image src={p.image} alt={p.imageAlt} fill className="object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border whitespace-nowrap ${p.badgeClass}`}>
                        {p.badge}
                      </span>
                    </div>
                    <h2 className="font-extrabold text-lg sm:text-xl text-foreground break-words mt-2">{p.title}</h2>
                    <div className="text-xs text-muted-foreground mb-4">{p.subtitle}</div>

                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6">{p.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {p.features.map((f) => (
                        <div key={f.title} className="flex items-start gap-2.5 min-w-0">
                          <div className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <f.icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-foreground mb-0.5 leading-snug">{f.title}</div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {p.cta.external ? (
                      <a
                        href={p.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300"
                      >
                        {p.cta.label}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={p.cta.href}
                        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300"
                      >
                        {p.cta.label}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
