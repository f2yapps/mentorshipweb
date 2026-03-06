-- =============================================================================
-- Migration 015: Fix RLS on notifications so "accept" trigger can insert
-- =============================================================================
-- When a mentor accepts a request, the trigger notify_mentee_on_accept() inserts
-- a row into notifications with user_id = mentee. RLS runs as the mentor, so
-- a policy that only allows "user_id = auth.uid()" blocks this insert.
-- We add a policy that allows the mentor to insert an acceptance notification
-- for the mentee when the related_entity_id is a mentorship_request they mentor.
-- =============================================================================

-- Drop any existing insert policy that might be too restrictive
DROP POLICY IF EXISTS "notifications: insert for any" ON public.notifications;
DROP POLICY IF EXISTS "notifications: user insert own" ON public.notifications;

-- 1) Users can insert notifications for themselves (e.g. app creating notification for current user)
CREATE POLICY "notifications: user insert own"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 2) Mentor can insert "mentorship_accepted" notification for the mentee when accepting a request
--    (This allows the trigger that runs in the mentor's session to succeed.)
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

-- 3) Also allow "mentorship_request" type so notify_mentor_on_request trigger works
--    (Mentee creates request -> trigger inserts notification for mentor; session user is mentee.)
--    Here the row's user_id is the mentor, and the session user is the mentee.
CREATE POLICY "notifications: mentee insert request notification for mentor"
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
