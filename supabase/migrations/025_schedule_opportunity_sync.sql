-- Migration 025: Schedule daily opportunity sync via pg_cron
-- Requires: pg_cron extension enabled in Supabase (Dashboard → Database → Extensions → pg_cron)
-- Also requires: sync-opportunities Edge Function deployed
--
-- Replace YOUR_PROJECT_REF and YOUR_ANON_KEY with your actual Supabase values.
-- Find them: Supabase Dashboard → Settings → API

-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the edge function to run every day at 06:00 UTC
-- Adjust the URL and key before running.
SELECT cron.schedule(
  'sync-opportunities-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url    := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-opportunities',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb,
    body   := '{}'::jsonb
  );
  $$
);
