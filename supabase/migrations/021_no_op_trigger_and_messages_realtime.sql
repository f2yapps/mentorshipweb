-- =============================================================================
-- Migration 021: Definitive RLS fix + ensure messages realtime is enabled
-- =============================================================================
-- The accept/decline notification is now handled by the server action
-- (app/actions/mentorship.ts → updateMentorshipStatus). The trigger is
-- replaced with a pure no-op so it never touches notifications and can
-- NEVER cause an RLS error that blocks the status update.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
BEGIN
  -- Notification is handled by the server action (updateMentorshipStatus).
  -- This trigger is intentionally a no-op to prevent RLS conflicts.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();

-- Ensure messages table is in realtime publication (safe to run again)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- already added
  END;
END $$;
