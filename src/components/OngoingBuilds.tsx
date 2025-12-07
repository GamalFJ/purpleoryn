import { Zap, FileText, Mic, Clock, CheckCircle2 } from "lucide-react";

const OngoingBuilds = () => {
  const features = [
    {
      icon: Zap,
      text: "Summarize project, scope, and pricing automatically"
    },
    {
      icon: FileText,
      text: "Keep all your proposals organized in one place"
    },
    {
      icon: Mic,
      text: "Add a voice pitch using an external TTS backend"
    }
  ];

  const benefits = [
    "AI-powered proposal generation",
    "Multiple tone options",
    "Organized proposal management",
    "Voice pitch integration",
    "Export to multiple formats"
  ];

  return (
    <section id="ongoing-builds" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-primary/3 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Current Ongoing Builds</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Coming <span className="gradient-text">Soon</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Main Feature Card */}
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
                <Clock className="w-4 h-4" />
                Coming Soon
              </span>
            </div>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                CW
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Client Whisperer by Oryn AI</h3>
                <p className="text-muted-foreground">Your Smart Proposal Assistant</p>
              </div>
            </div>
            
            {/* Tagline */}
            <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
              Turn client notes into ready-to-send proposals in under a minute.
            </h4>
            
            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-muted-foreground">
                  <feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Divider */}
            <div className="border-t border-glass-border my-6" />
            
            {/* Benefits */}
            <div>
              <h5 className="text-sm text-muted-foreground mb-4">What you'll get:</h5>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-glass-border">
              <p className="text-sm text-muted-foreground text-center">
                A Product by <span className="text-primary font-medium">Purple Cove Labs</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OngoingBuilds;
