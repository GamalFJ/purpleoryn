-- Database Webhooks (Dashboard: Database -> Webhooks) requires pg_net.
-- Without it, the Webhooks section doesn't show up in the Dashboard at all.
-- Needed for Phase 4 (Telegram alerts on market_leads/orders inserts).
create extension if not exists pg_net with schema extensions;
