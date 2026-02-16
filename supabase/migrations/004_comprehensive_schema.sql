-- =============================================================================
-- COMPREHENSIVE MENTORSHIP PLATFORM SCHEMA
-- Production-ready schema with professional profiles, knowledge sharing,
-- progress tracking, and impact metrics
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- =============================================================================
-- DROP EXISTING TABLES (for clean migration)
-- =============================================================================
-- Note: Comment out if you want to preserve existing data
-- DROP TABLE IF EXISTS public.reviews CASCADE;
-- DROP TABLE IF EXISTS public.mentorship_requests CASCADE;
-- DROP TABLE IF EXISTS public.mentees CASCADE;
-- DROP TABLE IF EXISTS public.mentors CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- =============================================================================
-- ENHANCED USERS TABLE
-- =============================================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_position TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Update role to support 'both'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('mentor', 'mentee', 'both', 'admin'));

-- =============================================================================
-- EDUCATION HISTORY
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_education_user_id ON public.education(user_id);
CREATE INDEX IF NOT EXISTS idx_education_current ON public.education(is_current);

-- =============================================================================
-- WORK EXPERIENCE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  employment_type TEXT, -- Full-time, Part-time, Contract, etc.
  location TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_user_id ON public.experience(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_current ON public.experience(is_current);

-- =============================================================================
-- CERTIFICATIONS
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON public.certifications(user_id);

-- =============================================================================
-- EXTERNAL LINKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.external_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- zoom, whatsapp, google_scholar, youtube, calendly, etc.
  url TEXT NOT NULL,
  label TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_external_links_user_id ON public.external_links(user_id);

-- =============================================================================
-- ENHANCED MENTORS TABLE
-- =============================================================================
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS who_can_mentor TEXT[] DEFAULT '{}'; -- students, early-career, entrepreneurs, etc.
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS how_mentor TEXT[] DEFAULT '{}'; -- career-advice, research-guidance, life-coaching, etc.
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS weekly_availability_hours INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS max_mentees INT DEFAULT 5;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS current_mentees_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS total_mentees_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS completed_mentorships_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS success_stories_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS publications_count INT DEFAULT 0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE public.mentors ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0;

-- =============================================================================
-- AVAILABILITY SLOTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_availability_mentor_id ON public.availability_slots(mentor_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.availability_slots(day_of_week);

-- =============================================================================
-- ENHANCED MENTORSHIP REQUESTS
-- =============================================================================
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS background TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS preferred_frequency TEXT; -- weekly, biweekly, monthly
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS mentor_response TEXT;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ;
ALTER TABLE public.mentorship_requests ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Update status to include more states
ALTER TABLE public.mentorship_requests DROP CONSTRAINT IF EXISTS mentorship_requests_status_check;
ALTER TABLE public.mentorship_requests ADD CONSTRAINT mentorship_requests_status_check 
  CHECK (status IN ('pending', 'accepted', 'declined', 'active', 'in_progress', 'completed', 'cancelled'));

-- =============================================================================
-- MENTORSHIP SESSIONS
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_sessions_request_id ON public.mentorship_sessions(mentorship_request_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.mentorship_sessions(scheduled_at);

-- =============================================================================
-- MENTORSHIP MILESTONES
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_milestones_request_id ON public.mentorship_milestones(mentorship_request_id);
CREATE INDEX IF NOT EXISTS idx_milestones_completed ON public.mentorship_milestones(is_completed);

-- =============================================================================
-- MENTORSHIP OUTCOMES
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_outcomes_request_id ON public.mentorship_outcomes(mentorship_request_id);

-- =============================================================================
-- PUBLICATIONS / RESEARCH
-- =============================================================================
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
  file_url TEXT, -- Supabase Storage URL
  file_size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  downloads_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publications_user_id ON public.publications(user_id);
CREATE INDEX IF NOT EXISTS idx_publications_date ON public.publications(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_publications_tags ON public.publications USING GIN(tags);

-- =============================================================================
-- SUCCESS STORIES
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_success_stories_user_id ON public.success_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_featured ON public.success_stories(is_featured);
CREATE INDEX IF NOT EXISTS idx_success_stories_published ON public.success_stories(is_published);
CREATE INDEX IF NOT EXISTS idx_success_stories_created ON public.success_stories(created_at DESC);

-- =============================================================================
-- MEDIA POSTS (Videos, Audio, Photos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio', 'image')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT, -- for video/audio
  file_size_bytes BIGINT,
  tags TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_posts_user_id ON public.media_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_media_posts_type ON public.media_posts(media_type);
CREATE INDEX IF NOT EXISTS idx_media_posts_created ON public.media_posts(created_at DESC);

-- =============================================================================
-- RESOURCES (Documents, Slides, Training Materials)
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_resources_user_id ON public.resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_public ON public.resources(is_public);

-- =============================================================================
-- COMMUNITY ACTIVITY FEED
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'mentor_joined', 'mentee_joined', 'mentorship_started', 'mentorship_completed',
    'publication_shared', 'success_story_shared', 'milestone_reached', 'resource_shared'
  )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}', -- Flexible storage for activity-specific data
  related_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  related_entity_type TEXT, -- mentorship, publication, story, etc.
  related_entity_id UUID,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON public.activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON public.activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_public ON public.activity_feed(is_public);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- =============================================================================
CREATE TRIGGER education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER experience_updated_at
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER external_links_updated_at
  BEFORE UPDATE ON public.external_links
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER mentorship_sessions_updated_at
  BEFORE UPDATE ON public.mentorship_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER mentorship_milestones_updated_at
  BEFORE UPDATE ON public.mentorship_milestones
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER mentorship_outcomes_updated_at
  BEFORE UPDATE ON public.mentorship_outcomes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER media_posts_updated_at
  BEFORE UPDATE ON public.media_posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =============================================================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================================================
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
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Education policies
CREATE POLICY "Users can view own education" ON public.education
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own education" ON public.education
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Public can view education of mentors" ON public.education
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = education.user_id)
  );

-- Experience policies
CREATE POLICY "Users can view own experience" ON public.experience
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own experience" ON public.experience
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own experience" ON public.experience
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own experience" ON public.experience
  FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Public can view experience of mentors" ON public.experience
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = experience.user_id)
  );

