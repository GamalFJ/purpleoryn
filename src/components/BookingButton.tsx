import { ReactNode, useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "purple-cove-labs/20-min-cafe-virtual";

interface BookingButtonProps {
  children: ReactNode;
  className?: string;
  /** Render as a span instead of a button (use inside <a>-like wrappers). */
  as?: "button" | "div";
  ariaLabel?: string;
}

const BookingButton = ({ children, className, as = "button", ariaLabel }: BookingButtonProps) => {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "20-min-cafe-virtual" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#a855f7" },
          light: { "cal-brand": "#a855f7" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

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
