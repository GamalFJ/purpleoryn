import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudy from "@/components/CaseStudy";
import OngoingBuilds from "@/components/OngoingBuilds";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import StrategySession from "@/components/StrategySession";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import backgroundImage from "@/assets/background.png";

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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
