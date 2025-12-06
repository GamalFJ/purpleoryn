import workflowImage from "@/assets/arkytek-workflow.png";
import { CheckCircle2 } from "lucide-react";

const CaseStudy = () => {
  return (
    <section id="portfolio" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-primary/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Case Study</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            ArKyTeK — <span className="gradient-text">Onboarding Engine Build</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">The Situation</h3>
              <p className="text-muted-foreground">
                ArKyTeK, a freelance architecture firm, needed an automated client onboarding system to handle form submissions, schedule consultations, and maintain organized client records.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">The Solution</h3>
              <ul className="space-y-3">
                {[
                  "Built n8n automation workflows for form processing",
                  "Integrated Airtable for client data management",
                  "Automated email notifications and booking confirmations",
                  "Created Cal.com integration for scheduling"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card p-6 border-primary/40">
              <h3 className="text-lg font-semibold text-primary mb-3">The Outcome</h3>
              <p className="text-foreground font-medium mb-2">
                Fully automated client intake system
              </p>
              <p className="text-muted-foreground text-sm">
                The architect now receives organized client folders, automatic notifications, and scheduled meetings without any manual work. We continue to maintain and expand the system together.
              </p>
            </div>
          </div>
          
          {/* Workflow Image */}
          <div className="order-1 lg:order-2">
            <div className="glass-card p-4 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={workflowImage}
                alt="ArKyTeK automation workflow diagram showing form submission, Airtable integration, and email automation"
                className="relative w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
