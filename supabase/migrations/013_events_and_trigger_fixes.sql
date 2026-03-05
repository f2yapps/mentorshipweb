-- ── 1. Fix duplicate notifications ───────────────────────────────────────────
-- The DB trigger notify_mentor_on_request AND the code in mentorship.ts both
-- create a notification. Drop the trigger so only the code fires.
DROP TRIGGER IF EXISTS on_mentorship_request_created ON public.mentorship_requests;

-- ── 2. Fix notify_mentee_on_accept: add NULL guard ────────────────────────────
-- Without the guard, a NULL mentee_user_id causes an INSERT failure which
-- rolls back the entire UPDATE (causing "Action failed" in the UI).
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

  SELECT me.user_id INTO mentee_user_id
    FROM public.mentees me WHERE me.id = NEW.mentee_id;

  -- Guard: if mentee record not found, skip notification
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-attach trigger (in case it was dropped earlier)
DROP TRIGGER IF EXISTS on_mentorship_request_accepted ON public.mentorship_requests;
CREATE TRIGGER on_mentorship_request_accepted
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_mentee_on_accept();

-- ── 3. Workshop / Events tables ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  description      TEXT,
  event_type       TEXT        NOT NULL DEFAULT 'workshop',
    -- workshop | webinar | meetup | conference | seminar
  event_date       DATE        NOT NULL,
  event_time       TIME        NOT NULL,
  timezone         TEXT        NOT NULL DEFAULT 'UTC',
  duration_minutes INT         DEFAULT 60,
  location         TEXT,          -- physical address (null = online only)
  is_online        BOOLEAN     NOT NULL DEFAULT TRUE,
  zoom_link        TEXT,
  google_meet_link TEXT,
  language         TEXT        DEFAULT 'English',
  max_attendees    INT,
  tags             TEXT[],
  host_id          UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_published     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID        NOT NULL REFERENCES public.workshop_events(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.users(id)           ON DELETE CASCADE,
  status     TEXT        NOT NULL DEFAULT 'attending',  -- attending | interested
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- RLS
ALTER TABLE public.workshop_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events: public read"   ON public.workshop_events;
DROP POLICY IF EXISTS "events: host insert"   ON public.workshop_events;
DROP POLICY IF EXISTS "events: host update"   ON public.workshop_events;
DROP POLICY IF EXISTS "events: host delete"   ON public.workshop_events;

CREATE POLICY "events: public read"
  ON public.workshop_events FOR SELECT
  USING (is_published = TRUE OR host_id = auth.uid());

CREATE POLICY "events: host insert"
  ON public.workshop_events FOR INSERT
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "events: host update"
  ON public.workshop_events FOR UPDATE
  USING (host_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "events: host delete"
  ON public.workshop_events FOR DELETE
  USING (host_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rsvps: public read"  ON public.event_rsvps;
DROP POLICY IF EXISTS "rsvps: user insert"  ON public.event_rsvps;
DROP POLICY IF EXISTS "rsvps: user update"  ON public.event_rsvps;
DROP POLICY IF EXISTS "rsvps: user delete"  ON public.event_rsvps;

CREATE POLICY "rsvps: public read"  ON public.event_rsvps FOR SELECT USING (TRUE);
CREATE POLICY "rsvps: user insert"  ON public.event_rsvps FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "rsvps: user update"  ON public.event_rsvps FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "rsvps: user delete"  ON public.event_rsvps FOR DELETE USING (user_id = auth.uid());
