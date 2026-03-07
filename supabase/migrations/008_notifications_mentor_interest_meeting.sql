
- Notifications: in-app notifications linked to user_id
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMPTZ,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: user read own"
  ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications: user update own"
  ON public.notifications FOR UPDATE USING (user_id = auth.uid());
-- Allow insert for own user_id (e.g. from API) and for trigger
CREATE POLICY "notifications: insert for any"
  ON public.notifications FOR INSERT WITH CHECK (true);

-- Mentor interest: mentor expresses interest in mentoring a mentee
CREATE TABLE IF NOT EXISTS public.mentor_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

CREATE INDEX IF NOT EXISTS idx_mentor_interests_mentee ON public.mentor_interests(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentor_interests_mentor ON public.mentor_interests(mentor_id);

ALTER TABLE public.mentor_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentor_interests: mentor insert own"
  ON public.mentor_interests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );
CREATE POLICY "mentor_interests: participants read"
  ON public.mentor_interests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );
CREATE POLICY "mentor_interests: mentee update status"
  ON public.mentor_interests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

-- Auto-update updated_at for mentor_interests (function may exist from earlier migration)
DROP TRIGGER IF EXISTS mentor_interests_updated_at ON public.mentor_interests;
CREATE TRIGGER mentor_interests_updated_at
  BEFORE UPDATE ON public.mentor_interests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Meeting link on mentorship request (Zoom/Meet URL)
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_link TEXT;

-- Notify mentor when a new mentorship request is created
CREATE OR REPLACE FUNCTION public.notify_mentor_on_request()
RETURNS TRIGGER AS $$
DECLARE
  mentor_user_id UUID;
  mentee_name TEXT;
BEGIN
  SELECT m.user_id INTO mentor_user_id FROM public.mentors m WHERE m.id = NEW.mentor_id;
  SELECT u.name INTO mentee_name FROM public.users u
    JOIN public.mentees me ON me.user_id = u.id WHERE me.id = NEW.mentee_id;
  INSERT INTO public.notifications (user_id, type, title, body, related_entity_type, related_entity_id)
  VALUES (
    mentor_user_id,
    'mentorship_request',
    'New mentorship request',
    COALESCE(mentee_name, 'A mentee') || ' sent you a mentorship request.',
    'mentorship_request',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_mentorship_request_created ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_created
  AFTER INSERT ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentor_on_request();
