-- =============================================================================
-- Run this in Supabase SQL Editor if you have not applied migrations 008 and 009.
-- Idempotent: safe to run multiple times (IF NOT EXISTS / IF NOT EXISTS).
-- =============================================================================

-- 1) NOTIFICATIONS TABLE
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
DROP POLICY IF EXISTS "notifications: user read own" ON public.notifications;
CREATE POLICY "notifications: user read own" ON public.notifications FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "notifications: user update own" ON public.notifications;
CREATE POLICY "notifications: user update own" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
DROP POLICY IF EXISTS "notifications: insert for any" ON public.notifications;
CREATE POLICY "notifications: insert for any" ON public.notifications FOR INSERT WITH CHECK (true);

-- 2) MENTOR INTEREST TABLE
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
DROP POLICY IF EXISTS "mentor_interests: mentor insert own" ON public.mentor_interests;
CREATE POLICY "mentor_interests: mentor insert own" ON public.mentor_interests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "mentor_interests: participants read" ON public.mentor_interests;
CREATE POLICY "mentor_interests: participants read" ON public.mentor_interests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "mentor_interests: mentee update status" ON public.mentor_interests;
CREATE POLICY "mentor_interests: mentee update status" ON public.mentor_interests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
);

-- 3) MEETING FIELDS ON MENTORSHIP_REQUESTS
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_provider TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_scheduled_at TIMESTAMPTZ;
