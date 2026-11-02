import 'server-only';
import type { MarketId, MarketConfig } from './types';

/**
 * Dynamically loads the specific market config per request on the server.
 * This guarantees that configs and prices are never statically bundled together
 * into shared or client bundles.
 */
export async function getMarketConfig(marketId: MarketId): Promise<MarketConfig> {
  switch (marketId) {
    case 'dr': {
      const mod = await import('./dr');
      return mod.config;
    }
    case 'us': {
      const mod = await import('./us');
      return mod.config;
    }
    case 'ca': {
      const mod = await import('./ca');
      return mod.config;
    }
    case 'ht': {
      const mod = await import('./ht');
      return mod.config;
    }
    default: {
      const mod = await import('./dr');
      return mod.config;
    }
  }
}

export type { MarketConfig, MarketId };
