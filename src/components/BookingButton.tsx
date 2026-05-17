import { ReactNode } from "react";

const CAL_URL = "https://cal.com/purple-cove-labs/20-min-cafe-virtual";

interface BookingButtonProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  as?: "button" | "div";
}

const BookingButton = ({ children, className, ariaLabel }: BookingButtonProps) => {
  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default BookingButton;
