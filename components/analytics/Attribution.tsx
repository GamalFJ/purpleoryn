"use client";

import { useEffect } from "react";

const KEY = "pcl_attribution";

export interface Attribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  landing_page: string;
  referrer: string;
}

// Stores first-touch attribution for the session so a lead submitted three
// pages later still knows it came from, e.g., the Google Business Profile link.
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const data: Attribution = {
        utm_source: params.get("utm_source") ?? "",
        utm_medium: params.get("utm_medium") ?? "",
        utm_campaign: params.get("utm_campaign") ?? "",
        landing_page: window.location.pathname,
        referrer: document.referrer.startsWith(window.location.origin) ? "" : document.referrer,
      };
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // Storage blocked (private mode): attribution is best-effort.
    }
  }, []);
  return null;
}

export function readAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
