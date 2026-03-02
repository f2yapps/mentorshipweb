-- =============================================================================
-- DEFINITIVE COMPLETE RLS FIX  (migration 007)
-- Run this ONE file in: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run multiple times (DROP IF EXISTS everywhere).
--
-- Covers EVERY table + all 4 storage buckets.
-- Supersedes migrations 005 and 006 — run only this one.
-- =============================================================================


-- =============================================================================
-- PART 1: STORAGE BUCKETS
-- Ensure all 4 buckets exist and are public
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('profile-images', 'profile-images', true),
  ('media',          'media',          true),
  ('publications',   'publications',   true),
  ('resources',      'resources',      true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;


-- =============================================================================
-- PART 2: STORAGE OBJECT RLS POLICIES
-- Drop ALL existing storage.objects policies first, then recreate clean.
-- =============================================================================

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- ── profile-images ────────────────────────────────────────────────────────────
CREATE POLICY "profile-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "profile-images: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "profile-images: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "profile-images: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── media ─────────────────────────────────────────────────────────────────────
CREATE POLICY "media: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "media: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "media: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── publications ──────────────────────────────────────────────────────────────
CREATE POLICY "publications: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'publications');

CREATE POLICY "publications: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "publications: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "publications: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'publications'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── resources ─────────────────────────────────────────────────────────────────
CREATE POLICY "resources: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

CREATE POLICY "resources: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "resources: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "resources: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


-- =============================================================================
-- PART 3: TABLE RLS POLICIES
-- Drop then recreate for each table — explicit WITH CHECK on every INSERT.
-- =============================================================================

-- ── users ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"       ON public.users;
DROP POLICY IF EXISTS "Public can view user profiles"    ON public.users;
DROP POLICY IF EXISTS "Users can update own profile"     ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile"     ON public.users;

-- Anyone can read profiles (needed for mentor directory, etc.)
CREATE POLICY "users: public read"
  ON public.users FOR SELECT USING (true);

-- Users can only insert their own row (id must match auth.uid())
-- Note: handle_new_user() trigger (SECURITY DEFINER) handles signup creation;
-- this policy covers manual recovery inserts from the client.
CREATE POLICY "users: self insert"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Users can update only their own row
CREATE POLICY "users: self update"
  ON public.users FOR UPDATE
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ── education ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own education"         ON public.education;
DROP POLICY IF EXISTS "Public can view education"              ON public.education;
DROP POLICY IF EXISTS "Public can view education of mentors"   ON public.education;
DROP POLICY IF EXISTS "Users can view own education"           ON public.education;
DROP POLICY IF EXISTS "Users can insert own education"         ON public.education;
DROP POLICY IF EXISTS "Users can update own education"         ON public.education;
DROP POLICY IF EXISTS "Users can delete own education"         ON public.education;

CREATE POLICY "education: public read"
  ON public.education FOR SELECT USING (true);
CREATE POLICY "education: owner insert"
  ON public.education FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "education: owner update"
  ON public.education FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "education: owner delete"
  ON public.education FOR DELETE USING (user_id = auth.uid());


-- ── experience ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own experience"        ON public.experience;
DROP POLICY IF EXISTS "Public can view experience"             ON public.experience;
DROP POLICY IF EXISTS "Public can view experience of mentors"  ON public.experience;
DROP POLICY IF EXISTS "Users can view own experience"          ON public.experience;
DROP POLICY IF EXISTS "Users can insert own experience"        ON public.experience;
DROP POLICY IF EXISTS "Users can update own experience"        ON public.experience;
DROP POLICY IF EXISTS "Users can delete own experience"        ON public.experience;

CREATE POLICY "experience: public read"
  ON public.experience FOR SELECT USING (true);
CREATE POLICY "experience: owner insert"
  ON public.experience FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "experience: owner update"
  ON public.experience FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "experience: owner delete"
  ON public.experience FOR DELETE USING (user_id = auth.uid());


-- ── certifications ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own certifications"    ON public.certifications;
DROP POLICY IF EXISTS "Public can view certifications"         ON public.certifications;
DROP POLICY IF EXISTS "Users can select own certifications"    ON public.certifications;
DROP POLICY IF EXISTS "Users can insert own certifications"    ON public.certifications;
DROP POLICY IF EXISTS "Users can update own certifications"    ON public.certifications;
DROP POLICY IF EXISTS "Users can delete own certifications"    ON public.certifications;

CREATE POLICY "certifications: public read"
  ON public.certifications FOR SELECT USING (true);
CREATE POLICY "certifications: owner insert"
  ON public.certifications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "certifications: owner update"
  ON public.certifications FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "certifications: owner delete"
  ON public.certifications FOR DELETE USING (user_id = auth.uid());


-- ── external_links ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own external links"    ON public.external_links;
DROP POLICY IF EXISTS "Public can view external links"         ON public.external_links;
DROP POLICY IF EXISTS "Users can select own external links"    ON public.external_links;
DROP POLICY IF EXISTS "Users can insert own external links"    ON public.external_links;
DROP POLICY IF EXISTS "Users can update own external links"    ON public.external_links;
DROP POLICY IF EXISTS "Users can delete own external links"    ON public.external_links;

CREATE POLICY "external_links: public read"
  ON public.external_links FOR SELECT USING (true);
CREATE POLICY "external_links: owner insert"
  ON public.external_links FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "external_links: owner update"
  ON public.external_links FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "external_links: owner delete"
  ON public.external_links FOR DELETE USING (user_id = auth.uid());


-- ── mentors ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Mentors can view own row"              ON public.mentors;
DROP POLICY IF EXISTS "Mentors can insert own row"            ON public.mentors;
DROP POLICY IF EXISTS "Mentors can update own row"            ON public.mentors;
DROP POLICY IF EXISTS "Anyone can view verified mentors"      ON public.mentors;

-- Everyone can browse mentors (directory page needs unverified too while reviewing)
CREATE POLICY "mentors: public read"
  ON public.mentors FOR SELECT USING (true);
CREATE POLICY "mentors: owner insert"
  ON public.mentors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentors: owner update"
  ON public.mentors FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentors: owner delete"
  ON public.mentors FOR DELETE USING (user_id = auth.uid());

-- Admin can toggle verified flag
DROP POLICY IF EXISTS "Admin can update any mentor"           ON public.mentors;
CREATE POLICY "Admin can update any mentor"
  ON public.mentors FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- ── mentees ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Mentees can manage own row"            ON public.mentees;
DROP POLICY IF EXISTS "Mentees can view own row"              ON public.mentees;
DROP POLICY IF EXISTS "Mentees can insert own row"            ON public.mentees;
DROP POLICY IF EXISTS "Mentees can update own row"            ON public.mentees;

-- Mentors need to read mentee rows when viewing requests
CREATE POLICY "mentees: authenticated read"
  ON public.mentees FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "mentees: owner insert"
  ON public.mentees FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentees: owner update"
  ON public.mentees FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentees: owner delete"
  ON public.mentees FOR DELETE USING (user_id = auth.uid());


-- ── mentorship_requests ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Mentees can create requests"           ON public.mentorship_requests;
DROP POLICY IF EXISTS "Mentees can view own requests"         ON public.mentorship_requests;
DROP POLICY IF EXISTS "Mentors can view requests to them"     ON public.mentorship_requests;
DROP POLICY IF EXISTS "Mentors can update requests"           ON public.mentorship_requests;

-- Insert: caller must own the mentee row
CREATE POLICY "mentorship_requests: mentee insert"
  ON public.mentorship_requests FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

-- Select: visible to the mentee or the mentor involved
CREATE POLICY "mentorship_requests: participant read"
  ON public.mentorship_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id  AND user_id = auth.uid())
  );

