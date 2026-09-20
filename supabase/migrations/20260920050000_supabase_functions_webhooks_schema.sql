-- Recreates the supabase_functions schema/trigger-helper that Database
-- Webhooks (Dashboard: Database -> Webhooks) depends on. This project is
-- missing it (normally provisioned by default on new Supabase projects) --
-- without it, "Create webhook" in the dashboard fails with:
--   ERROR: 3F000: schema "supabase_functions" does not exist
--
-- Matches Supabase's own standard supabase_functions.http_request() trigger
-- function (5 positional TG_ARGV: url, method, headers, params, timeout_ms),
-- built on pg_net's net.http_get/net.http_post (confirmed via
-- supabase.com/docs/guides/database/webhooks and .../extensions/pg_net).

create schema if not exists supabase_functions;
grant usage on schema supabase_functions to postgres, anon, authenticated, service_role;

create table if not exists supabase_functions.hooks (
  id bigserial primary key,
  hook_table_id integer not null,
  hook_name text not null,
  created_at timestamptz not null default now(),
  request_id bigint
);
comment on table supabase_functions.hooks is 'Supabase Functions Hooks: Audit trail for triggered hooks.';
create index if not exists supabase_functions_hooks_request_id_idx on supabase_functions.hooks using btree (request_id);
create index if not exists supabase_functions_hooks_h_table_id_h_name_idx on supabase_functions.hooks using btree (hook_table_id, hook_name);
grant all on supabase_functions.hooks to postgres, anon, authenticated, service_role;
grant usage, select on sequence supabase_functions.hooks_id_seq to postgres, anon, authenticated, service_role;

create or replace function supabase_functions.http_request()
returns trigger
language plpgsql
as $$
declare
  request_id bigint;
  payload jsonb;
  url text := TG_ARGV[0]::text;
  method text := TG_ARGV[1]::text;
  headers jsonb default '{}'::jsonb;
  params jsonb default '{}'::jsonb;
  timeout_ms integer default 1000;
begin
  if url is null or url = 'null' then
    raise exception 'url argument is missing';
  end if;
  if method is null or method = 'null' then
    raise exception 'method argument is missing';
  end if;

  if TG_ARGV[2] is null or TG_ARGV[2] = 'null' then
    headers = '{"Content-Type": "application/json"}'::jsonb;
  else
    headers = TG_ARGV[2]::jsonb;
  end if;

  if TG_ARGV[3] is null or TG_ARGV[3] = 'null' then
    params = '{}'::jsonb;
  else
    params = TG_ARGV[3]::jsonb;
  end if;

  if TG_ARGV[4] is null or TG_ARGV[4] = 'null' then
    timeout_ms = 1000;
  else
    timeout_ms = TG_ARGV[4]::integer;
  end if;

  case
    when method = 'GET' then
      select net.http_get(
        url := url,
        params := params,
        headers := headers,
        timeout_milliseconds := timeout_ms
      ) into request_id;
    when method = 'POST' then
      payload = jsonb_build_object(
        'old_record', OLD,
        'record', NEW,
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA
      );
      select net.http_post(
        url := url,
        body := payload,
        params := params,
        headers := headers,
        timeout_milliseconds := timeout_ms
      ) into request_id;
    else
      raise exception 'method argument % is invalid', method;
  end case;

  insert into supabase_functions.hooks (hook_table_id, hook_name, request_id)
  values (TG_RELID, TG_NAME, request_id);

  return coalesce(NEW, OLD);
end
$$;

grant execute on function supabase_functions.http_request() to postgres, anon, authenticated, service_role;
