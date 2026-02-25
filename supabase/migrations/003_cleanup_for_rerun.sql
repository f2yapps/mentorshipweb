-- =============================================================================
-- CLEANUP MIGRATION
-- This script safely drops all policies and triggers that might exist
-- Run this before running 004_comprehensive_schema.sql
-- =============================================================================

-- Drop all policies
DROP POLICY IF EXISTS "Users can view own education" ON public.education;
DROP POLICY IF EXISTS "Users can insert own education" ON public.education;
DROP POLICY IF EXISTS "Users can update own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete own education" ON public.education;
DROP POLICY IF EXISTS "Public can view education of mentors" ON public.education;

DROP POLICY IF EXISTS "Users can view own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can insert own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can update own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can delete own experience" ON public.experience;
DROP POLICY IF EXISTS "Public can view experience of mentors" ON public.experience;

DROP POLICY IF EXISTS "Users can manage own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public can view certifications" ON public.certifications;

DROP POLICY IF EXISTS "Users can manage own external links" ON public.external_links;
DROP POLICY IF EXISTS "Public can view external links" ON public.external_links;

DROP POLICY IF EXISTS "Mentors can manage own availability" ON public.availability_slots;
DROP POLICY IF EXISTS "Public can view availability" ON public.availability_slots;

DROP POLICY IF EXISTS "Participants can view sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Participants can create sessions" ON public.mentorship_sessions;
DROP POLICY IF EXISTS "Participants can update sessions" ON public.mentorship_sessions;

DROP POLICY IF EXISTS "Participants can manage milestones" ON public.mentorship_milestones;

DROP POLICY IF EXISTS "Participants can view outcomes" ON public.mentorship_outcomes;
DROP POLICY IF EXISTS "Participants can create outcomes" ON public.mentorship_outcomes;

DROP POLICY IF EXISTS "Users can manage own publications" ON public.publications;
DROP POLICY IF EXISTS "Public can view published publications" ON public.publications;

DROP POLICY IF EXISTS "Users can manage own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Public can view published stories" ON public.success_stories;

DROP POLICY IF EXISTS "Users can manage own media" ON public.media_posts;
DROP POLICY IF EXISTS "Public can view published media" ON public.media_posts;

DROP POLICY IF EXISTS "Users can manage own resources" ON public.resources;
DROP POLICY IF EXISTS "Public can view public resources" ON public.resources;

DROP POLICY IF EXISTS "Public can view public activities" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can create activities" ON public.activity_feed;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Drop all triggers
DROP TRIGGER IF EXISTS education_updated_at ON public.education;
DROP TRIGGER IF EXISTS experience_updated_at ON public.experience;
DROP TRIGGER IF EXISTS certifications_updated_at ON public.certifications;
DROP TRIGGER IF EXISTS external_links_updated_at ON public.external_links;
DROP TRIGGER IF EXISTS availability_slots_updated_at ON public.availability_slots;
DROP TRIGGER IF EXISTS mentorship_sessions_updated_at ON public.mentorship_sessions;
DROP TRIGGER IF EXISTS mentorship_milestones_updated_at ON public.mentorship_milestones;
DROP TRIGGER IF EXISTS mentorship_outcomes_updated_at ON public.mentorship_outcomes;
DROP TRIGGER IF EXISTS publications_updated_at ON public.publications;
DROP TRIGGER IF EXISTS success_stories_updated_at ON public.success_stories;
DROP TRIGGER IF EXISTS media_posts_updated_at ON public.media_posts;
DROP TRIGGER IF EXISTS resources_updated_at ON public.resources;
DROP TRIGGER IF EXISTS mentorship_accepted_trigger ON public.mentorship_requests;
DROP TRIGGER IF EXISTS publication_created_trigger ON public.publications;
DROP TRIGGER IF EXISTS success_story_created_trigger ON public.success_stories;
