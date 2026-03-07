-- Migration 026: Drop notification triggers that conflict with RLS
-- The server action (app/actions/mentorship.ts) now inserts notifications
-- using the service role key, bypassing RLS entirely. The DB triggers are
-- redundant and cause RLS rollbacks. Drop them.

DROP TRIGGER IF EXISTS on_mentorship_request_created ON public.mentorship_requests;
DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
