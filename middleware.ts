import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

// Domain -> market id. localhost falls back to 'do'; to work on another
// market locally, temporarily add your host here or hardcode the id below.
const MARKET_BY_HOST: Record<string, string> = {
  "purpleoryn.com": "do",
  "www.purpleoryn.com": "do",
  "us.purpleoryn.com": "us",
  "ca.purpleoryn.com": "ca",
  "ht.purpleoryn.com": "ht",
};

// Markets with real, translated content/pricing. Everything else redirects
// public pages to /coming-soon -- the domain is live (verified in Vercel)
// but the content behind it isn't: no market_content rows, null pricing,
// and the /servicios form's phone validation only accepts DR numbers. Move
// a market here only after that's actually fixed, not just when its domain
// is attached.
const READY_MARKETS = new Set(["do"]);

// Sets x-market from the request host, then refreshes the Supabase session
// cookie on admin routes and sends signed-out visitors to the login page.
// Admin *authorization* is re-checked server-side in the admin layout and
// enforced again by row-level security.
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const marketId = MARKET_BY_HOST[host] ?? "do";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-market", marketId);
  const requestWithMarket = { headers: requestHeaders };

  const { pathname } = request.nextUrl;
  const isExempt = pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api") || pathname === "/coming-soon";
  if (!READY_MARKETS.has(marketId) && !isExempt) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request: requestWithMarket });
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: requestWithMarket });
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

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};
