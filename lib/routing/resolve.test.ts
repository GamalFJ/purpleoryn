import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveMarket } from './resolve.ts';
import type { ResolveMarketInput } from './resolve.ts';

test('1. US IP on ht host: redirect to us host, prices', () => {
  const input: ResolveMarketInput = {
    host: 'ht.purpleoryn.com',
    path: '/',
    ipCountry: 'US',
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'redirect');
  assert.equal(result.targetHost, 'us.purpleoryn.com');
  assert.equal(result.showPrices, true);
  assert.equal(result.market, 'us');
});

test('2. Haiti IP on apex: redirect to ht host', () => {
  const input: ResolveMarketInput = {
    host: 'purpleoryn.com',
    path: '/',
    ipCountry: 'HT',
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'redirect');
  assert.equal(result.targetHost, 'ht.purpleoryn.com');
  assert.equal(result.showPrices, true);
  assert.equal(result.market, 'ht');
});

test('3. Montreal IP (CA, QC) on ca host: serve, French default', () => {
  const input: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    ipCountry: 'CA',
    ipRegion: 'QC',
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'serve');
  assert.equal(result.market, 'ca');
  assert.equal(result.locale, 'fr');
  assert.equal(result.showPrices, true);
});

test('4. Flagged proxy, any host: neutral, no prices', () => {
  // on US host
  const inputUs: ResolveMarketInput = {
    host: 'us.purpleoryn.com',
    path: '/',
    ipCountry: 'US',
    proxyFlag: true,
    geoStrict: true,
  };
  const resultUs = resolveMarket(inputUs);
  assert.equal(resultUs.action, 'redirect');
  assert.equal(resultUs.targetHost, 'purpleoryn.com');
  assert.equal(resultUs.targetPath, '/choose');
  assert.equal(resultUs.showPrices, false);

  // on DR host (apex)
  const inputDr: ResolveMarketInput = {
    host: 'purpleoryn.com',
    path: '/',
    ipCountry: 'DO',
    proxyFlag: true,
    geoStrict: true,
  };
  const resultDr = resolveMarket(inputDr);
  assert.equal(resultDr.action, 'neutral');
  assert.equal(resultDr.targetPath, '/choose');
  assert.equal(resultDr.showPrices, false);
});

test('5. Unknown or missing country: neutral, no prices', () => {
  const input: ResolveMarketInput = {
    host: 'purpleoryn.com',
    path: '/',
    ipCountry: null,
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'neutral');
  assert.equal(result.showPrices, false);

  // on CA host
  const inputCa: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    ipCountry: 'XX', // Unknown foreign country
    proxyFlag: false,
    geoStrict: true,
  };
  const resultCa = resolveMarket(inputCa);
  assert.equal(resultCa.action, 'redirect');
  assert.equal(resultCa.targetHost, 'purpleoryn.com');
  assert.equal(resultCa.targetPath, '/choose');
  assert.equal(resultCa.showPrices, false);
});

test('6. Valid token, mismatched IP: token market wins, prices', () => {
  // Visitor from DO has a valid HT token on ht.purpleoryn.com?k=token
  const input: ResolveMarketInput = {
    host: 'ht.purpleoryn.com',
    path: '/?k=valid_token',
    ipCountry: 'DO',
    proxyFlag: true, // Even with proxy flag, token wins!
    tokenResult: { valid: true, market: 'ht', label: 'VIP Lead' },
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'redirect'); // strips k on right host
  assert.equal(result.market, 'ht');
  assert.equal(result.showPrices, true);
  assert.equal(result.stripToken, true);
  assert.deepEqual(result.setCookie, { market: 'ht', days: 30 });

  // And once stripped:
  const inputStripped: ResolveMarketInput = {
    host: 'ht.purpleoryn.com',
    path: '/',
    ipCountry: 'DO',
    proxyFlag: true,
    tokenResult: { valid: true, market: 'ht' },
    geoStrict: true,
  };
  const resultStripped = resolveMarket(inputStripped);
  assert.equal(resultStripped.action, 'serve');
  assert.equal(resultStripped.market, 'ht');
  assert.equal(resultStripped.showPrices, true);
});

test('7. Invalid or expired token: falls through to IP logic', () => {
  const input: ResolveMarketInput = {
    host: 'us.purpleoryn.com',
    path: '/?k=expired_token',
    ipCountry: 'US',
    proxyFlag: false,
    tokenResult: { valid: false, reason: 'expired' },
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'serve');
  assert.equal(result.market, 'us');
  assert.equal(result.showPrices, true);
  assert.equal(result.reason, 'ip');
});

test('8. Googlebot on us host: serve, no redirect, noindex', () => {
  const input: ResolveMarketInput = {
    host: 'us.purpleoryn.com',
    path: '/',
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    ipCountry: 'FR', // Even from foreign IP
    proxyFlag: true,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'serve');
  assert.equal(result.market, 'us');
  assert.equal(result.showPrices, false);
  assert.equal(result.reason, 'bot');
});

test('9. Direct request to /m/ht: 404', () => {
  const input: ResolveMarketInput = {
    host: 'purpleoryn.com',
    path: '/m/ht',
    ipCountry: 'HT',
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'notFound');
  assert.equal(result.showPrices, false);
  assert.equal(result.reason, 'direct_internal_route_access');
});

test('10. Manual region pick from /choose: landing page with showPrices = false', () => {
  // Visitor clicked Canada from /choose
  const input: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/?region=ca',
    ipCountry: 'FR', // Outside Canada
    proxyFlag: false,
    geoStrict: true,
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'serve');
  assert.equal(result.market, 'ca');
  assert.equal(result.showPrices, false);
  assert.equal(result.reason, 'manual_region_pick');
});

test('11. Quebec region vs other Canadian provinces language resolution', () => {
  // Quebec -> fr
  const inputQc: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    ipCountry: 'CA',
    ipRegion: 'QC',
    proxyFlag: false,
  };
  assert.equal(resolveMarket(inputQc).locale, 'fr');

  // Ontario -> en (default)
  const inputOn: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    ipCountry: 'CA',
    ipRegion: 'ON',
    proxyFlag: false,
  };
  assert.equal(resolveMarket(inputOn).locale, 'en');

  // Ontario with fr acceptLanguage -> fr
  const inputOnFr: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    ipCountry: 'CA',
    ipRegion: 'ON',
    acceptLanguage: 'fr-CA,fr;q=0.9,en;q=0.8',
    proxyFlag: false,
  };
  assert.equal(resolveMarket(inputOnFr).locale, 'fr');
});

test('12. Token host mismatch redirects to token host with token preserved', () => {
  const input: ResolveMarketInput = {
    host: 'purpleoryn.com',
    path: '/?k=secret_token_us',
    ipCountry: 'DO',
    proxyFlag: false,
    tokenResult: { valid: true, market: 'us' },
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'redirect');
  assert.equal(result.targetHost, 'us.purpleoryn.com');
  assert.equal(result.targetPath, '/?k=secret_token_us');
  assert.equal(result.showPrices, true);
});

test('13. Valid pcl_market cookie on right host serves with prices', () => {
  const input: ResolveMarketInput = {
    host: 'ca.purpleoryn.com',
    path: '/',
    cookieMarket: 'ca',
    ipCountry: 'FR', // Foreign IP
    proxyFlag: true, // On proxy
  };
  const result = resolveMarket(input);
  assert.equal(result.action, 'serve');
  assert.equal(result.market, 'ca');
  assert.equal(result.showPrices, true);
  assert.equal(result.reason, 'cookie');
});

