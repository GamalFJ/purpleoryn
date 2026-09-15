import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the user home folder confuses workspace-root detection.
  outputFileTracingRoot: __dirname,

  // Standing rule: Vercel's metered image optimiser 402s on Hobby once the
  // quota runs out. Uploads are converted to right-sized WebP in the browser.
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },

  async redirects() {
    return [
      // Old URLs that were indexed or linked before the rebuild.
      { source: "/pricing", destination: "/servicios", permanent: true },
      { source: "/planes", destination: "/servicios", permanent: true },
      { source: "/calculator.html", destination: "/servicios#calculadora", permanent: true },
      { source: "/apps", destination: "/", permanent: true },
      { source: "/demos", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
