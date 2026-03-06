-- =============================================================================
-- Migration 020: Two fixes in one
--   1) Wrap notify_mentee_on_accept trigger in exception handling so it NEVER
--      blocks the status update (belt + suspenders — works even if 017 wasn't run)
--   2) Ensure current_position and organization columns exist on users table
--      (safe to run even if migration 004 already added them)
-- =============================================================================

-- ── 1. Ensure columns exist ──────────────────────────────────────────────────
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_position TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS organization      TEXT;

-- ── 2. Recreate the SECURITY DEFINER helper (idempotent) ────────────────────
CREATE OR REPLACE FUNCTION public.notifications_insert_accept(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_related_entity_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications
    (user_id, type, title, message, body, related_entity_type, related_entity_id)
  VALUES (
    p_user_id,
    'mentorship_accepted',
    p_title,
    p_message,
    p_message,
    'mentorship_request',
    p_related_entity_id
  );
EXCEPTION WHEN OTHERS THEN
  NULL; -- if the helper itself fails, swallow silently
END;
$$;

-- ── 3. Replace trigger function — wrap ALL logic in exception handler ────────
--    This guarantees the mentorship_requests UPDATE never rolls back due to
--    a notification failure, regardless of RLS state.
CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  mentee_user_id UUID;
  mentor_name    TEXT;
  notif_msg      TEXT;
BEGIN
  IF OLD.status = NEW.status OR NEW.status != 'accepted' THEN
    RETURN NEW;
  END IF;

  BEGIN
    SELECT me.user_id INTO mentee_user_id
      FROM public.mentees me WHERE me.id = NEW.mentee_id;

    IF mentee_user_id IS NULL THEN
      RETURN NEW;
    END IF;

    SELECT u.name INTO mentor_name
      FROM public.users u
      JOIN public.mentors m ON m.user_id = u.id
      WHERE m.id = NEW.mentor_id;

    notif_msg := COALESCE(mentor_name, 'A mentor')
      || ' accepted your mentorship request. Check your dashboard to schedule a meeting.';

    PERFORM public.notifications_insert_accept(
      mentee_user_id,
      'Your mentorship request was accepted!',
      notif_msg,
      NEW.id
    );
  EXCEPTION WHEN OTHERS THEN
    NULL; -- notification failure must never block the accept
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-attach trigger (idempotent)
DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();
