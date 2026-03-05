-- ============================================================
-- Migration 010: Active tracking + request-accepted notification
-- ============================================================

-- 1. Add last_active_at to users for tracking real logins
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- 2. Index for querying active users efficiently
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON public.users(last_active_at);

-- 3. Function + trigger: update last_active_at whenever a user row is selected/touched
--    (We update it from the app via a lightweight upsert on login)

-- 4. Notify mentee when mentor accepts their request
CREATE OR REPLACE FUNCTION public.notify_mentee_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  mentee_user_id UUID;
  mentor_name TEXT;
BEGIN
  -- Only fire on status change to 'accepted'
  IF OLD.status = NEW.status OR NEW.status != 'accepted' THEN
    RETURN NEW;
  END IF;

  SELECT me.user_id INTO mentee_user_id
    FROM public.mentees me WHERE me.id = NEW.mentee_id;

  SELECT u.name INTO mentor_name
    FROM public.users u
    JOIN public.mentors m ON m.user_id = u.id
    WHERE m.id = NEW.mentor_id;

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

-- 5. Ensure mentees can read mentor rows (fix potential 404 from RLS blocking the query)
--    Add a policy if it does not exist (wrapped in DO block to be idempotent)
DO $$
BEGIN
  -- Allow any authenticated user to read mentor profiles (needed for /mentors/[id]/request page)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mentors'
      AND policyname = 'mentors: authenticated read'
  ) THEN
    EXECUTE '
      CREATE POLICY "mentors: authenticated read"
        ON public.mentors FOR SELECT
        USING (auth.uid() IS NOT NULL)
    ';
  END IF;

  -- Allow unauthenticated users to read verified mentor profiles (for public directory)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mentors'
      AND policyname = 'mentors: public read verified'
  ) THEN
    EXECUTE '
      CREATE POLICY "mentors: public read verified"
        ON public.mentors FOR SELECT
        USING (verified = true)
    ';
  END IF;
END $$;
