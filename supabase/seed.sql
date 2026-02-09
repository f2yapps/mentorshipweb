-- Sample data for development. Run after schema.sql.

-- Categories (as specified)
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Academics', 'academics', 'Study skills, subject tutoring, and academic planning', 1),
  ('Career', 'career', 'Job search, career transitions, and professional growth', 2),
  ('Life', 'life', 'Life skills, time management, and personal development', 3),
  ('Relationships', 'relationships', 'Family, friends, and interpersonal skills', 4),
  ('Mental Health', 'mental-health', 'Wellness, stress management, and emotional support', 5),
  ('Entrepreneurship', 'entrepreneurship', 'Starting and growing a business', 6),
  ('Tech', 'tech', 'Programming, digital skills, and technology careers', 7),
  ('Agriculture', 'agriculture', 'Farming, agribusiness, and rural development', 8),
  ('Leadership', 'leadership', 'Leading teams, management, and influence', 9),
  ('Immigration', 'immigration', 'Visas, relocation, and settling abroad', 10),
  ('Faith & Purpose', 'faith-purpose', 'Spirituality, meaning, and life purpose', 11)
ON CONFLICT (slug) DO NOTHING;

-- Note: Users, mentors, and mentees are created via the app (Supabase Auth + profile tables).
-- To test with sample users, create them in the Supabase Auth UI or via the app signup flow.
