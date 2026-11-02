import { jwtVerify, SignJWT } from 'jose';
import type { MarketId, TokenResult } from './resolve';

const DEFAULT_SECRET = 'dev_fallback_secret_purplecove_routing_2026';

function getSecretKey(): Uint8Array {
  const secret = process.env.MARKET_LINK_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

export interface MarketTokenPayload {
  m: MarketId;
  l?: string;
  exp?: number;
  jti?: string;
  [key: string]: unknown;
}

/**
 * Verifies a signed link token (?k=...).
 * Token must contain { m: market, l: label, exp, jti } signed with MARKET_LINK_SECRET.
 */
export async function verifyLinkToken(tokenString: string): Promise<TokenResult> {
  if (!tokenString || typeof tokenString !== 'string') {
    return null;
  }
  try {
    const { payload } = await jwtVerify(tokenString, getSecretKey());
    const market = payload.m as MarketId;
    if (market === 'dr' || market === 'us' || market === 'ca' || market === 'ht') {
      return {
        valid: true,
        market,
        label: typeof payload.l === 'string' ? payload.l : undefined,
      };
    }
    return { valid: false, reason: 'invalid_market_in_token' };
  } catch (error) {
    return { valid: false, reason: error instanceof Error ? error.message : 'verification_failed' };
  }
}

/**
 * Creates a signed 30-day cookie token for pcl_market.
 */
export async function signMarketCookie(market: MarketId): Promise<string> {
  const key = getSecretKey();
  return new SignJWT({ m: market })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

/**
 * Verifies the pcl_market cookie.
 */
export async function verifyMarketCookie(cookieValue?: string | null): Promise<MarketId | null> {
  if (!cookieValue) return null;
  try {
    const { payload } = await jwtVerify(cookieValue, getSecretKey());
    const market = payload.m as MarketId;
    if (market === 'dr' || market === 'us' || market === 'ca' || market === 'ht') {
      return market;
    }
    return null;
  } catch {
    return null;
  }
}
