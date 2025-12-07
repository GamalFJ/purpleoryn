import logo from "@/assets/logo.png";
import { Linkedin, Instagram } from "lucide-react";
const Footer = () => {
  return <footer className="py-12 border-t border-border/50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Purple Cove Labs" className="h-10 w-10 rounded-full" />
            <span className="font-semibold text-foreground">Purple Cove Labs</span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-justify">
            © 2025 Purple Cove Labs | Powered by Oryn AI .

 All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;