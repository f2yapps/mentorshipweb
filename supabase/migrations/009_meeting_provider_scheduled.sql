-- Add meeting_provider and meeting_scheduled_at to mentorship_requests (008 added meeting_link)
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_provider TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS meeting_scheduled_at TIMESTAMPTZ;
