-- =============================================================================
-- Migration 016: Fix notifications RLS — drop ALL insert policies then recreate
-- =============================================================================
-- Run this in Supabase SQL Editor if accept still fails with RLS on notifications.
-- This drops every INSERT policy on notifications (no matter the name), then
-- creates the two we need so the trigger can insert when mentor accepts.
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

-- 1) Users can insert notifications for themselves
CREATE POLICY "notifications: user insert own"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 2) Mentor can insert "mentorship_accepted" for the mentee (trigger runs in mentor session)
CREATE POLICY "notifications: mentor insert accept for mentee"
  ON public.notifications FOR INSERT
  WITH CHECK (
    type = 'mentorship_accepted'
    AND related_entity_type = 'mentorship_request'
    AND related_entity_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      INNER JOIN public.mentors m ON m.id = mr.mentor_id AND m.user_id = auth.uid()
      WHERE mr.id = related_entity_id
    )
  );

-- 3) Mentee can insert "mentorship_request" notification for mentor (when creating request)
CREATE POLICY "notifications: mentee insert request for mentor"
  ON public.notifications FOR INSERT
  WITH CHECK (
    type = 'mentorship_request'
    AND related_entity_type = 'mentorship_request'
    AND related_entity_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      INNER JOIN public.mentees me ON me.id = mr.mentee_id AND me.user_id = auth.uid()
      WHERE mr.id = related_entity_id
    )
  );
