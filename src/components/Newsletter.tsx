import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import coveConnectBanner from "@/assets/cove-connect-banner.png";
const Newsletter = () => {
  return <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-accent/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-full max-w-lg rounded-xl overflow-hidden mb-6">
                <img src={coveConnectBanner} alt="Cove Connect Newsletter" className="w-full h-auto object-cover" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Stay in the <span className="gradient-text">Loop</span>
              </h2>
              
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Get exclusive insights on AI automation, business systems, product updates and  practical tips to scale your operations. Join the Cove Crew            </p>
              
              <Button variant="hero" size="xl" asChild className="btn-glow">
                <a target="_blank" rel="noopener noreferrer" href="https://coveconnect.substack.com/" className="bg-[#f65c0f]">
                  Subscribe to Cove Connect  
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Free weekly insights. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Newsletter;