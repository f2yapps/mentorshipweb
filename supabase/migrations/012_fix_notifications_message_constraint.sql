-- Fix: make message column nullable (it was created with NOT NULL in some environments)
-- and ensure it exists in all environments
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;

DO $$ BEGIN
  ALTER TABLE public.notifications ALTER COLUMN message DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Also ensure body column exists (in case migration 011 wasn't run)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS related_entity_type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS related_entity_id UUID;

-- Update notify_mentor_on_request trigger to include message field
CREATE OR REPLACE FUNCTION public.notify_mentor_on_request()
RETURNS TRIGGER AS $$
DECLARE
  mentor_user_id UUID;
  mentee_name TEXT;
  notif_msg TEXT;
BEGIN
  SELECT m.user_id INTO mentor_user_id FROM public.mentors m WHERE m.id = NEW.mentor_id;
  SELECT u.name INTO mentee_name FROM public.users u
    JOIN public.mentees me ON me.user_id = u.id WHERE me.id = NEW.mentee_id;
  notif_msg := COALESCE(mentee_name, 'A mentee') || ' sent you a mentorship request in ' || COALESCE(NEW.category, 'a category') || '.';
  INSERT INTO public.notifications (user_id, type, title, message, body, related_entity_type, related_entity_id)
  VALUES (
    mentor_user_id,
    'mentorship_request',
    'New mentorship request',
    notif_msg,
    notif_msg,
    'mentorship_request',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update notify_mentee_on_accept trigger to include message field
CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  mentee_user_id UUID;
  mentor_name TEXT;
  notif_msg TEXT;
BEGIN
  IF OLD.status = NEW.status OR NEW.status != 'accepted' THEN
    RETURN NEW;
  END IF;
  SELECT me.user_id INTO mentee_user_id FROM public.mentees me WHERE me.id = NEW.mentee_id;
  SELECT u.name INTO mentor_name FROM public.users u
    JOIN public.mentors m ON m.user_id = u.id WHERE m.id = NEW.mentor_id;
  notif_msg := COALESCE(mentor_name, 'A mentor') || ' accepted your mentorship request. Check your dashboard for meeting details.';
  INSERT INTO public.notifications (user_id, type, title, message, body, related_entity_type, related_entity_id)
  VALUES (
    mentee_user_id,
    'mentorship_accepted',
    'Your mentorship request was accepted!',
    notif_msg,
    notif_msg,
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
