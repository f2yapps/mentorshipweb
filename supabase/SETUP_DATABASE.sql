-- =============================================================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Run this ONCE in Supabase SQL Editor to set up everything
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =============================================================================
-- STEP 1: CREATE BASE TABLES
-- =============================================================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('mentor', 'mentee', 'both', 'admin')) DEFAULT 'mentee',
  country TEXT,
  city TEXT,
  bio TEXT,
  avatar_url TEXT,
  current_position TEXT,
  organization TEXT,
  languages TEXT[] DEFAULT '{}',
  timezone TEXT DEFAULT 'UTC',
  phone TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  location TEXT,
  grade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  employment_type TEXT,
  location TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- External links table
CREATE TABLE IF NOT EXISTS public.external_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  expertise_categories TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  experience_years INT NOT NULL DEFAULT 0,
  availability TEXT NOT NULL DEFAULT 'flexible',
  languages TEXT[] NOT NULL DEFAULT '{}',
  preferred_communication TEXT[] NOT NULL DEFAULT '{}',
  who_can_mentor TEXT[] DEFAULT '{}',
  how_mentor TEXT[] DEFAULT '{}',
  weekly_availability_hours INT DEFAULT 0,
  max_mentees INT DEFAULT 5,
  current_mentees_count INT DEFAULT 0,
  total_mentees_count INT DEFAULT 0,
  completed_mentorships_count INT DEFAULT 0,
  success_stories_count INT DEFAULT 0,
  publications_count INT DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentees table
CREATE TABLE IF NOT EXISTS public.mentees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  goals TEXT,
  preferred_categories TEXT[] NOT NULL DEFAULT '{}',
  background TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Availability slots table
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentorship requests table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  message TEXT,
  goals TEXT,
  background TEXT,
  preferred_frequency TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'active', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  mentor_response TEXT,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentorship sessions table
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentorship_request_id UUID NOT NULL REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_minutes INT,
  session_notes TEXT,
  mentor_notes TEXT,
  mentee_notes TEXT,
  topics_covered TEXT[] DEFAULT '{}',
  action_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentorship milestones table
CREATE TABLE IF NOT EXISTS public.mentorship_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentorship_request_id UUID NOT NULL REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mentorship outcomes table
CREATE TABLE IF NOT EXISTS public.mentorship_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentorship_request_id UUID NOT NULL UNIQUE REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  goals_achieved TEXT[] DEFAULT '{}',
  skills_gained TEXT[] DEFAULT '{}',
  mentor_reflection TEXT,
  mentee_reflection TEXT,
  impact_rating INT CHECK (impact_rating >= 1 AND impact_rating <= 5),
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

-- Publications table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] DEFAULT '{}',
  publication_date DATE,
  journal_or_conference TEXT,
  doi TEXT,
  external_url TEXT,
  file_url TEXT,
  file_size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  downloads_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Success stories table
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentorship_request_id UUID REFERENCES public.mentorship_requests(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media posts table
CREATE TABLE IF NOT EXISTS public.media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio', 'image')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  file_size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('document', 'slides', 'template', 'guide', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  downloads_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity feed table
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'mentor_joined', 'mentee_joined', 'mentorship_started', 'mentorship_completed',
    'publication_shared', 'success_story_shared', 'milestone_reached', 'resource_shared'
  )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  related_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- STEP 2: CREATE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON public.users(country);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education(user_id);
