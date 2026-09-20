-- Seed data for markets / pricing_tiers.
--
-- DO market: current live pricing, matches public.tiers.
-- US / CA / HT: placeholder rows only. Prices are null on purpose -- fill
-- them from the admin panel (Phase 3) once the real Twilio SMS cost (US/CA)
-- and Meta WhatsApp cost (HT) are confirmed. Do not quote these to anyone
-- until then.

insert into public.markets (id, name, domain, language, currency, primary_channel, whatsapp_number)
values ('do', 'Dominican Republic', 'purpleoryn.com', 'es', 'DOP', 'whatsapp', '+18096034113');

insert into public.pricing_tiers (market_id, tier_key, tier_name, one_time_price, monthly_price, conversation_cap, overage_rate, recommended, sort_order)
values
  ('do', 'presencia',  'Presencia',  15499.99, 1499.99, 75,  18.00, false, 1),
  ('do', 'conversion', 'Conversión', 21999.99, 2199.99, 150, 16.00, true,  2),
  ('do', 'autoridad',  'Autoridad',  28999.99, 3499.99, 300, 14.00, false, 3);

insert into public.markets (id, name, domain, language, currency, primary_channel, whatsapp_number)
values
  ('us', 'United States', 'us.purpleoryn.com', 'en', 'USD', 'sms_webchat', '+18096034113'),
  ('ca', 'Canada',        'ca.purpleoryn.com', 'fr', 'CAD', 'sms_webchat', '+18096034113'),
  ('ht', 'Haiti',         'ht.purpleoryn.com', 'fr', 'USD', 'whatsapp',    '+18096034113');

insert into public.pricing_tiers (market_id, tier_key, tier_name, one_time_price, monthly_price, conversation_cap, overage_rate, sort_order)
values
  ('us', 'presencia',  'Presence',    null, null, 75,  null, 1),
  ('us', 'conversion',  'Conversion',  null, null, 150, null, 2),
  ('us', 'autoridad',  'Authority',   null, null, 300, null, 3),
  ('ca', 'presencia',  'Présence',    null, null, 75,  null, 1),
  ('ca', 'conversion',  'Conversion',  null, null, 150, null, 2),
  ('ca', 'autoridad',  'Autorité',    null, null, 300, null, 3),
  ('ht', 'presencia',  'Presence',    null, null, 75,  null, 1),
  ('ht', 'conversion',  'Conversion',  null, null, 150, null, 2),
  ('ht', 'autoridad',  'Autorité',    null, null, 300, null, 3);
