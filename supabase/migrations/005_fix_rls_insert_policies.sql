-- =============================================================================
-- FIX: Explicit WITH CHECK for INSERT on tables using FOR ALL USING
-- Run this in Supabase SQL Editor if inserts fail with "violates row-level security"
-- =============================================================================

-- CERTIFICATIONS: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own certifications" ON public.certifications;
CREATE POLICY "Users can select own certifications" ON public.certifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own certifications" ON public.certifications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own certifications" ON public.certifications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own certifications" ON public.certifications
  FOR DELETE USING (user_id = auth.uid());

-- EXTERNAL LINKS: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own external links" ON public.external_links;
CREATE POLICY "Users can select own external links" ON public.external_links
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own external links" ON public.external_links
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own external links" ON public.external_links
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own external links" ON public.external_links
  FOR DELETE USING (user_id = auth.uid());

-- MEDIA POSTS: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own media" ON public.media_posts;
CREATE POLICY "Users can select own media" ON public.media_posts
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own media" ON public.media_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own media" ON public.media_posts
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own media" ON public.media_posts
  FOR DELETE USING (user_id = auth.uid());

-- PUBLICATIONS: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own publications" ON public.publications;
CREATE POLICY "Users can select own publications" ON public.publications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own publications" ON public.publications
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own publications" ON public.publications
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own publications" ON public.publications
  FOR DELETE USING (user_id = auth.uid());

-- SUCCESS STORIES: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own stories" ON public.success_stories;
CREATE POLICY "Users can select own stories" ON public.success_stories
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own stories" ON public.success_stories
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own stories" ON public.success_stories
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own stories" ON public.success_stories
  FOR DELETE USING (user_id = auth.uid());

-- RESOURCES: replace FOR ALL USING with explicit per-operation policies
DROP POLICY IF EXISTS "Users can manage own resources" ON public.resources;
CREATE POLICY "Users can select own resources" ON public.resources
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own resources" ON public.resources
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own resources" ON public.resources
  FOR DELETE USING (user_id = auth.uid());
