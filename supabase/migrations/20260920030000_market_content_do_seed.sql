-- Seeds market_content for 'do' with the copy currently live on the
-- homepage (site_settings.hero_headline/hero_subheadline are empty, so
-- DEFAULT_SETTINGS in lib/content.ts is what actually renders today).
-- Without this, wiring the homepage to getCurrentMarket() would blank the
-- live hero for the DO market.

insert into public.market_content (market_id, section_key, content)
values
  ('do', 'hero_headline', 'Sitios web, SEO y agentes de IA para negocios en Santo Domingo'),
  ('do', 'hero_subheadline', 'Tres planes con precio fijo para que tu negocio aparezca en Google y reciba clientes por WhatsApp.');
