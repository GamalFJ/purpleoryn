import { ReactNode } from "react";

const CAL_LINK = "purple-cove-labs/20-min-cafe-virtual";

interface BookingButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "div";
  ariaLabel?: string;
}

const BookingButton = ({ children, className, as = "button", ariaLabel }: BookingButtonProps) => {
  const sharedProps = {
    "data-cal-namespace": "20-min-cafe-virtual",
    "data-cal-link": CAL_LINK,
    "data-cal-config": '{"layout":"month_view","theme":"dark"}',
    className,
    "aria-label": ariaLabel,
  };

  if (as === "div") {
    return (
      <div role="button" tabIndex={0} {...sharedProps}>
        {children}
      </div>
    );
  }

  return (
    <button type="button" {...sharedProps}>
      {children}
    </button>
  );
};

export default BookingButton;