CREATE INDEX IF NOT EXISTS idx_education_current ON public.education(is_current);
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON public.experience(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_current ON public.experience(is_current);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON public.certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_external_links_user_id ON public.external_links(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_verified ON public.mentors(verified);
CREATE INDEX IF NOT EXISTS idx_mentees_user_id ON public.mentees(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_mentor_id ON public.availability_slots(mentor_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentee ON public.mentorship_requests(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_status ON public.mentorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_sessions_request_id ON public.mentorship_sessions(mentorship_request_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.mentorship_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_milestones_request_id ON public.mentorship_milestones(mentorship_request_id);
CREATE INDEX IF NOT EXISTS idx_milestones_completed ON public.mentorship_milestones(is_completed);
CREATE INDEX IF NOT EXISTS idx_outcomes_request_id ON public.mentorship_outcomes(mentorship_request_id);
CREATE INDEX IF NOT EXISTS idx_publications_user_id ON public.publications(user_id);
CREATE INDEX IF NOT EXISTS idx_publications_date ON public.publications(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_publications_tags ON public.publications USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_success_stories_user_id ON public.success_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_featured ON public.success_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_success_stories_published ON public.success_stories(is_published);
CREATE INDEX IF NOT EXISTS idx_success_stories_created ON public.success_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_posts_user_id ON public.media_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_media_posts_type ON public.media_posts(media_type);
CREATE INDEX IF NOT EXISTS idx_media_posts_created ON public.media_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON public.resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_public ON public.resources(is_public);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON public.activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_public ON public.activity_feed(is_public);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_users_search ON public.users USING GIN(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(bio, '') || ' ' || COALESCE(current_position, ''))
);
CREATE INDEX IF NOT EXISTS idx_publications_search ON public.publications USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(abstract, ''))
);
CREATE INDEX IF NOT EXISTS idx_success_stories_search ON public.success_stories USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))
);

-- =============================================================================
-- STEP 3: CREATE FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentors_updated_at ON public.mentors;
CREATE TRIGGER mentors_updated_at BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentees_updated_at ON public.mentees;
CREATE TRIGGER mentees_updated_at BEFORE UPDATE ON public.mentees
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentorship_requests_updated_at ON public.mentorship_requests;
CREATE TRIGGER mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS education_updated_at ON public.education;
CREATE TRIGGER education_updated_at BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS experience_updated_at ON public.experience;
CREATE TRIGGER experience_updated_at BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS certifications_updated_at ON public.certifications;
CREATE TRIGGER certifications_updated_at BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS external_links_updated_at ON public.external_links;
CREATE TRIGGER external_links_updated_at BEFORE UPDATE ON public.external_links
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS availability_slots_updated_at ON public.availability_slots;
CREATE TRIGGER availability_slots_updated_at BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentorship_sessions_updated_at ON public.mentorship_sessions;
CREATE TRIGGER mentorship_sessions_updated_at BEFORE UPDATE ON public.mentorship_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentorship_milestones_updated_at ON public.mentorship_milestones;
CREATE TRIGGER mentorship_milestones_updated_at BEFORE UPDATE ON public.mentorship_milestones
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS mentorship_outcomes_updated_at ON public.mentorship_outcomes;
CREATE TRIGGER mentorship_outcomes_updated_at BEFORE UPDATE ON public.mentorship_outcomes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS publications_updated_at ON public.publications;
CREATE TRIGGER publications_updated_at BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS success_stories_updated_at ON public.success_stories;
CREATE TRIGGER success_stories_updated_at BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS media_posts_updated_at ON public.media_posts;
CREATE TRIGGER media_posts_updated_at BEFORE UPDATE ON public.media_posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON public.resources;
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Auth user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::TEXT, 'mentee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply auth trigger (this will be created on auth.users table)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 5: CREATE RLS POLICIES
-- =============================================================================

-- Categories policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view user profiles" ON public.users;
CREATE POLICY "Public can view user profiles" ON public.users
  FOR SELECT USING (true);

-- Education policies
DROP POLICY IF EXISTS "Users can manage own education" ON public.education;
CREATE POLICY "Users can manage own education" ON public.education
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view education" ON public.education;
CREATE POLICY "Public can view education" ON public.education
  FOR SELECT USING (true);

-- Experience policies
DROP POLICY IF EXISTS "Users can manage own experience" ON public.experience;
CREATE POLICY "Users can manage own experience" ON public.experience
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view experience" ON public.experience;
CREATE POLICY "Public can view experience" ON public.experience
  FOR SELECT USING (true);

-- Certifications policies
DROP POLICY IF EXISTS "Users can manage own certifications" ON public.certifications;
CREATE POLICY "Users can manage own certifications" ON public.certifications
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view certifications" ON public.certifications;
CREATE POLICY "Public can view certifications" ON public.certifications
  FOR SELECT USING (true);

-- External links policies
DROP POLICY IF EXISTS "Users can manage own external links" ON public.external_links;
CREATE POLICY "Users can manage own external links" ON public.external_links
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view external links" ON public.external_links;
CREATE POLICY "Public can view external links" ON public.external_links
  FOR SELECT USING (true);

-- Mentors policies
DROP POLICY IF EXISTS "Mentors can view own row" ON public.mentors;
CREATE POLICY "Mentors can view own row" ON public.mentors
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Mentors can insert own row" ON public.mentors;
CREATE POLICY "Mentors can insert own row" ON public.mentors
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Mentors can update own row" ON public.mentors;
CREATE POLICY "Mentors can update own row" ON public.mentors
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can view verified mentors" ON public.mentors;
CREATE POLICY "Anyone can view verified mentors" ON public.mentors
  FOR SELECT USING (verified = true OR user_id = auth.uid());

-- Mentees policies
DROP POLICY IF EXISTS "Mentees can manage own row" ON public.mentees;
CREATE POLICY "Mentees can manage own row" ON public.mentees
  FOR ALL USING (user_id = auth.uid());

-- Availability slots policies
DROP POLICY IF EXISTS "Mentors can manage own availability" ON public.availability_slots;
CREATE POLICY "Mentors can manage own availability" ON public.availability_slots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Public can view availability" ON public.availability_slots;
CREATE POLICY "Public can view availability" ON public.availability_slots
  FOR SELECT USING (true);

-- Mentorship requests policies
DROP POLICY IF EXISTS "Mentees can create requests" ON public.mentorship_requests;
CREATE POLICY "Mentees can create requests" ON public.mentorship_requests
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Mentees can view own requests" ON public.mentorship_requests;
CREATE POLICY "Mentees can view own requests" ON public.mentorship_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Mentors can view requests to them" ON public.mentorship_requests;
CREATE POLICY "Mentors can view requests to them" ON public.mentorship_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Mentors can update requests" ON public.mentorship_requests;
CREATE POLICY "Mentors can update requests" ON public.mentorship_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

-- Mentorship sessions policies
DROP POLICY IF EXISTS "Participants can manage sessions" ON public.mentorship_sessions;
CREATE POLICY "Participants can manage sessions" ON public.mentorship_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );

