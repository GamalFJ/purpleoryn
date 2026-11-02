import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveMarket, type MarketId } from "@/lib/routing/resolve";
import { verifyLinkToken, verifyMarketCookie, signMarketCookie } from "@/lib/routing/token";
import { checkIpReputation } from "@/lib/routing/ipReputation";
import { logRoutingEvent } from "@/lib/routing/logger";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Step 0a: Block direct external requests to internal route group /m/*
  if (pathname === "/m" || pathname.startsWith("/m/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Step 0b: Allow static assets and Next.js internal files without routing overhead
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/docs/") ||
    pathname.startsWith("/portafolio/") ||
    /\.(?:png|jpg|jpeg|webp|svg|pdf|ico|css|js)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Step 0c: Admin and Auth routes maintain existing Supabase authentication flow
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-market", "dr");
    let response = NextResponse.next({ request: { headers: requestHeaders } });

    if (!isSupabaseConfigured()) return response;

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // Multi-market routing resolution
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  const rawPath = pathname + search;
  const userAgent = request.headers.get("user-agent");
  const ipCountry = request.headers.get("x-vercel-ip-country");
  const ipRegion = request.headers.get("x-vercel-ip-country-region");
  const acceptLanguage = request.headers.get("accept-language");
  const clientIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  // Extract link token (?k=) and market cookie (pcl_market)
  const tokenParam = request.nextUrl.searchParams.get("k");
  const tokenResult = tokenParam ? await verifyLinkToken(tokenParam) : null;
  const cookieValue = request.cookies.get("pcl_market")?.value;
  const cookieMarket = await verifyMarketCookie(cookieValue);
  const manualRegionParam = request.nextUrl.searchParams.get("region") as MarketId | null;

  // Check IP reputation with provider interface
  const proxyFlag = await checkIpReputation(clientIp);
  const geoStrict = process.env.GEO_STRICT !== "false"; // Default true

  // Pure resolution
  const resolution = resolveMarket({
    host,
    path: rawPath,
    userAgent,
    ipCountry,
    ipRegion,
    proxyFlag,
    tokenResult,
    cookieMarket,
    geoStrict,
    acceptLanguage,
    manualMarket: manualRegionParam,
  });

  // Asynchronously record routing event (non-blocking)
  logRoutingEvent({
    host,
    market: resolution.market,
    action: resolution.action,
    reason: resolution.reason,
    country: ipCountry,
    region: ipRegion,
    proxyFlag,
    ip: clientIp,
  });

  // Handle resolution actions
  if (resolution.action === "notFound") {
    return new NextResponse(null, { status: 404 });
  }

  if (resolution.action === "redirect") {
    const targetUrl = new URL(resolution.targetPath || "/", `https://${resolution.targetHost}`);
    const redirectResponse = NextResponse.redirect(targetUrl, 307);

    // If a signed link token was validated on target host, issue signed pcl_market cookie (30 days)
    if (resolution.setCookie) {
      const signedCookie = await signMarketCookie(resolution.setCookie.market);
      redirectResponse.cookies.set("pcl_market", signedCookie, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: resolution.setCookie.days * 24 * 60 * 60,
        path: "/",
      });
    }

    return redirectResponse;
  }

  if (resolution.action === "neutral") {
    const isApex = host === "purpleoryn.com" || host === "www.purpleoryn.com" || host.startsWith("localhost");
    if (isApex && pathname === "/choose") {
      const reqHeaders = new Headers(request.headers);
      reqHeaders.set("x-market", "dr");
      reqHeaders.set("x-show-prices", "false");
      return NextResponse.next({ request: { headers: reqHeaders } });
    }

    const chooseUrl = new URL("/choose", "https://purpleoryn.com");
    return NextResponse.redirect(chooseUrl, 307);
  }

  // Serve action:
  const market = resolution.market || "dr";
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-market", market);
  reqHeaders.set("x-show-prices", resolution.showPrices ? "true" : "false");
  reqHeaders.set("x-market-locale", resolution.locale || "en");

  let response: NextResponse;

  if (market === "dr") {
    // Serve full DR site
    response = NextResponse.next({ request: { headers: reqHeaders } });
  } else {
    // Rewrite non-DR market requests to internal route /m/[market]
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/m/${market}`;
    response = NextResponse.rewrite(rewriteUrl, { request: { headers: reqHeaders } });
  }

  // Non-DR hosts get noindex
  const isApex = host === "purpleoryn.com" || host === "www.purpleoryn.com" || host.startsWith("localhost");
  if (!isApex) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  // HTML for priced pages must not be cached by edge/browser caches
  if (resolution.showPrices) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
