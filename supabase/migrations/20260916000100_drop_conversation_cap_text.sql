-- Apply AFTER the code that reads conversations_included /
-- conversation_overage is deployed. The free-text cap is now derived from
-- those two columns.
alter table public.tiers drop column conversation_cap;
