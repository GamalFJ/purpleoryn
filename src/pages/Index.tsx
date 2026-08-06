import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";

const Problem = lazy(() => import("@/components/sections/Problem"));
const HowItWorks = lazy(() => import("@/components/sections/HowItWorks"));
const SocialProof = lazy(() => import("@/components/sections/SocialProof"));
const Promise = lazy(() => import("@/components/sections/Promise"));
const Offer = lazy(() => import("@/components/sections/Offer"));
const RetainersPreview = lazy(() => import("@/components/sections/RetainersPreview"));
const PresenciaDigitalExpress = lazy(() => import("@/components/PresenciaDigitalExpress"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10">
        <Hero />
        <Suspense fallback={null}>
          <ScrollReveal><Problem /></ScrollReveal>
          <ScrollReveal delay={100}><HowItWorks /></ScrollReveal>
          <ScrollReveal delay={100}><SocialProof /></ScrollReveal>
          <ScrollReveal delay={100}><Promise /></ScrollReveal>
          <ScrollReveal delay={100}><Offer /></ScrollReveal>
          <ScrollReveal delay={100}><RetainersPreview /></ScrollReveal>
          <PresenciaDigitalExpress />
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