-- Certifications policies
CREATE POLICY "Users can manage own certifications" ON public.certifications
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view certifications" ON public.certifications
  FOR SELECT USING (true);

-- External links policies
CREATE POLICY "Users can manage own external links" ON public.external_links
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view external links" ON public.external_links
  FOR SELECT USING (true);

-- Availability slots policies
CREATE POLICY "Mentors can manage own availability" ON public.availability_slots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );
CREATE POLICY "Public can view availability" ON public.availability_slots
  FOR SELECT USING (true);

-- Mentorship sessions policies
CREATE POLICY "Participants can view sessions" ON public.mentorship_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );
CREATE POLICY "Participants can create sessions" ON public.mentorship_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );
CREATE POLICY "Participants can update sessions" ON public.mentorship_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );

-- Milestones policies (similar to sessions)
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
CREATE POLICY "Participants can view outcomes" ON public.mentorship_outcomes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );
CREATE POLICY "Participants can create outcomes" ON public.mentorship_outcomes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mentorship_requests mr
      JOIN public.mentors m ON m.id = mr.mentor_id
      JOIN public.mentees me ON me.id = mr.mentee_id
      WHERE mr.id = mentorship_request_id 
      AND (m.user_id = auth.uid() OR me.user_id = auth.uid())
    )
  );

-- Publications policies
CREATE POLICY "Users can manage own publications" ON public.publications
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view published publications" ON public.publications
  FOR SELECT USING (is_published = true);

-- Success stories policies
CREATE POLICY "Users can manage own stories" ON public.success_stories
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view published stories" ON public.success_stories
  FOR SELECT USING (is_published = true);

-- Media posts policies
CREATE POLICY "Users can manage own media" ON public.media_posts
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view published media" ON public.media_posts
  FOR SELECT USING (is_published = true);

-- Resources policies
CREATE POLICY "Users can manage own resources" ON public.resources
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view public resources" ON public.resources
  FOR SELECT USING (is_public = true);

