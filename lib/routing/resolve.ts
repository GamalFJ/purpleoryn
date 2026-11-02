export type MarketId = 'dr' | 'us' | 'ca' | 'ht';

export type ProxyFlag = boolean | 'unknown';

export interface ValidTokenResult {
  valid: true;
  market: MarketId;
  label?: string;
}

export interface InvalidTokenResult {
  valid: false;
  reason?: string;
}

export type TokenResult = ValidTokenResult | InvalidTokenResult | null | undefined;

export interface ResolveMarketInput {
  host: string;
  path: string;
  userAgent?: string | null;
  ipCountry?: string | null;
  ipRegion?: string | null;
  proxyFlag: ProxyFlag;
  tokenResult?: TokenResult;
  cookieMarket?: MarketId | null;
  geoStrict?: boolean;
  acceptLanguage?: string | null;
  manualMarket?: MarketId | null;
}

export type ResolveAction = 'serve' | 'redirect' | 'neutral' | 'notFound' | 'passthrough';

export interface ResolveMarketOutput {
  action: ResolveAction;
  market?: MarketId;
  targetHost?: string;
  targetPath?: string;
  targetUrl?: string;
  showPrices: boolean;
  locale?: string;
  reason: string;
  setCookie?: {
    market: MarketId;
    days: number;
  };
  stripToken?: boolean;
}

export const APEX_HOST = 'purpleoryn.com';

export const HOST_BY_MARKET: Record<MarketId, string> = {
  dr: 'purpleoryn.com',
  us: 'us.purpleoryn.com',
  ca: 'ca.purpleoryn.com',
  ht: 'ht.purpleoryn.com',
};

export const MARKET_BY_HOST: Record<string, MarketId> = {
  'purpleoryn.com': 'dr',
  'www.purpleoryn.com': 'dr',
  'us.purpleoryn.com': 'us',
  'ca.purpleoryn.com': 'ca',
  'ht.purpleoryn.com': 'ht',
};

export const COUNTRY_TO_MARKET: Record<string, MarketId> = {
  DO: 'dr',
  US: 'us',
  CA: 'ca',
  HT: 'ht',
};

export function normalizeHost(host: string): string {
  const withoutPort = host.split(':')[0].trim().toLowerCase();
  // Map local dev hosts to apex DR
  if (withoutPort === 'localhost' || withoutPort === '127.0.0.1') {
    return APEX_HOST;
  }
  return withoutPort;
}

export function isBot(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  return /Googlebot|Bingbot|bingbot|Google-InspectionTool/i.test(userAgent);
}

export function resolveLocale(
  market: MarketId,
  ipRegion?: string | null,
  acceptLanguage?: string | null
): string {
  if (market === 'dr') return 'es';
  if (market === 'us') return 'en';
  if (market === 'ca') {
    if (ipRegion && ipRegion.trim().toUpperCase() === 'QC') {
      return 'fr';
    }
    if (acceptLanguage) {
      const primary = acceptLanguage.split(',')[0].trim().toLowerCase();
      if (primary.startsWith('fr')) return 'fr';
    }
    return 'en';
  }
  if (market === 'ht') {
    if (acceptLanguage) {
      const primary = acceptLanguage.split(',')[0].trim().toLowerCase();
      if (primary.startsWith('en')) return 'en';
    }
    return 'fr';
  }
  return 'en';
}

/**
 * Pure market resolution function with no I/O.
 */
