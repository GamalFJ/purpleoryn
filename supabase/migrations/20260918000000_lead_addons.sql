-- Add-on modules chosen in the plan order form.
--
-- A snapshot, not a list of slugs: the order is binding, so it records the
-- name and prices the visitor agreed to at submission time, the same way
-- roi_snapshot records the plan prices. Each element:
--   { "slug": text, "name": text, "oneTime": number, "monthly": number }
--
-- Additive with a default, so the currently deployed code keeps inserting
-- leads unchanged. Apply this BEFORE deploying the code that writes it.
alter table public.leads
  add column addons jsonb not null default '[]'::jsonb
  check (jsonb_typeof(addons) = 'array' and jsonb_array_length(addons) <= 10);
