import logo from "@/assets/logo.png";
import { Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Beacons.ai icon - three circles in triangular pattern
const BeaconsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="6" r="3.5" />
    <circle cx="6" cy="16" r="3.5" />
    <circle cx="18" cy="16" r="3.5" />
  </svg>
);

// Visa logo - blue text
const VisaIcon = () => (
  <svg viewBox="0 0 50 16" className="h-5 sm:h-6 w-auto">
    <path d="M19.5 0.5L16.5 15.5H12.5L15.5 0.5H19.5ZM35.5 10.2L37.7 4L39 10.2H35.5ZM40.3 15.5H44L40.8 0.5H37.3C36.5 0.5 35.8 1 35.5 1.7L29 15.5H33.2L34 13.3H39.2L39.7 15.5H40.3ZM29.8 10.5C29.8 5.8 23.3 5.5 23.3 3.5C23.3 2.8 24 2.1 25.4 1.9C26.1 1.8 28 1.7 30.1 2.7L31 0.9C29.8 0.5 28.3 0 26.4 0C22.5 0 19.8 2 19.8 4.9C19.8 9.3 26.3 9.6 26.3 11.8C26.3 12.7 25.3 13.5 23.7 13.5C21.8 13.5 20 12.8 19 12.2L18 14.1C19.1 14.8 21.1 15.4 23.2 15.4C27.4 15.5 29.8 13.6 29.8 10.5ZM13 0.5L6.5 15.5H2.2L-1 3.3C-1.2 2.5 -1.4 2.2 -2 1.9C-3 1.4 -4.6 0.9 -6 0.5L-5.9 0.5H0.8C1.7 0.5 2.5 1.1 2.7 2.1L4.3 10.4L8.4 0.5H13Z" transform="translate(8, 0)" fill="#1A1F71"/>
  </svg>
);

// Mastercard logo - overlapping circles
const MastercardIcon = () => (
  <svg viewBox="0 0 40 24" className="h-5 sm:h-6 w-auto">
    <circle cx="14" cy="12" r="10" fill="#EB001B" />
    <circle cx="26" cy="12" r="10" fill="#F79E1B" />
    <path d="M20 4.4c2.4 1.9 3.9 4.7 3.9 7.6s-1.5 5.7-3.9 7.6c-2.4-1.9-3.9-4.7-3.9-7.6s1.5-5.7 3.9-7.6z" fill="#FF5F00" />
  </svg>
);

// PayPal logo
const PayPalIcon = () => (
  <svg viewBox="0 0 48 16" className="h-5 sm:h-6 w-auto">
    <path d="M14.5 1H18.8C21.6 1 23 2.5 22.7 4.8C22.3 7.8 20.3 9.5 17.5 9.5H15.8C15.5 9.5 15.2 9.7 15.1 10L14.4 14.4C14.3 14.7 14.1 14.9 13.8 14.9H11.3C11 14.9 10.8 14.7 10.9 14.4L13.2 1.6C13.3 1.3 13.5 1 14.5 1Z" fill="#003087"/>
    <path d="M24.5 1H28.8C31.6 1 33 2.5 32.7 4.8C32.3 7.8 30.3 9.5 27.5 9.5H25.8C25.5 9.5 25.2 9.7 25.1 10L24.4 14.4C24.3 14.7 24.1 14.9 23.8 14.9H21.3C21 14.9 20.8 14.7 20.9 14.4L23.2 1.6C23.3 1.3 23.5 1 24.5 1Z" fill="#0070E0"/>
    <path d="M34 6H37C39 6 40 7 39.8 8.5C39.5 10.5 38 11.5 36 11.5H35C34.8 11.5 34.6 11.7 34.5 11.9L34 14.4C34 14.7 33.8 14.9 33.5 14.9H31.5C31.2 14.9 31 14.7 31.1 14.4L32.7 6.6C32.8 6.3 33 6 34 6Z" fill="#003087"/>
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
              href="https://x.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="X (Twitter)"
            >
              <XIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://beacons.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Beacons"
            >
              <BeaconsIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Payment Icons - no background */}
          <div className="flex items-center gap-4 sm:gap-6">
            <VisaIcon />
            <MastercardIcon />
            <PayPalIcon />
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-xs sm:max-w-none">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
