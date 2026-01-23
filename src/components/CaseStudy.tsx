import { useState } from "react";
import workflowImage from "@/assets/arkytek-workflow.png";
import servicesImage from "@/assets/arkytek-services.png";
import formImage from "@/assets/arkytek-form.png";
import docs1Image from "@/assets/arkytek-docs-1.png";
import docs3Image from "@/assets/arkytek-docs-3.jpg";
import docs4Image from "@/assets/arkytek-docs-4.jpg";
import heroImage from "@/assets/arkytek-hero.png";
import projectsImage from "@/assets/arkytek-projects.png";
import { CheckCircle2, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

const caseStudyImages = [
  {
    src: heroImage,
    alt: "ArKyTeK website hero section",
    caption: "ArKyTeK Landing Page"
  },
  {
    src: workflowImage,
    alt: "ArKyTeK automation workflow diagram showing form submission, Airtable integration, and email automation",
    caption: "Main Workflow Diagram"
  },
  {
    src: servicesImage,
    alt: "ArKyTeK services section showing interior design, renovation, and architectural services",
    caption: "Services Section"
  },
  {
    src: projectsImage,
    alt: "ArKyTeK project types including residential, cafe, salon, and more",
    caption: "Project Categories"
  },
  {
    src: formImage,
    alt: "ArKyTeK client intake form for project submissions",
    caption: "Client Intake Form"
  },
  {
    src: docs1Image,
    alt: "ArKyTeK documentation guide header",
    caption: "Documentation Guide"
  },
  {
    src: docs3Image,
    alt: "ArKyTeK troubleshooting documentation",
    caption: "Troubleshooting Guide"
  },
  {
    src: docs4Image,
    alt: "ArKyTeK support contact information",
    caption: "Support & Assistance"
  }
];

const CaseStudy = () => {
  const { t } = useLanguage();
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

  // Get solution items from translations
  const solutionItems = [
    t("caseStudy.solution.items.0"),
    t("caseStudy.solution.items.1"),
    t("caseStudy.solution.items.2"),
    t("caseStudy.solution.items.3"),
  ];

  return (
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background accent - constrained */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 sm:w-1/3 h-64 sm:h-96 bg-primary/3 blur-3xl rounded-full pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative w-full">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase">{t("caseStudy.label")}</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
            {t("caseStudy.title")} <span className="gradient-text">{t("caseStudy.titleHighlight")}</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-start">
          {/* Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">{t("caseStudy.situation.title")}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("caseStudy.situation.description")}
              </p>
            </div>
            
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">{t("caseStudy.solution.title")}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {solutionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card p-4 sm:p-6 border-primary/40">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">{t("caseStudy.outcome.title")}</h3>
              <p className="text-foreground font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                {t("caseStudy.outcome.headline")}
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {t("caseStudy.outcome.description")}
              </p>
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {caseStudyImages.map((image, index) => (
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
              {t("caseStudy.tapToEnlarge")}
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
                  src={caseStudyImages[selectedImageIndex].src}
                  alt={caseStudyImages[selectedImageIndex].alt}
                  className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg"
                />
                {caseStudyImages[selectedImageIndex].caption && (
                  <p className="text-foreground font-medium mt-3 sm:mt-4 text-center text-sm sm:text-base">
                    {caseStudyImages[selectedImageIndex].caption}
                  </p>
                )}
                
                {/* Image counter */}
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {selectedImageIndex + 1} / {caseStudyImages.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CaseStudy;
