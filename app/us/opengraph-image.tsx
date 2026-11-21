import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Oryn | Lead Response System for U.S. Home-Service Businesses";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Your Next Customer Shouldn't Have to Wait.",
    subtitle: "Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.",
    marketBadge: "🇺🇸 U.S. Home Services • HVAC & Plumbing",
    domain: "us.purpleoryn.com",
    features: "Website Assistant · Inbound Voice Receptionist · Lead Routing",
  });
}
