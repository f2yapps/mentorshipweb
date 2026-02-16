-- =============================================================================
-- SUPABASE STORAGE BUCKETS SETUP
-- Run these commands in Supabase Dashboard -> Storage or via SQL Editor
-- =============================================================================

-- Note: Storage buckets are typically created via the Supabase Dashboard UI,
-- but here are the SQL commands for reference and automation.

-- =============================================================================
-- CREATE STORAGE BUCKETS
-- =============================================================================

-- Profile images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Publications bucket (public for viewing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'publications',
  'publications',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Media bucket (videos, audio, images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  524288000, -- 500MB limit for videos
  ARRAY[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Resources bucket (documents, slides, templates)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources',
  'resources',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ]
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Profile Images Policies
CREATE POLICY "Anyone can view profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Publications Policies
CREATE POLICY "Anyone can view publications"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'publications');

CREATE POLICY "Authenticated users can upload publications"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'publications' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own publications"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'publications' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own publications"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'publications' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Media Policies
CREATE POLICY "Anyone can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Resources Policies
CREATE POLICY "Anyone can view public resources"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users can upload resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own resources"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- MANUAL SETUP INSTRUCTIONS (via Supabase Dashboard)
-- =============================================================================

/*
If the SQL commands above don't work, create buckets manually:

1. Go to Supabase Dashboard -> Storage
2. Click "New bucket" for each:

BUCKET: profile-images
- Public: Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

BUCKET: publications
- Public: Yes
- File size limit: 50MB
- Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

BUCKET: media
- Public: Yes
- File size limit: 500MB
- Allowed MIME types: video/mp4, video/webm, audio/mpeg, image/jpeg, image/png

BUCKET: resources
- Public: Yes
- File size limit: 50MB
- Allowed MIME types: application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, etc.

3. Then run the STORAGE POLICIES section above in SQL Editor
*/

-- =============================================================================
-- HELPER: Get public URL for uploaded file
-- =============================================================================

/*
In your application code, get public URLs like this:

const { data } = supabase.storage
  .from('profile-images')
  .getPublicUrl(`${userId}/avatar.jpg`);

console.log(data.publicUrl);
*/
