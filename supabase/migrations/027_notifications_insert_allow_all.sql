-- =============================================================================
-- Migration 027: Ensure notifications INSERT always allowed (fix RLS on accept/create)
-- =============================================================================
-- Error: "new row violates row-level security policy for table notifications"
-- with title "New mentorship request" can happen when:
--   - Mentee creates a request -> trigger or app inserts notification for mentor
--   - Mentor accepts -> app/trigger inserts notification for mentee
-- Session may not be service_role, so RLS can block. Fix: single permissive
-- INSERT policy. SELECT/UPDATE remain restricted to owning user.
-- =============================================================================

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications' AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "notifications_insert_allow_all"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
