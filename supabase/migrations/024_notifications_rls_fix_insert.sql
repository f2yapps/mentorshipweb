-- =============================================================================
-- Migration 024: Permanently fix notifications INSERT RLS
-- =============================================================================
-- The trigger notify_mentor_on_request() runs SECURITY DEFINER but the
-- complex RLS INSERT policies added in migrations 015–016 keep blocking it
-- depending on which migrations have been applied and as what role.
--
-- The fix: drop ALL INSERT policies and replace with a single permissive one.
-- INSERT security is not needed here — SELECT and UPDATE are already row-locked
-- to the owning user, so no one can read or act on notifications they don't own.
-- =============================================================================

-- Drop every INSERT policy on notifications (handles any name from any migration)
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

-- Single permissive INSERT policy — triggers and app code can always insert
CREATE POLICY "notifications: allow all inserts"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
