import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export interface OgImageOptions {
  title: string;
  subtitle: string;
  marketBadge?: string;
  domain?: string;
  features?: string;
}

// Shared template for every route's opengraph-image / twitter-image.
// Supports market badges, localized domains, and feature highlights
// with Purple Cove Labs' signature plum palette.
export async function renderOgImage({
  title,
  subtitle,
  marketBadge,
  domain = "www.purpleoryn.com",
  features,
}: OgImageOptions) {
  const logo = await readFile(path.join(process.cwd(), "public/media/logo-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          backgroundColor: "#130924",
          color: "#f1ecf8",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={68} height={68} alt="" style={{ borderRadius: 999 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: "#f5f3ff" }}>Purple Cove Labs</div>
              <div style={{ fontSize: 16, color: "#a78bfa", fontWeight: 500 }}>Commercial Web &amp; AI Systems</div>
            </div>
          </div>

          {marketBadge && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#2e1065",
                border: "1px solid #7c3aed",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 18,
                fontWeight: 600,
                color: "#e9d5ff",
              }}
            >
              {marketBadge}
            </div>
          )}
        </div>

        {/* Center Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1040 }}>
          <div
            style={{
              fontSize: title.length > 55 ? 54 : 62,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: "#c4b5fd",
              maxWidth: 980,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #3b1d6e",
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 600, color: "#c084fc", letterSpacing: -0.3 }}>
            {domain}
          </div>

          {features && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#24103f",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 17,
                color: "#ddd6fe",
                fontWeight: 500,
                border: "1px solid #581c87",
              }}
            >
              {features}
            </div>
          )}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
