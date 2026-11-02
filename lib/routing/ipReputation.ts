import type { ProxyFlag } from './resolve';

export interface IpReputationProvider {
  name: string;
  check(ip: string): Promise<ProxyFlag>;
}

// In-memory 24-hour cache
interface CacheEntry {
  flag: ProxyFlag;
  expiresAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const cache = new Map<string, CacheEntry>();

/**
 * NoneProvider: default provider for v1. Always returns 'unknown'.
 */
class NoneProvider implements IpReputationProvider {
  name = 'none';
  async check(): Promise<ProxyFlag> {
    return 'unknown';
  }
}

/**
 * IpinfoProvider adapter stub.
 * Calls ipinfo privacy detection API with an 800ms timeout.
 */
class IpinfoProvider implements IpReputationProvider {
  name = 'ipinfo';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async check(ip: string): Promise<ProxyFlag> {
    if (!this.apiKey) return 'unknown';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    try {
      const response = await fetch(`https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${this.apiKey}`, {
        signal: controller.signal,
      });

      if (!response.ok) return 'unknown';
      const data = await response.json();
      const privacy = data.privacy;
      if (!privacy) return false;

      const isProxy = Boolean(
        privacy.vpn || privacy.proxy || privacy.tor || privacy.relay || privacy.hosting
      );
      return isProxy;
    } catch {
      return 'unknown';
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * IPQualityScoreProvider adapter stub.
 * Calls IPQS fraud detection API with an 800ms timeout.
 */
class IpQualityScoreProvider implements IpReputationProvider {
  name = 'ipqualityscore';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async check(ip: string): Promise<ProxyFlag> {
    if (!this.apiKey) return 'unknown';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    try {
      const response = await fetch(
        `https://ipqualityscore.com/api/json/ip/${this.apiKey}/${encodeURIComponent(ip)}?strictness=1`,
        { signal: controller.signal }
      );

      if (!response.ok) return 'unknown';
      const data = await response.json();
      if (!data.success) return 'unknown';

      const isProxy = Boolean(data.vpn || data.proxy || data.tor || (data.fraud_score && data.fraud_score >= 80));
      return isProxy;
    } catch {
      return 'unknown';
    } finally {
      clearTimeout(timeout);
    }
  }
}

function getProvider(): IpReputationProvider {
  const providerName = (process.env.IP_REPUTATION_PROVIDER || 'none').toLowerCase().trim();
  const apiKey = process.env.IP_REPUTATION_KEY || '';

  if (providerName === 'ipinfo') {
    return new IpinfoProvider(apiKey);
  }
  if (providerName === 'ipqualityscore') {
    return new IpQualityScoreProvider(apiKey);
  }
  return new NoneProvider();
}

/**
 * Checks the reputation of an IP address.
 * Cached in-memory for 24 hours. Returns true (proxy/VPN), false, or 'unknown'.
 */
export async function checkIpReputation(ip?: string | null): Promise<ProxyFlag> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return 'unknown';
  }

  const now = Date.now();
  const cached = cache.get(ip);
  if (cached && cached.expiresAt > now) {
    return cached.flag;
  }

  const provider = getProvider();
  let flag: ProxyFlag = 'unknown';

  try {
    flag = await provider.check(ip);
  } catch {
    flag = 'unknown';
  }

  cache.set(ip, {
    flag,
    expiresAt: now + CACHE_TTL_MS,
  });

  return flag;
}
