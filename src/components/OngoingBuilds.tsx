import { useState } from "react";
import { Zap, FileText, Mic, CheckCircle2, ZoomIn, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import cwScreenshot1 from "@/assets/cw-screenshot-1.jpg";
import cwScreenshot2 from "@/assets/cw-screenshot-2.jpg";
import cwScreenshot3 from "@/assets/cw-screenshot-3.png";
import cwScreenshot4 from "@/assets/cw-screenshot-4.png";
import cwScreenshot5 from "@/assets/cw-screenshot-5.png";
import cwScreenshot6 from "@/assets/cw-screenshot-6.png";

const screenshots = [
  { src: cwScreenshot1, alt: "Client Whisperer landing page", caption: "Landing Page" },
  { src: cwScreenshot2, alt: "Client Whisperer sign up page", caption: "Get Started" },
  { src: cwScreenshot3, alt: "Client Whisperer full homepage", caption: "Homepage Overview" },
  { src: cwScreenshot4, alt: "Client Whisperer new proposal form", caption: "New Proposal Form" },
  { src: cwScreenshot5, alt: "Client Whisperer service and style options", caption: "Service & Style Selection" },
  { src: cwScreenshot6, alt: "Client Whisperer review and generate", caption: "Review & Generate" }
];

const OngoingBuilds = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({ email: email.trim(), product: 'client-whisperer' });
    
    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already registered!",
          description: "This email is already on the waitlist.",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when Client Whisperer launches.",
      });
      setEmail("");
    }
    
    setIsSubmitting(false);
  };

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? screenshots.length - 1 : selectedImageIndex - 1);
    }
  };
  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === screenshots.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  const features = [
    { icon: Zap, text: "Summarize project, scope, and pricing automatically" },
    { icon: FileText, text: "Keep all your proposals organized in one place" },
    { icon: Mic, text: "Add a voice pitch using an external TTS backend" }
  ];

  const benefits = [
    "AI-powered proposal generation",
    "Multiple tone options",
    "Organized proposal management",
    "Voice pitch integration",
    "Export to multiple formats"
  ];

  return (
    <section id="ongoing-builds" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-primary/3 blur-3xl rounded-full" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase">Current Ongoing Builds</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            Coming <span className="gradient-text">Soon</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Content Card */}
          <div className="glass-card p-5 sm:p-6 md:p-8 relative overflow-hidden order-2 lg:order-1">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg">
                CW
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Client Whisperer by Oryn AI</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Your Smart Proposal Assistant</p>
              </div>
            </div>
            
            {/* Tagline */}
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              Turn client notes into ready-to-send proposals in under a minute.
            </h4>
            
            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-sm sm:text-base">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            {/* Divider */}
            <div className="border-t border-glass-border my-4 sm:my-6" />
            
            {/* Benefits */}
            <div>
              <h5 className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">What you'll get:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notify Me Form */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-glass-border">
              <h5 className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                Get notified when we launch
              </h5>
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-background/50 border-glass-border focus:border-primary min-h-[48px]"
                />
                <Button 
                  type="submit" 
                  variant="default"
                  disabled={isSubmitting}
                  className="shrink-0 min-h-[48px] w-full sm:w-auto"
                >
                  {isSubmitting ? "..." : "Notify Me"}
                </Button>
              </form>
            </div>
            
            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-glass-border">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                A Product by <span className="text-primary font-medium">Purple Cove Labs</span>
              </p>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {screenshots.map((image, index) => (
                <div 
                  key={index} 
                  className="glass-card p-1.5 sm:p-2 relative group cursor-pointer aspect-video" 
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-lg h-full">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 text-center">
              Tap any image to enlarge
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-glass-border">
          <DialogClose className="absolute right-2 sm:right-4 top-2 sm:top-4 z-50 rounded-full p-2 bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {selectedImageIndex !== null && (
            <div className="relative flex items-center justify-center p-2 sm:p-4">
              {/* Navigation arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }} 
                className="absolute left-2 sm:left-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); goToNext(); }} 
                className="absolute right-10 sm:right-14 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              {/* Image */}
              <div className="flex flex-col items-center max-w-4xl px-10 sm:px-16">
                <img 
                  src={screenshots[selectedImageIndex].src} 
                  alt={screenshots[selectedImageIndex].alt} 
                  className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg" 
                />
                {screenshots[selectedImageIndex].caption && (
                  <p className="text-foreground font-medium mt-3 sm:mt-4 text-center text-sm sm:text-base">
                    {screenshots[selectedImageIndex].caption}
                  </p>
                )}
                
                {/* Image counter */}
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {selectedImageIndex + 1} / {screenshots.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default OngoingBuilds;
