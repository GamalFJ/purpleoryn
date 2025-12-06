import { useState } from "react";
import workflowImage from "@/assets/arkytek-workflow.png";
import { CheckCircle2, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

const caseStudyImages = [
  {
    src: workflowImage,
    alt: "ArKyTeK automation workflow diagram showing form submission, Airtable integration, and email automation",
    caption: "Main Workflow Diagram"
  }
];

const CaseStudy = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? caseStudyImages.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === caseStudyImages.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

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
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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
          
          {/* Image Gallery */}
          <div className="order-1 lg:order-2">
            <div className="grid gap-4">
              {caseStudyImages.map((image, index) => (
                <div 
                  key={index}
                  className="glass-card p-3 relative group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <ZoomIn className="w-5 h-5" />
                        <span>Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                  {image.caption && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-glass-border">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 hover:bg-background border border-glass-border transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {selectedImageIndex !== null && (
            <div className="relative flex items-center justify-center p-4">
              {/* Navigation arrows */}
              {caseStudyImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="absolute left-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {/* Image */}
              <div className="flex flex-col items-center">
                <img
                  src={caseStudyImages[selectedImageIndex].src}
                  alt={caseStudyImages[selectedImageIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                {caseStudyImages[selectedImageIndex].caption && (
                  <p className="text-muted-foreground mt-4 text-center">
                    {caseStudyImages[selectedImageIndex].caption}
                  </p>
                )}
                
                {/* Image counter */}
                {caseStudyImages.length > 1 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedImageIndex + 1} / {caseStudyImages.length}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CaseStudy;