-- Activity feed policies
CREATE POLICY "Public can view public activities" ON public.activity_feed
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create activities" ON public.activity_feed
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to update mentor statistics
CREATE OR REPLACE FUNCTION update_mentor_stats(mentor_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.mentors
  SET 
    current_mentees_count = (
      SELECT COUNT(*) FROM public.mentorship_requests 
      WHERE mentor_id = mentor_uuid AND status IN ('accepted', 'active', 'in_progress')
    ),
    completed_mentorships_count = (
      SELECT COUNT(*) FROM public.mentorship_requests 
      WHERE mentor_id = mentor_uuid AND status = 'completed'
    ),
    rating_average = (
      SELECT COALESCE(AVG(rating), 0) FROM public.reviews 
      WHERE mentor_id = mentor_uuid
    ),
    rating_count = (
      SELECT COUNT(*) FROM public.reviews 
      WHERE mentor_id = mentor_uuid
    ),
    publications_count = (
      SELECT COUNT(*) FROM public.publications p
      JOIN public.mentors m ON m.user_id = p.user_id
      WHERE m.id = mentor_uuid AND p.is_published = true
    ),
    success_stories_count = (
      SELECT COUNT(*) FROM public.success_stories s
      JOIN public.mentors m ON m.user_id = s.user_id
      WHERE m.id = mentor_uuid AND s.is_published = true
    )
  WHERE id = mentor_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to create activity feed entry
CREATE OR REPLACE FUNCTION create_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB,
  p_related_user_id UUID DEFAULT NULL,
  p_related_entity_type TEXT DEFAULT NULL,
  p_related_entity_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_feed (
    user_id, activity_type, title, description, metadata,
    related_user_id, related_entity_type, related_entity_id
  ) VALUES (
    p_user_id, p_activity_type, p_title, p_description, p_metadata,
    p_related_user_id, p_related_entity_type, p_related_entity_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC ACTIVITY FEED
-- =============================================================================

-- Trigger when mentor accepts request
CREATE OR REPLACE FUNCTION on_mentorship_accepted()
RETURNS TRIGGER AS $$
DECLARE
  mentor_user_id UUID;
  mentee_user_id UUID;
  mentor_name TEXT;
  mentee_name TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Get user IDs and names
    SELECT m.user_id, u.name INTO mentor_user_id, mentor_name
    FROM public.mentors m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.id = NEW.mentor_id;
    
    SELECT me.user_id, u.name INTO mentee_user_id, mentee_name
    FROM public.mentees me
    JOIN public.users u ON u.id = me.user_id
    WHERE me.id = NEW.mentee_id;
    
    -- Create activity
    PERFORM create_activity(
      mentor_user_id,
      'mentorship_started',
      mentor_name || ' started mentoring ' || mentee_name,
      'New mentorship in ' || NEW.category,
      jsonb_build_object('category', NEW.category),
      mentee_user_id,
      'mentorship_request',
      NEW.id
    );
    
    -- Notify mentee
    PERFORM create_notification(
      mentee_user_id,
      'mentorship_accepted',
      'Mentorship Request Accepted!',
      mentor_name || ' has accepted your mentorship request.',
      '/dashboard/mentee'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mentorship_accepted_trigger
  AFTER UPDATE ON public.mentorship_requests
  FOR EACH ROW
  EXECUTE FUNCTION on_mentorship_accepted();

-- Trigger when publication is shared
CREATE OR REPLACE FUNCTION on_publication_created()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  IF NEW.is_published THEN
    SELECT name INTO user_name FROM public.users WHERE id = NEW.user_id;
    
    PERFORM create_activity(
      NEW.user_id,
      'publication_shared',
      user_name || ' shared a publication',
      NEW.title,
      jsonb_build_object('title', NEW.title),
      NULL,
      'publication',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER publication_created_trigger
  AFTER INSERT ON public.publications
  FOR EACH ROW
  EXECUTE FUNCTION on_publication_created();

-- Trigger when success story is shared
CREATE OR REPLACE FUNCTION on_success_story_created()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  IF NEW.is_published THEN
    SELECT name INTO user_name FROM public.users WHERE id = NEW.user_id;
    
    PERFORM create_activity(
      NEW.user_id,
      'success_story_shared',
      user_name || ' shared a success story',
      NEW.title,
      jsonb_build_object('title', NEW.title),
      NULL,
      'success_story',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER success_story_created_trigger
  AFTER INSERT ON public.success_stories
  FOR EACH ROW
  EXECUTE FUNCTION on_success_story_created();