-- Milestones policies
DROP POLICY IF EXISTS "Participants can manage milestones" ON public.mentorship_milestones;
CREATE POLICY "Participants can manage milestones" ON public.mentorship_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );

-- Outcomes policies
DROP POLICY IF EXISTS "Participants can manage outcomes" ON public.mentorship_outcomes;
CREATE POLICY "Participants can manage outcomes" ON public.mentorship_outcomes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Mentees can insert review" ON public.reviews;
CREATE POLICY "Mentees can insert review" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

-- Publications policies
DROP POLICY IF EXISTS "Users can manage own publications" ON public.publications;
CREATE POLICY "Users can manage own publications" ON public.publications
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view published publications" ON public.publications;
CREATE POLICY "Public can view published publications" ON public.publications
  FOR SELECT USING (is_published = true);

-- Success stories policies
DROP POLICY IF EXISTS "Users can manage own stories" ON public.success_stories;
CREATE POLICY "Users can manage own stories" ON public.success_stories
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view published stories" ON public.success_stories;
CREATE POLICY "Public can view published stories" ON public.success_stories
  FOR SELECT USING (is_published = true);

-- Media posts policies
DROP POLICY IF EXISTS "Users can manage own media" ON public.media_posts;
CREATE POLICY "Users can manage own media" ON public.media_posts
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view published media" ON public.media_posts;
CREATE POLICY "Public can view published media" ON public.media_posts
  FOR SELECT USING (is_published = true);

-- Resources policies
DROP POLICY IF EXISTS "Users can manage own resources" ON public.resources;
CREATE POLICY "Users can manage own resources" ON public.resources
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public can view public resources" ON public.resources;
CREATE POLICY "Public can view public resources" ON public.resources
  FOR SELECT USING (is_public = true);

-- Activity feed policies
DROP POLICY IF EXISTS "Public can view public activities" ON public.activity_feed;
CREATE POLICY "Public can view public activities" ON public.activity_feed
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can create activities" ON public.activity_feed;
CREATE POLICY "Users can create activities" ON public.activity_feed
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================================================
-- STEP 6: SEED CATEGORIES
-- =============================================================================

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

-- =============================================================================
-- DONE! Your database is now set up and ready to use.
-- =============================================================================

SELECT 'Database setup complete! ✅' as status;
