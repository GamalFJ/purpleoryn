import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import backgroundImage from "@/assets/background.png";
import PricingHero from "@/components/pricing/PricingHero";

const WebsiteTiers = lazy(() => import("@/components/pricing/WebsiteTiers"));
const CustomApps = lazy(() => import("@/components/pricing/CustomApps"));
const AIAgents = lazy(() => import("@/components/pricing/AIAgents"));
const Automations = lazy(() => import("@/components/pricing/Automations"));
const Retainers = lazy(() => import("@/components/pricing/Retainers"));
const Bundles = lazy(() => import("@/components/pricing/Bundles"));
const Workshops = lazy(() => import("@/components/pricing/Workshops"));
const AddOns = lazy(() => import("@/components/pricing/AddOns"));
const PricingCTA = lazy(() => import("@/components/pricing/PricingCTA"));

const Pricing = () => {
  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="fixed inset-0 bg-background/70 pointer-events-none" />
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        <Header />
        <main className="pt-20">
          <PricingHero />
          <Suspense fallback={null}>
            <ScrollReveal><WebsiteTiers /></ScrollReveal>
            <ScrollReveal delay={100}><CustomApps /></ScrollReveal>
            <ScrollReveal delay={100}><AIAgents /></ScrollReveal>
            <ScrollReveal delay={100}><Automations /></ScrollReveal>
            <ScrollReveal delay={100}><Retainers /></ScrollReveal>
            <ScrollReveal delay={100}><Bundles /></ScrollReveal>
            <ScrollReveal delay={100}><Workshops /></ScrollReveal>
            <ScrollReveal delay={100}><AddOns /></ScrollReveal>
            <ScrollReveal delay={100}><PricingCTA /></ScrollReveal>
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Pricing;
