import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const reqHeaders = await headers();
  const host = (reqHeaders.get("host") || "").split(":")[0].toLowerCase();
  const isDr = host === "purpleoryn.com" || host === "www.purpleoryn.com" || host === "localhost" || host === "127.0.0.1";

  if (!isDr) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/gracias", "/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
