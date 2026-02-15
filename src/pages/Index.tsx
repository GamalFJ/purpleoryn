import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import backgroundImage from "@/assets/background.png";

const Services = lazy(() => import("@/components/Services"));
const CaseStudy = lazy(() => import("@/components/CaseStudy"));
const OngoingBuilds = lazy(() => import("@/components/OngoingBuilds"));
const Process = lazy(() => import("@/components/Process"));
const WhyUs = lazy(() => import("@/components/WhyUs"));
const StrategySession = lazy(() => import("@/components/StrategySession"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CTA = lazy(() => import("@/components/CTA"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div 
      className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll', /* Changed from fixed for better mobile performance */
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-background/70 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <ScrollReveal>
              <Services />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Process />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <CaseStudy />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Testimonials />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <WhyUs />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <StrategySession />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <OngoingBuilds />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <CTA />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Newsletter />
            </ScrollReveal>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
