import { createHash } from 'node:crypto';
import { isServiceRoleConfigured } from '@/lib/supabase/env';
import { serviceClient } from '@/lib/supabase/service';

export interface RoutingEventInput {
  host: string;
  market?: string | null;
  action: string;
  reason: string;
  country?: string | null;
  region?: string | null;
  proxyFlag?: boolean | string | null;
  ip?: string | null;
}

function hashIp(rawIp?: string | null): string | null {
  if (!rawIp) return null;
  const salt = process.env.ROUTING_IP_SALT || 'purplecove_routing_salt_2026';
  return createHash('sha256').update(`${salt}:${rawIp}`).digest('hex');
}

/**
 * Logs a routing event to Supabase table routing_events asynchronously.
 * Never throws and never blocks the response.
 */
export function logRoutingEvent(input: RoutingEventInput): void {
  // Run in a detached microtask
  queueMicrotask(async () => {
    try {
      if (!isServiceRoleConfigured()) {
        return;
      }
      const supabase = serviceClient();
      await supabase.from('routing_events').insert({
        timestamp: new Date().toISOString(),
        host: input.host,
        resolved_market: input.market || null,
        action: input.action,
        reason: input.reason,
        country: input.country || null,
        region: input.region || null,
        proxy_flag: String(input.proxyFlag ?? 'unknown'),
        ip_hash: hashIp(input.ip),
      });
    } catch {
      // Fire-and-forget: silently ignore errors so visitors never experience latency
    }
  });
}
