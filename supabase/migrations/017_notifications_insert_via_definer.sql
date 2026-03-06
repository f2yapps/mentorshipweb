-- =============================================================================
-- Migration 017: Ensure accept notification insert bypasses RLS
-- =============================================================================
-- The trigger runs in the mentor's session; RLS checks auth.uid() which can
-- block the insert for the mentee's notification. This helper runs as the
-- function owner (postgres), which bypasses RLS, so the mentee reliably
-- receives the "accepted" notification.
-- =============================================================================

-- Helper: insert a single "mentorship_accepted" notification (runs as definer, bypasses RLS)
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
END;
$$;

-- Trigger: call the helper instead of inserting directly
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger itself is unchanged
DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();
