import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, media, docs, api, and next internals
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

  // 2. Canonical admin access: Ensure all domains connect to purpleoryn.com/admin
  const rawHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  const host = rawHost.split(":")[0];
  const search = request.nextUrl.search;

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    if (host.endsWith("purpleoryn.com") && host !== "purpleoryn.com" && host !== "www.purpleoryn.com") {
      return NextResponse.redirect(new URL(`https://purpleoryn.com${pathname}${search}`));
    }
  }

  // 3. Supabase auth check (strictly scoped to /admin routes to avoid blocking public pages)
  if (isSupabaseConfigured() && pathname.startsWith("/admin")) {
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

    if (!user && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 4. Standalone Domain & Direct Route Resolution
  const langQuery = request.nextUrl.searchParams.get("lang")?.toLowerCase();

  const requestHeaders = new Headers(request.headers);

  // US Subdomain (us.purpleoryn.com)
  if (host === "us.purpleoryn.com") {
    requestHeaders.set("x-market", "us");
    requestHeaders.set("x-market-locale", "en");
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/us${search}`, request.url), {
        request: { headers: requestHeaders },
      });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Canada Subdomain (ca.purpleoryn.com)
  if (host === "ca.purpleoryn.com") {
    const locale = langQuery === "en" ? "en" : "fr";
    requestHeaders.set("x-market", "ca");
    requestHeaders.set("x-market-locale", locale);
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/ca${search}`, request.url), {
        request: { headers: requestHeaders },
      });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Haiti Subdomain (ht.purpleoryn.com)
  if (host === "ht.purpleoryn.com") {
    const locale = langQuery === "en" ? "en" : "fr";
    requestHeaders.set("x-market", "ht");
    requestHeaders.set("x-market-locale", locale);
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/ht${search}`, request.url), {
        request: { headers: requestHeaders },
      });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Direct paths (e.g. for localhost preview or direct bookmarking)
  if (pathname.startsWith("/us")) {
    requestHeaders.set("x-market", "us");
    requestHeaders.set("x-market-locale", "en");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/ca")) {
    const locale = langQuery === "en" ? "en" : "fr";
    requestHeaders.set("x-market", "ca");
    requestHeaders.set("x-market-locale", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/ht")) {
    const locale = langQuery === "en" ? "en" : "fr";
    requestHeaders.set("x-market", "ht");
    requestHeaders.set("x-market-locale", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 4. Default: Dominican Republic Standalone Website (purpleoryn.com, www, localhost)
  // Completely untouched original site.
  requestHeaders.set("x-market", "dr");
  requestHeaders.set("x-market-locale", "es");
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
