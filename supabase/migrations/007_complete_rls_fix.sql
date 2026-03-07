-- =============================================================================
-- DEFINITIVE COMPLETE RLS FIX  (migration 007 — safe to re-run)
-- Run this ONE file in: Supabase Dashboard → SQL Editor → Run
--
-- Covers EVERY table + all 4 storage buckets.
-- Drops ALL policies (old names AND new names) before recreating.
-- =============================================================================


-- =============================================================================
-- PART 1: STORAGE BUCKETS
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('profile-images', 'profile-images', true),
  ('media',          'media',          true),
  ('publications',   'publications',   true),
  ('resources',      'resources',      true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;


-- =============================================================================
-- PART 2: STORAGE OBJECT RLS — drop ALL then recreate
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

-- profile-images
CREATE POLICY "profile-images: public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "profile-images: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "profile-images: owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "profile-images: owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);

-- media
CREATE POLICY "media: public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "media: owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "media: owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);

-- publications
CREATE POLICY "publications: public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'publications');
CREATE POLICY "publications: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'publications' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "publications: owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'publications' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'publications' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "publications: owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'publications' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);

-- resources
CREATE POLICY "resources: public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "resources: owner insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "resources: owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'resources' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "resources: owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resources' AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text);


-- =============================================================================
-- PART 3: TABLE RLS — drop ALL policies per table using dynamic SQL, then recreate
-- =============================================================================

DO $$
DECLARE pol RECORD;
  tables TEXT[] := ARRAY[
    'users','education','experience','certifications','external_links',
    'mentors','mentees','mentorship_requests','media_posts',
    'publications','success_stories','resources'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE POLICY "users: public read"
  ON public.users FOR SELECT USING (true);
CREATE POLICY "users: self insert"
  ON public.users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users: self update"
  ON public.users FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ── education ─────────────────────────────────────────────────────────────────
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
CREATE POLICY "mentors: public read"
  ON public.mentors FOR SELECT USING (true);
CREATE POLICY "mentors: owner insert"
  ON public.mentors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentors: owner update"
  ON public.mentors FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentors: owner delete"
  ON public.mentors FOR DELETE USING (user_id = auth.uid());
-- Admin can toggle verified
CREATE POLICY "mentors: admin update"
  ON public.mentors FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ── mentees ───────────────────────────────────────────────────────────────────
CREATE POLICY "mentees: authenticated read"
  ON public.mentees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "mentees: owner insert"
  ON public.mentees FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentees: owner update"
  ON public.mentees FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "mentees: owner delete"
  ON public.mentees FOR DELETE USING (user_id = auth.uid());

-- ── mentorship_requests ───────────────────────────────────────────────────────
CREATE POLICY "mentorship_requests: mentee insert"
  ON public.mentorship_requests FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );
CREATE POLICY "mentorship_requests: participant read"
  ON public.mentorship_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id  AND user_id = auth.uid())
  );
CREATE POLICY "mentorship_requests: mentor update"
  ON public.mentorship_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

-- ── media_posts ───────────────────────────────────────────────────────────────
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
