import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// Shared template for every route's opengraph-image / twitter-image, so each
// page gets its own card instead of inheriting the homepage's.
export async function renderOgImage({ title, subtitle }: { title: string; subtitle: string }) {
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
          padding: "72px 80px",
          background: "#180f28",
          color: "#f1ecf8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 999 }} />
          <div style={{ fontSize: 34, fontWeight: 600 }}>Purple Cove Labs</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#b9aecb", maxWidth: 960 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 26, color: "#b98aff" }}>www.purpleoryn.com</div>
      </div>
    ),
    OG_SIZE,
  );
}
