import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

let initialized = false;

export const useCalInit = () => {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
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
};