-- Update: only the mentor (to accept / decline)
CREATE POLICY "mentorship_requests: mentor update"
  ON public.mentorship_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );


-- ── media_posts ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own media"            ON public.media_posts;
DROP POLICY IF EXISTS "Public can view published media"       ON public.media_posts;
DROP POLICY IF EXISTS "Users can select own media"            ON public.media_posts;
DROP POLICY IF EXISTS "Users can insert own media"            ON public.media_posts;
DROP POLICY IF EXISTS "Users can update own media"            ON public.media_posts;
DROP POLICY IF EXISTS "Users can delete own media"            ON public.media_posts;

CREATE POLICY "media_posts: public read"
  ON public.media_posts FOR SELECT
  USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "media_posts: owner insert"
  ON public.media_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "media_posts: owner update"
  ON public.media_posts FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "media_posts: owner delete"
  ON public.media_posts FOR DELETE USING (user_id = auth.uid());


-- ── publications ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own publications"     ON public.publications;
DROP POLICY IF EXISTS "Public can view published publications" ON public.publications;
DROP POLICY IF EXISTS "Users can select own publications"     ON public.publications;
DROP POLICY IF EXISTS "Users can insert own publications"     ON public.publications;
DROP POLICY IF EXISTS "Users can update own publications"     ON public.publications;
DROP POLICY IF EXISTS "Users can delete own publications"     ON public.publications;

CREATE POLICY "publications: public read"
  ON public.publications FOR SELECT
  USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "publications: owner insert"
  ON public.publications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "publications: owner update"
  ON public.publications FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "publications: owner delete"
  ON public.publications FOR DELETE USING (user_id = auth.uid());


-- ── success_stories ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own stories"          ON public.success_stories;
DROP POLICY IF EXISTS "Public can view published stories"     ON public.success_stories;
DROP POLICY IF EXISTS "Users can select own stories"          ON public.success_stories;
DROP POLICY IF EXISTS "Users can insert own stories"          ON public.success_stories;
DROP POLICY IF EXISTS "Users can update own stories"          ON public.success_stories;
DROP POLICY IF EXISTS "Users can delete own stories"          ON public.success_stories;

CREATE POLICY "success_stories: public read"
  ON public.success_stories FOR SELECT
  USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "success_stories: owner insert"
  ON public.success_stories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "success_stories: owner update"
  ON public.success_stories FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "success_stories: owner delete"
  ON public.success_stories FOR DELETE USING (user_id = auth.uid());


-- ── resources ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage own resources"        ON public.resources;
DROP POLICY IF EXISTS "Public can view public resources"      ON public.resources;
DROP POLICY IF EXISTS "Users can select own resources"        ON public.resources;
DROP POLICY IF EXISTS "Users can insert own resources"        ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources"        ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources"        ON public.resources;

CREATE POLICY "resources: public read"
  ON public.resources FOR SELECT
  USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "resources: owner insert"
  ON public.resources FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "resources: owner update"
  ON public.resources FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "resources: owner delete"
  ON public.resources FOR DELETE USING (user_id = auth.uid());


-- =============================================================================
-- DONE
-- =============================================================================
SELECT 'RLS policies fully fixed ✅' AS status;
