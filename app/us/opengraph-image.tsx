import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Purple Cove Labs | Commercial Web, Google Search & 24/7 SMS AI in the United States";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "The business that answers first wins the customer.",
    subtitle: "High-conversion website, verified Google local visibility, and 24/7 SMS AI agents that qualify leads instantly for US businesses.",
    marketBadge: "🇺🇸 United States Market",
    domain: "us.purpleoryn.com",
    features: "Speed to Lead · 24/7 SMS AI · Google Local SEO",
  });
}
