import { ReactNode } from "react";

const WA_NUMBER = "18096034113";

const PREFILL = `Hola Purple Cove Labs 👋

Nombre y Apellido(s): 
Negocio: 
Problema o necesidad: 

Me gustaría conversar sobre cómo pueden ayudarme.`;

interface WhatsAppButtonProps {
  children: ReactNode;
  className?: string;
}

const WhatsAppButton = ({ children, className }: WhatsAppButtonProps) => {
  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(PREFILL)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
};

export default WhatsAppButton;
