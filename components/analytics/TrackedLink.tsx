"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type ConversionEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  event: Extract<ConversionEvent, "whatsapp_click" | "cal_click">;
  location: string;
  plan?: string;
  // whatsapp_click only: attributes the click to a market via a POST beacon
  // fired on click, never via the href/GET (see app/api/go/whatsapp/route.ts
  // -- a GET there was getting triggered by crawlers and Chrome's predictive
  // link-preloading, producing phantom "new lead" Telegram alerts).
  market?: string;
  children: ReactNode;
}

// External CTA (WhatsApp / Cal.com) that records a conversion event on click.
export function TrackedLink({ event, location, plan, market, children, ...anchor }: TrackedLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...anchor}
      onClick={(e) => {
        track(event, { cta_location: location, plan });
        if (event === "whatsapp_click" && market) {
          const body = new Blob([JSON.stringify({ market_id: market, channel: "whatsapp" })], { type: "application/json" });
          if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/go/whatsapp", body);
          } else {
            fetch("/api/go/whatsapp", { method: "POST", body, keepalive: true }).catch(() => {});
          }
        }
        anchor.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
