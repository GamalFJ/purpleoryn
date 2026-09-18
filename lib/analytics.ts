// Conversion events go to the GTM dataLayer; GA4 tags in the GTM container
// map them to GA4 events. Event names follow GA4 snake_case conventions.
export type ConversionEvent =
  | "whatsapp_click"
  | "cal_click"
  | "tier_selected"
  | "calculator_completed"
  | "form_submitted"
  | "generate_lead"
  | "document_download";

// Set by the lead form just before redirecting to /gracias; consumed there.
export const LEAD_FLAG = "pcl_lead_submitted";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: ConversionEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
