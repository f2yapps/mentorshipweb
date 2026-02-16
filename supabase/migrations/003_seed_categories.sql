-- ============================================================================
-- SEED CATEGORIES
-- ============================================================================
-- This script populates the categories table with mentorship categories
-- ============================================================================

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Academics', 'academics', 'Get help with studies, research, university applications, and academic planning.', 1),
  ('Career', 'career', 'Guidance on job search, career transitions, professional development, and workplace challenges.', 2),
  ('Life', 'life', 'General life advice, personal growth, decision-making, and life transitions.', 3),
  ('Relationships', 'relationships', 'Navigate family, friendships, dating, marriage, and interpersonal relationships.', 4),
  ('Mental Health', 'mental-health', 'Support for stress, anxiety, self-care, and emotional wellbeing.', 5),
  ('Entrepreneurship', 'entrepreneurship', 'Start and grow your business, funding, business planning, and scaling.', 6),
  ('Tech', 'tech', 'Software development, IT careers, coding, and technology guidance.', 7),
  ('Agriculture', 'agriculture', 'Farming techniques, agribusiness, sustainable agriculture, and rural development.', 8),
  ('Leadership', 'leadership', 'Develop leadership skills, team management, and organizational impact.', 9),
  ('Immigration', 'immigration', 'Study abroad, work visas, relocation, and settling in a new country.', 10),
  ('Faith & Purpose', 'faith-purpose', 'Spiritual growth, finding purpose, values, and faith-based guidance.', 11)
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were added
SELECT COUNT(*) as total_categories FROM public.categories;
