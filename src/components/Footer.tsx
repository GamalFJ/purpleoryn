import logo from "@/assets/logo.png";
import beaconsLogo from "@/assets/beacons-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import paypalLogo from "@/assets/paypal-logo.png";
import visaLogo from "@/assets/visa-logo.png";
import fluumLogo from "@/assets/fluum-logo.png";
import { Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 sm:py-12 border-t border-border/50 relative px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          {/* Logo and brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={logo} 
              alt="Purple Cove Labs" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" 
            />
            <span className="font-semibold text-foreground text-sm sm:text-base">Purple Cove Labs</span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="https://www.instagram.com/purplecovelabs.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/gamal-jastram-8a88b7175/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://x.com/TheCodeMagi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="X (Twitter)"
            >
              <XIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://beacons.ai/thecodemagi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Beacons"
            >
              <img src={beaconsLogo} alt="Beacons" className="w-5 h-5" />
            </a>
          </div>

          {/* Payment Icons - no background */}
          <div className="flex items-center gap-4 sm:gap-6">
            <img src={visaLogo} alt="Visa" className="h-5 sm:h-6 w-auto" />
            <img src={mastercardLogo} alt="Mastercard" className="h-5 sm:h-6 w-auto" />
            <img src={paypalLogo} alt="PayPal" className="h-5 sm:h-6 w-auto" />
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-xs sm:max-w-none">
            {t("footer.copyright")}
          </p>

          {/* Fluum Onboarding */}
          <a 
            href="https://www.fluum.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-muted-foreground text-xs sm:text-sm">Onboarding System Powered By</span>
            <img src={fluumLogo} alt="Fluum" className="h-5 sm:h-6 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
