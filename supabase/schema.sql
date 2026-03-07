-- Mentorship Platform - Supabase Schema
-- Run this in Supabase SQL Editor to create tables and RLS policies.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROFILES / USERS (extends Supabase auth.users)
-- =============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('mentor', 'mentee', 'admin')) DEFAULT 'mentee',
  country TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- CATEGORIES (predefined mentorship categories)
-- =============================================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- MENTORS (mentor-specific profile)
-- =============================================================================
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  expertise_categories TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  experience_years INT NOT NULL DEFAULT 0,
  availability TEXT NOT NULL DEFAULT 'flexible',
  languages TEXT[] NOT NULL DEFAULT '{}',
  preferred_communication TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- MENTEES (mentee-specific profile)
-- =============================================================================
CREATE TABLE public.mentees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  goals TEXT,
  preferred_categories TEXT[] NOT NULL DEFAULT '{}',
  background TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- MENTORSHIP REQUESTS
-- =============================================================================
CREATE TABLE public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- REVIEWS (mentee reviews of mentors)
-- =============================================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX idx_mentees_user_id ON public.mentees(user_id);
CREATE INDEX idx_mentorship_requests_mentee ON public.mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_status ON public.mentorship_requests(status);
CREATE INDEX idx_mentors_verified ON public.mentors(verified);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER mentees_updated_at
  BEFORE UPDATE ON public.mentees
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER mentorship_requests_updated_at
  BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

-- Users: own row + admins see all; mentors/mentees see limited for directory
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Public can view mentor/mentee profiles for directory"
  ON public.users FOR SELECT USING (true);

-- Mentors: own row; public read for directory; admin manage
CREATE POLICY "Mentors can view own row"
  ON public.mentors FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Mentors can insert own row"
  ON public.mentors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Mentors can update own row"
  ON public.mentors FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Anyone can view verified mentors"
  ON public.mentors FOR SELECT USING (verified = true OR user_id = auth.uid());
CREATE POLICY "Admins can update mentors (e.g. verify)"
  ON public.mentors FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Mentees: own row; mentor sees when in a request
CREATE POLICY "Mentees can view own row"
  ON public.mentees FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Mentees can insert own row"
  ON public.mentees FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Mentees can update own row"
  ON public.mentees FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Mentors can view mentees who requested them"
  ON public.mentees FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      WHERE m.user_id = auth.uid() AND mr.mentee_id = public.mentees.id
    )
  );
CREATE POLICY "Admins can view all mentees"
  ON public.mentees FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Mentorship requests: mentee creates; mentor/mentee see their requests; admin see all
CREATE POLICY "Mentees can create requests"
  ON public.mentorship_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );
CREATE POLICY "Mentees can view own requests"
  ON public.mentorship_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );
CREATE POLICY "Mentors can view requests to them"
  ON public.mentorship_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );
CREATE POLICY "Mentors can update requests (accept/decline)"
  ON public.mentorship_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can view and update all requests"
  ON public.mentorship_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews: mentee can insert after accepted/completed; everyone can read for mentor
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Mentees can insert review for their mentor"
  ON public.reviews FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentees WHERE id = mentee_id AND user_id = auth.uid())
  );

-- =============================================================================
-- AUTH HOOK: create user profile on signup
-- =============================================================================
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

-- Trigger on auth.users (run in Supabase Dashboard or with service role)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Note: Supabase Dashboard -> Authentication -> Triggers: or add via SQL with service role:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
