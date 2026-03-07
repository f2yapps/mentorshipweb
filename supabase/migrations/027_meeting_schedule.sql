-- Migration 027: Add meeting scheduling fields to mentorship_requests
ALTER TABLE public.mentorship_requests
  ADD COLUMN IF NOT EXISTS scheduled_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_platform TEXT; -- 'zoom' | 'google_meet' | 'jitsi' | 'teams' | 'other'
