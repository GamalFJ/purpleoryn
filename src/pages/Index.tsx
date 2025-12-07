import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudy from "@/components/CaseStudy";
import OngoingBuilds from "@/components/OngoingBuilds";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import backgroundImage from "@/assets/background.png";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-background/70 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Services />
          <CaseStudy />
          <OngoingBuilds />
          <Process />
          <WhyUs />
          <Pricing />
          <Testimonials />
          <CTA />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
