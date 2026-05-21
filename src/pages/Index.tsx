import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PresenciaDigitalExpress from "@/components/PresenciaDigitalExpress";
import ScrollReveal from "@/components/ScrollReveal";

const Problem = lazy(() => import("@/components/sections/Problem"));
const Promise = lazy(() => import("@/components/sections/Promise"));
const Offer = lazy(() => import("@/components/sections/Offer"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10">
        <Hero />
        <PresenciaDigitalExpress />
        <Suspense fallback={null}>
          <ScrollReveal><Problem /></ScrollReveal>
          <ScrollReveal delay={100}><Promise /></ScrollReveal>
          <ScrollReveal delay={100}><Offer /></ScrollReveal>
          <ScrollReveal delay={100}><FinalCTA /></ScrollReveal>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
