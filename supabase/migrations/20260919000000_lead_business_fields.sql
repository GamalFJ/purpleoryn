-- Two fields the order form collects that weren't captured before:
--   business_niche: what industry the order is from, free text with an
--     on-page autocomplete list of common categories, not a fixed enum, so a
--     niche the list doesn't cover is never rejected.
--   social_handle: Instagram or another social profile, optional. Stored raw
--     (handle or full URL) and linkified by the admin panel, not here.
--
-- Both nullable at the database level, same pattern as `plan`: required or
-- optional is an application-level (zod) decision, not a DB constraint, so
-- existing leads need no backfill.
alter table public.leads
  add column business_niche text check (business_niche is null or char_length(business_niche) <= 120),
  add column social_handle text check (social_handle is null or char_length(social_handle) <= 200);
