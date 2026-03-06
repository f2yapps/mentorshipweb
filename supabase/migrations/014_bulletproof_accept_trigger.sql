-- ── Migration 014: Make notify_mentee_on_accept bulletproof ──────────────────
-- Wrap the entire trigger body in EXCEPTION WHEN OTHERS THEN NULL so that
-- ANY failure in the notification insert (missing column, NULL value, RLS, etc.)
-- is silently swallowed and the mentorship_requests UPDATE always succeeds.

CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  mentee_user_id UUID;
  mentor_name    TEXT;
  notif_msg      TEXT;
BEGIN
  -- Only fire when status transitions to 'accepted'
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

    INSERT INTO public.notifications
      (user_id, type, title, message, body, related_entity_type, related_entity_id)
    VALUES (
      mentee_user_id,
      'mentorship_accepted',
      'Your mentorship request was accepted!',
      notif_msg,
      notif_msg,
      'mentorship_request',
      NEW.id
    );

  EXCEPTION WHEN OTHERS THEN
    -- Swallow any notification error so the UPDATE never rolls back
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();
