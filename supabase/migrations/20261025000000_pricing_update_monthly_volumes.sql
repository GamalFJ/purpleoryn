-- Monthly prices and included volumes raised; Agente de Voz IA description and usage updated.
-- One-time prices and extra-conversation prices are unchanged.

update public.tiers set monthly_price = 4499.99, conversations_included = 150 where slug = 'presencia';
update public.tiers set monthly_price = 8499.99, conversations_included = 300 where slug = 'conversion';
update public.tiers set monthly_price = 13499.99, conversations_included = 600 where slug = 'autoridad';

update public.addons set
  monthly_price = 5999.99, included_units = 300, overage_rate = 25.00,
  description = 'Un agente de IA que contesta, con voz natural y las 24 horas, las llamadas que sus clientes hacen al WhatsApp de su negocio.'
where slug = 'agente-de-voz';

update public.pricing_tiers set monthly_price = 4499.99, conversation_cap = 150 where market_id = 'do' and tier_key = 'presencia';
update public.pricing_tiers set monthly_price = 8499.99, conversation_cap = 300 where market_id = 'do' and tier_key = 'conversion';
update public.pricing_tiers set monthly_price = 13499.99, conversation_cap = 600 where market_id = 'do' and tier_key = 'autoridad';
