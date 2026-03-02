-- =============================================================================
-- COMPREHENSIVE RLS FIX
-- Run this in Supabase Dashboard → SQL Editor
-- Safe to re-run multiple times (uses DROP IF EXISTS everywhere)
-- Fixes:
--   1. Storage bucket policies (profile-images, media buckets)
--   2. Table INSERT policies (uses explicit WITH CHECK instead of FOR ALL USING)
-- =============================================================================

-- =============================================================================
-- PART 1: STORAGE BUCKET POLICIES
-- =============================================================================

-- ── profile-images ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
CREATE POLICY "Anyone can view profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;
CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;
CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── media ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view media" ON storage.objects;
CREATE POLICY "Anyone can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
CREATE POLICY "Users can update own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── publications ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view publications" ON storage.objects;
CREATE POLICY "Anyone can view publications"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'publications');

DROP POLICY IF EXISTS "Authenticated users can upload publications" ON storage.objects;
CREATE POLICY "Authenticated users can upload publications"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own publications" ON storage.objects;
CREATE POLICY "Users can update own publications"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own publications" ON storage.objects;
CREATE POLICY "Users can delete own publications"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── resources ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can view public resources" ON storage.objects;
CREATE POLICY "Anyone can view public resources"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

DROP POLICY IF EXISTS "Authenticated users can upload resources" ON storage.objects;
CREATE POLICY "Authenticated users can upload resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own resources" ON storage.objects;
CREATE POLICY "Users can update own resources"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own resources" ON storage.objects;
CREATE POLICY "Users can delete own resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- PART 2: TABLE INSERT POLICIES (replace FOR ALL USING with explicit WITH CHECK)
-- =============================================================================

-- ── education ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own education" ON public.education;
DROP POLICY IF EXISTS "Users can view own education" ON public.education;
DROP POLICY IF EXISTS "Users can insert own education" ON public.education;
DROP POLICY IF EXISTS "Users can update own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete own education" ON public.education;
DROP POLICY IF EXISTS "Public can view education" ON public.education;
DROP POLICY IF EXISTS "Public can view education of mentors" ON public.education;

CREATE POLICY "Public can view education" ON public.education
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own education" ON public.education
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (user_id = auth.uid());

-- ── experience ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can view own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can insert own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can update own experience" ON public.experience;
DROP POLICY IF EXISTS "Users can delete own experience" ON public.experience;
DROP POLICY IF EXISTS "Public can view experience" ON public.experience;
DROP POLICY IF EXISTS "Public can view experience of mentors" ON public.experience;

CREATE POLICY "Public can view experience" ON public.experience
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own experience" ON public.experience
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own experience" ON public.experience
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own experience" ON public.experience
  FOR DELETE USING (user_id = auth.uid());

-- ── certifications ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can select own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can insert own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can update own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can delete own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public can view certifications" ON public.certifications;

CREATE POLICY "Public can view certifications" ON public.certifications
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own certifications" ON public.certifications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own certifications" ON public.certifications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own certifications" ON public.certifications
  FOR DELETE USING (user_id = auth.uid());

-- ── external_links ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own external links" ON public.external_links;
DROP POLICY IF EXISTS "Users can select own external links" ON public.external_links;
DROP POLICY IF EXISTS "Users can insert own external links" ON public.external_links;
DROP POLICY IF EXISTS "Users can update own external links" ON public.external_links;
DROP POLICY IF EXISTS "Users can delete own external links" ON public.external_links;
DROP POLICY IF EXISTS "Public can view external links" ON public.external_links;

CREATE POLICY "Public can view external links" ON public.external_links
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own external links" ON public.external_links
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own external links" ON public.external_links
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own external links" ON public.external_links
  FOR DELETE USING (user_id = auth.uid());

-- ── media_posts ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own media" ON public.media_posts;
DROP POLICY IF EXISTS "Users can select own media" ON public.media_posts;
DROP POLICY IF EXISTS "Users can insert own media" ON public.media_posts;
DROP POLICY IF EXISTS "Users can update own media" ON public.media_posts;
DROP POLICY IF EXISTS "Users can delete own media" ON public.media_posts;
DROP POLICY IF EXISTS "Public can view published media" ON public.media_posts;

CREATE POLICY "Public can view published media" ON public.media_posts
  FOR SELECT USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "Users can insert own media" ON public.media_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own media" ON public.media_posts
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own media" ON public.media_posts
  FOR DELETE USING (user_id = auth.uid());

-- ── mentees ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Mentees can manage own row" ON public.mentees;
DROP POLICY IF EXISTS "Mentees can view own row" ON public.mentees;
DROP POLICY IF EXISTS "Mentees can insert own row" ON public.mentees;
DROP POLICY IF EXISTS "Mentees can update own row" ON public.mentees;

CREATE POLICY "Mentees can insert own row" ON public.mentees
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Mentees can view own row" ON public.mentees
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Mentees can update own row" ON public.mentees
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ── publications ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own publications" ON public.publications;
DROP POLICY IF EXISTS "Users can select own publications" ON public.publications;
DROP POLICY IF EXISTS "Users can insert own publications" ON public.publications;
DROP POLICY IF EXISTS "Users can update own publications" ON public.publications;
DROP POLICY IF EXISTS "Users can delete own publications" ON public.publications;
DROP POLICY IF EXISTS "Public can view published publications" ON public.publications;

CREATE POLICY "Public can view published publications" ON public.publications
  FOR SELECT USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "Users can insert own publications" ON public.publications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own publications" ON public.publications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own publications" ON public.publications
  FOR DELETE USING (user_id = auth.uid());

-- ── success_stories ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Users can select own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Users can insert own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Users can update own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Users can delete own stories" ON public.success_stories;
DROP POLICY IF EXISTS "Public can view published stories" ON public.success_stories;

CREATE POLICY "Public can view published stories" ON public.success_stories
  FOR SELECT USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "Users can insert own stories" ON public.success_stories
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own stories" ON public.success_stories
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own stories" ON public.success_stories
  FOR DELETE USING (user_id = auth.uid());

-- ── resources ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can select own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can insert own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;
DROP POLICY IF EXISTS "Public can view public resources" ON public.resources;

CREATE POLICY "Public can view public resources" ON public.resources
  FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users can insert own resources" ON public.resources
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own resources" ON public.resources
  FOR DELETE USING (user_id = auth.uid());

SELECT 'RLS policies fixed ✅' AS status;
