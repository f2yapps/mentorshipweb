-- Add missing columns to notifications table (if migration 008 was partially applied)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS related_entity_type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS related_entity_id UUID;

-- Add last_active_at to users (from migration 010, safe to re-run)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON public.users(last_active_at);

-- Notify mentee when mentor accepts their request (from migration 010, safe to re-run)
CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  mentee_user_id UUID;
  mentor_name TEXT;
BEGIN
  IF OLD.status = NEW.status OR NEW.status != 'accepted' THEN
    RETURN NEW;
  END IF;
  SELECT me.user_id INTO mentee_user_id FROM public.mentees me WHERE me.id = NEW.mentee_id;
  SELECT u.name INTO mentor_name FROM public.users u
    JOIN public.mentors m ON m.user_id = u.id WHERE m.id = NEW.mentor_id;
  INSERT INTO public.notifications (user_id, type, title, body, related_entity_type, related_entity_id)
  VALUES (
    mentee_user_id,
    'mentorship_accepted',
    'Your mentorship request was accepted!',
    COALESCE(mentor_name, 'A mentor') || ' accepted your mentorship request. Check your dashboard for meeting details.',
    'mentorship_request',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();
