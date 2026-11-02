import { SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';
import { HOST_BY_MARKET, type MarketId } from '../lib/routing/resolve.ts';

const VALID_MARKETS: MarketId[] = ['dr', 'us', 'ca', 'ht'];

function parseArgs(args: string[]): {
  market: MarketId;
  label?: string;
  days: number;
} {
  let market: MarketId | null = null;
  let label: string | undefined = undefined;
  let days = 30;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--market' || arg === '-m') {
      market = (args[++i] || '').toLowerCase() as MarketId;
    } else if (arg === '--label' || arg === '-l') {
      label = args[++i];
    } else if (arg === '--days' || arg === '-d') {
      const parsedDays = parseInt(args[++i], 10);
      if (!isNaN(parsedDays) && parsedDays > 0) {
        days = parsedDays;
      }
    }
  }

  if (!market || !VALID_MARKETS.includes(market)) {
    console.error(`Error: --market must be one of: ${VALID_MARKETS.join(', ')}`);
    console.error('Usage: npm run link -- --market ht --label "Prospect Name" --days 30');
    process.exit(1);
  }

  return { market, label, days };
}

async function mint() {
  const { market, label, days } = parseArgs(process.argv.slice(2));
  const secretString = process.env.MARKET_LINK_SECRET || 'dev_fallback_secret_purplecove_routing_2026';
  const secretKey = new TextEncoder().encode(secretString);

  const jti = randomUUID();
  const jwtBuilder = new SignJWT({
    m: market,
    ...(label ? { l: label } : {}),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${days}d`);

  const token = await jwtBuilder.sign(secretKey);
  const host = HOST_BY_MARKET[market];
  const url = `https://${host}/?k=${token}`;

  console.log('\n--- Signed Market Link Generated ---');
  console.log(`Market:     ${market} (${host})`);
  if (label) console.log(`Label:      ${label}`);
  console.log(`Expires in: ${days} days`);
  console.log(`Token ID:   ${jti}`);
  console.log(`\nURL:\n${url}\n`);
}

mint().catch((err) => {
  console.error('Failed to mint link:', err);
  process.exit(1);
});
