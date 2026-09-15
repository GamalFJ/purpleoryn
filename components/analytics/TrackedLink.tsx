"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type ConversionEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  event: Extract<ConversionEvent, "whatsapp_click" | "cal_click">;
  location: string;
  plan?: string;
  children: ReactNode;
}

// External CTA (WhatsApp / Cal.com) that records a conversion event on click.
export function TrackedLink({ event, location, plan, children, ...anchor }: TrackedLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...anchor}
      onClick={(e) => {
        track(event, { cta_location: location, plan });
        anchor.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
