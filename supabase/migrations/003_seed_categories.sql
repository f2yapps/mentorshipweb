-- ============================================================================
-- SEED CATEGORIES
-- ============================================================================
-- This script populates the categories table with mentorship categories
-- ============================================================================

-- Delete old categories first
DELETE FROM public.categories;

-- Insert new youth and AI-focused categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Artificial Intelligence & ML', 'ai-ml', 'Machine learning, deep learning, AI fundamentals, neural networks, and AI applications for developing countries.', 1),
  ('Software Development', 'software-dev', 'Programming, web development, mobile apps, coding best practices, and software engineering careers.', 2),
  ('Data Science & Analytics', 'data-science', 'Data analysis, statistics, data visualization, big data, and using data to solve real-world problems.', 3),
  ('Career Development', 'career', 'Job search, resume building, interviews, career transitions, and professional growth in tech.', 4),
  ('Tech Entrepreneurship', 'tech-entrepreneurship', 'Starting tech companies, product development, funding, scaling startups in developing markets.', 5),
  ('Digital Skills', 'digital-skills', 'Digital literacy, online tools, productivity, remote work, and essential tech skills for youth.', 6),
  ('Academic Success', 'academics', 'Study strategies, university applications, scholarships, research, and academic excellence.', 7),
  ('Personal Development', 'personal-dev', 'Goal setting, time management, confidence building, communication skills, and personal growth.', 8),
  ('Cloud Computing & DevOps', 'cloud-devops', 'AWS, Azure, GCP, Docker, Kubernetes, CI/CD, and modern infrastructure for developers.', 9),
  ('Cybersecurity', 'cybersecurity', 'Information security, ethical hacking, network security, and protecting digital assets.', 10),
  ('UI/UX Design', 'ui-ux', 'User interface design, user experience, product design, and design thinking for digital products.', 11),
  ('Leadership & Impact', 'leadership', 'Youth leadership, social impact, community building, and creating change in developing countries.', 12)
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were added
SELECT COUNT(*) as total_categories FROM public.categories;