export function resolveMarket(input: ResolveMarketInput): ResolveMarketOutput {
  const host = normalizeHost(input.host);
  const rawPath = input.path || '/';
  const pathname = rawPath.split('?')[0];
  const search = rawPath.includes('?') ? rawPath.slice(rawPath.indexOf('?')) : '';
  const searchParams = new URLSearchParams(search);
  const geoStrict = input.geoStrict !== false; // Default true

  // Step 0a: Block direct access to internal route group /m/*
  if (pathname === '/m' || pathname.startsWith('/m/')) {
    return {
      action: 'notFound',
      showPrices: false,
      reason: 'direct_internal_route_access',
    };
  }

  // Step 0b: Skip entirely for static assets, api, next internals, robots, favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/portafolio/') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.pdf')
  ) {
    return {
      action: 'passthrough',
      showPrices: false,
      reason: 'static_asset',
    };
  }

  // Step 0c: Verified search bots (Googlebot, Bingbot)
  // Bots are never redirected: serve requested host's own market page.
  if (isBot(input.userAgent)) {
    const botMarket = MARKET_BY_HOST[host] || 'dr';
    return {
      action: 'serve',
      market: botMarket,
      showPrices: false,
      locale: resolveLocale(botMarket, input.ipRegion, input.acceptLanguage),
      reason: 'bot',
    };
  }

  // Manual region selection from /choose:
  // Can be passed via manualMarket in input OR via ?region= in query param
  const manualRegionParam = searchParams.get('region') as MarketId | null;
  const effectiveManualMarket =
    input.manualMarket ||
    (manualRegionParam && HOST_BY_MARKET[manualRegionParam] ? manualRegionParam : null);

  if (effectiveManualMarket) {
    const targetHost = HOST_BY_MARKET[effectiveManualMarket];
    if (host !== targetHost) {
      return {
        action: 'redirect',
        market: effectiveManualMarket,
        targetHost,
        targetPath: `/?region=${effectiveManualMarket}`,
        showPrices: false,
        locale: resolveLocale(effectiveManualMarket, input.ipRegion, input.acceptLanguage),
        reason: 'manual_region_redirect',
      };
    }
    return {
      action: 'serve',
      market: effectiveManualMarket,
      showPrices: false,
      locale: resolveLocale(effectiveManualMarket, input.ipRegion, input.acceptLanguage),
      reason: 'manual_region_pick',
    };
  }

  // Check if visitor is already requesting /choose on apex host
  if (pathname === '/choose' || pathname.startsWith('/choose/')) {
    if (host === APEX_HOST || host === 'www.' + APEX_HOST) {
      return {
        action: 'serve',
        showPrices: false,
        reason: 'neutral_page',
      };
    }
    return {
      action: 'redirect',
      targetHost: APEX_HOST,
      targetPath: '/choose',
      showPrices: false,
      reason: 'neutral_redirect',
    };
  }

  // Step 1: Signed link token (?k=)
  if (input.tokenResult && input.tokenResult.valid) {
    const tokenMarket = input.tokenResult.market;
    const targetHost = HOST_BY_MARKET[tokenMarket];

    // If host differs from token market host, redirect there with the token preserved
    if (host !== targetHost) {
      return {
        action: 'redirect',
        market: tokenMarket,
        targetHost,
        targetPath: rawPath,
        showPrices: true,
        locale: resolveLocale(tokenMarket, input.ipRegion, input.acceptLanguage),
        reason: 'token_host_mismatch',
      };
    }

    // On the right host:
    // If the URL has ?k=, strip k and set cookie
    if (searchParams.has('k')) {
      const cleanParams = new URLSearchParams(searchParams);
      cleanParams.delete('k');
      const cleanSearch = cleanParams.toString();
      const cleanPath = pathname + (cleanSearch ? `?${cleanSearch}` : '');

      return {
        action: 'redirect',
        market: tokenMarket,
        targetHost: host,
        targetPath: cleanPath,
        showPrices: true,
        locale: resolveLocale(tokenMarket, input.ipRegion, input.acceptLanguage),
        reason: 'token_strip',
        setCookie: {
          market: tokenMarket,
          days: 30,
        },
        stripToken: true,
      };
    }

    // Already on right host and token verified
    return {
      action: 'serve',
      market: tokenMarket,
      showPrices: true,
      locale: resolveLocale(tokenMarket, input.ipRegion, input.acceptLanguage),
      reason: 'token',
    };
  }

  // Step 2: Valid pcl_market cookie
  if (input.cookieMarket && HOST_BY_MARKET[input.cookieMarket]) {
    const cookieMarket = input.cookieMarket;
    const targetHost = HOST_BY_MARKET[cookieMarket];

    if (host !== targetHost) {
      return {
        action: 'redirect',
        market: cookieMarket,
        targetHost,
        targetPath: pathname === '/' ? '/' : rawPath,
        showPrices: true,
        locale: resolveLocale(cookieMarket, input.ipRegion, input.acceptLanguage),
        reason: 'cookie_host_mismatch',
      };
    }

    return {
      action: 'serve',
      market: cookieMarket,
      showPrices: true,
      locale: resolveLocale(cookieMarket, input.ipRegion, input.acceptLanguage),
      reason: 'cookie',
    };
  }

  // Step 3: IP country (x-vercel-ip-country)
  const country = input.ipCountry ? input.ipCountry.trim().toUpperCase() : null;
  const ipMarket = country ? COUNTRY_TO_MARKET[country] : null;

  // If proxyFlag is true or (unknown and geoStrict), skip to Step 4 Neutral
  const proxyBlocked = input.proxyFlag === true || (input.proxyFlag === 'unknown' && geoStrict);

  if (ipMarket && !proxyBlocked) {
    const targetHost = HOST_BY_MARKET[ipMarket];

    // If resolved market differs from host's market, redirect (307) to resolved market root
    if (host !== targetHost) {
      return {
        action: 'redirect',
        market: ipMarket,
        targetHost,
        targetPath: '/',
        showPrices: true,
        locale: resolveLocale(ipMarket, input.ipRegion, input.acceptLanguage),
        reason: 'ip_redirect',
      };
    }

    return {
      action: 'serve',
      market: ipMarket,
      showPrices: true,
      locale: resolveLocale(ipMarket, input.ipRegion, input.acceptLanguage),
      reason: 'ip',
    };
  }

  // Step 4: Neutral (fail closed)
  // Foreign countries, flagged proxies, unknown, missing headers.
  // Serve the neutral page at https://purpleoryn.com/choose. Other hosts redirect there.
  const neutralReason = input.proxyFlag === true
    ? 'flagged_proxy'
    : input.proxyFlag === 'unknown' && geoStrict
    ? 'proxy_unknown_geostrict'
    : !country
    ? 'missing_country'
    : 'unsupported_country';

  if (host === APEX_HOST || host === 'www.' + APEX_HOST) {
    return {
      action: 'neutral',
      targetHost: APEX_HOST,
      targetPath: '/choose',
      showPrices: false,
      reason: neutralReason,
    };
  }

  return {
    action: 'redirect',
    targetHost: APEX_HOST,
    targetPath: '/choose',
    showPrices: false,
    reason: neutralReason,
  };
}

