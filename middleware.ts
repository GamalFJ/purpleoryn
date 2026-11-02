import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveMarket, HOST_BY_MARKET, type MarketId } from "@/lib/routing/resolve";
import { verifyLinkToken, verifyMarketCookie, signMarketCookie } from "@/lib/routing/token";
import { checkIpReputation } from "@/lib/routing/ipReputation";
import { logRoutingEvent } from "@/lib/routing/logger";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Step 0a: Block direct access to internal route group /m/*
  if (pathname === "/m" || pathname.startsWith("/m/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Step 0b: Skip entirely for static assets, api, next internals, robots, favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/docs/") ||
    pathname.startsWith("/portafolio/") ||
    pathname.startsWith("/media/") ||
    /\.(?:png|jpg|jpeg|webp|svg|pdf|ico|css|js)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Optional Supabase session refresh
  if (isSupabaseConfigured()) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin routes (except /admin/login)
    if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Multi-market routing resolution
  const rawHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  const host = rawHost.split(":")[0];
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  const rawPath = pathname + search;
  const userAgent = request.headers.get("user-agent");
  const ipCountry = request.headers.get("x-vercel-ip-country");
  const ipRegion = request.headers.get("x-vercel-ip-country-region");
  const acceptLanguage = request.headers.get("accept-language");
  const clientIp = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  // Developer Computer Override:
  // On localhost or via preview parameters (?preview=us, ?market=us, ?m=us),
  // allows developer to view full website for any market with pricing!
  const previewParam = (
    request.nextUrl.searchParams.get("preview") ||
    request.nextUrl.searchParams.get("preview_market") ||
    (isLocalhost ? (request.nextUrl.searchParams.get("market") || request.nextUrl.searchParams.get("m")) : null)
  ) as MarketId | null;

  const devCookie = request.cookies.get("pcl_dev_market")?.value as MarketId | undefined;
  
  // On localhost, default to DR if no other preview/dev cookie is set
  const devMarket =
    previewParam && HOST_BY_MARKET[previewParam]
      ? previewParam
      : devCookie && HOST_BY_MARKET[devCookie]
      ? devCookie
      : isLocalhost && pathname !== "/choose"
      ? "dr"
      : null;

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
    devMarketOverride: devMarket,
    devShowPrices: true,
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
    // On localhost, never redirect away to production domains! Keep navigation local
    if (isLocalhost) {
      const localTarget = new URL(request.url);
      if (resolution.market && resolution.market !== "dr") {
        localTarget.searchParams.set("preview", resolution.market);
      } else {
        localTarget.searchParams.delete("preview");
      }
      if (resolution.targetPath && resolution.targetPath !== "/") {
        localTarget.pathname = resolution.targetPath;
      }
      return NextResponse.redirect(localTarget, 307);
    }

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
    // If visitor is requesting /choose, serve the neutral page
    if (pathname === "/choose") {
      const reqHeaders = new Headers(request.headers);
      reqHeaders.set("x-market", "dr");
      reqHeaders.set("x-show-prices", "false");
      return NextResponse.next({ request: { headers: reqHeaders } });
    }

    // On localhost, redirect to local /choose rather than production
    const chooseUrl = isLocalhost ? new URL("/choose", request.url) : new URL("/choose", "https://purpleoryn.com");
    return NextResponse.redirect(chooseUrl, 307);
  }

  // Serve action:
  const market = resolution.market || "dr";
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-market", market);

  // On localhost or dev override, always force showPrices: true!
  const showPrices = isLocalhost || resolution.showPrices;
  reqHeaders.set("x-show-prices", showPrices ? "true" : "false");
  reqHeaders.set("x-market-locale", resolution.locale || (market === "dr" ? "es" : market === "us" ? "en" : market === "ht" ? "fr" : "en"));

  let response: NextResponse;

  if (market === "dr") {
    // Serve full DR site
    response = NextResponse.next({ request: { headers: reqHeaders } });
  } else {
    // Rewrite non-DR market requests to internal route /m/[market]
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/m/${market}`;
    if (showPrices) {
      rewriteUrl.searchParams.set("show_prices", "true");
    }
    response = NextResponse.rewrite(rewriteUrl, { request: { headers: reqHeaders } });
  }

  // If developer set preview query parameter, persist it in cookie for their computer
  if (previewParam && HOST_BY_MARKET[previewParam]) {
    response.cookies.set("pcl_dev_market", previewParam, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });
  }

  // Clear developer preview if requested (?clear_preview=true)
  if (request.nextUrl.searchParams.has("clear_preview") || request.nextUrl.searchParams.has("clear_dev")) {
    response.cookies.delete("pcl_dev_market");
  }

  // Non-DR hosts get noindex
  if (!isLocalhost && host !== "purpleoryn.com" && host !== "www.purpleoryn.com") {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  // HTML for priced pages must not be cached by edge/browser caches
  if (showPrices) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
