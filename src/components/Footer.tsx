import logo from "@/assets/logo.png";
import { Linkedin, Instagram } from "lucide-react";

const Footer = () => {
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
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-xs sm:max-w-none">
            © 2025 Purple Cove Labs | Powered by Oryn AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
