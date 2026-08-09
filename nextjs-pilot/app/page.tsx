import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Offer from "@/components/sections/Offer";
import RetainersPreview from "@/components/sections/RetainersPreview";
import PresenciaDigitalExpress from "@/components/PresenciaDigitalExpress";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10">
        <Hero />
        <ScrollReveal><Problem /></ScrollReveal>
        <ScrollReveal delay={100}><HowItWorks /></ScrollReveal>
        <ScrollReveal delay={100}><Offer /></ScrollReveal>
        <ScrollReveal delay={100}><RetainersPreview /></ScrollReveal>
        <PresenciaDigitalExpress />
        <ScrollReveal delay={100}><FinalCTA /></ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
