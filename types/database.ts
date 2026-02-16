// =============================================================================
// DATABASE TYPES - Comprehensive TypeScript types for all database tables
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =============================================================================
// USER & PROFILE TYPES
// =============================================================================

export type UserRole = 'mentor' | 'mentee' | 'both' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  country: string | null
  city: string | null
  bio: string | null
  avatar_url: string | null
  current_position: string | null
  organization: string | null
  languages: string[]
  timezone: string
  phone: string | null
  linkedin_url: string | null
  website_url: string | null
  is_active: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  location: string | null
  grade: string | null
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  title: string
  employment_type: string | null
  location: string | null
  is_current: boolean
  start_date: string
  end_date: string | null
  description: string | null
  skills: string[]
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  user_id: string
  name: string
  issuing_organization: string
  issue_date: string
  expiration_date: string | null
  credential_id: string | null
  credential_url: string | null
  created_at: string
  updated_at: string
}

export interface ExternalLink {
  id: string
  user_id: string
  platform: 'zoom' | 'whatsapp' | 'linkedin' | 'google_scholar' | 'youtube' | 'calendly' | 'website' | 'other'
  url: string
  label: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

// =============================================================================
// MENTOR & MENTEE TYPES
// =============================================================================

export interface Mentor {
  id: string
  user_id: string
  expertise_categories: string[]
  interests: string[]
  experience_years: number
  availability: string
  languages: string[]
  preferred_communication: string[]
  who_can_mentor: string[]
  how_mentor: string[]
  weekly_availability_hours: number
  max_mentees: number
  current_mentees_count: number
  total_mentees_count: number
  completed_mentorships_count: number
  success_stories_count: number
  publications_count: number
  rating_average: number
  rating_count: number
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Mentee {
  id: string
  user_id: string
  goals: string | null
  preferred_categories: string[]
  background: string | null
  created_at: string
  updated_at: string
}

export interface AvailabilitySlot {
  id: string
  mentor_id: string
  day_of_week: number // 0=Sunday, 6=Saturday
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// MENTORSHIP TYPES
// =============================================================================

export type MentorshipStatus = 
  | 'pending' 
  | 'accepted' 
  | 'declined' 
  | 'active' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'

export interface MentorshipRequest {
  id: string
  mentee_id: string
  mentor_id: string
  category: string
  message: string | null
  goals: string | null
  background: string | null
  preferred_frequency: string | null
  status: MentorshipStatus
  mentor_response: string | null
  accepted_at: string | null
  declined_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface MentorshipSession {
  id: string
  mentorship_request_id: string
  session_number: number
  scheduled_at: string | null
  completed_at: string | null
  duration_minutes: number | null
  session_notes: string | null
  mentor_notes: string | null
  mentee_notes: string | null
  topics_covered: string[]
  action_items: string[]
  created_at: string
  updated_at: string
}

export interface MentorshipMilestone {
  id: string
  mentorship_request_id: string
  title: string
  description: string | null
  target_date: string | null
  completed_at: string | null
  is_completed: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface MentorshipOutcome {
  id: string
  mentorship_request_id: string
  goals_achieved: string[]
  skills_gained: string[]
  mentor_reflection: string | null
  mentee_reflection: string | null
  impact_rating: number | null
  would_recommend: boolean | null
  created_at: string
  updated_at: string
}

// =============================================================================
// REVIEW TYPES
// =============================================================================

export interface Review {
  id: string
  mentor_id: string
  mentee_id: string
  rating: number
  feedback: string | null
  created_at: string
}

// =============================================================================
// KNOWLEDGE SHARING TYPES
// =============================================================================

export interface Publication {
  id: string
  user_id: string
  title: string
  abstract: string | null
  authors: string[]
  publication_date: string | null
  journal_or_conference: string | null
  doi: string | null
  external_url: string | null
  file_url: string | null
  file_size_bytes: number | null
  tags: string[]
  views_count: number
  downloads_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface SuccessStory {
  id: string
  user_id: string
  mentorship_request_id: string | null
  title: string
  content: string
  excerpt: string | null
  cover_image_url: string | null
  tags: string[]
  is_featured: boolean
  is_published: boolean
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

export type MediaType = 'video' | 'audio' | 'image'

export interface MediaPost {
  id: string
  user_id: string
  title: string
  description: string | null
  media_type: MediaType
  media_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  file_size_bytes: number | null
  tags: string[]
  views_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ResourceType = 'document' | 'slides' | 'template' | 'guide' | 'other'

export interface Resource {
  id: string
  user_id: string
  title: string
  description: string | null
  resource_type: ResourceType
  file_url: string
  file_name: string
  file_size_bytes: number | null
  category_id: string | null
  tags: string[]
  downloads_count: number
  is_public: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// ACTIVITY & NOTIFICATION TYPES
// =============================================================================

export type ActivityType = 
  | 'mentor_joined'
  | 'mentee_joined'
  | 'mentorship_started'
  | 'mentorship_completed'
  | 'publication_shared'
  | 'success_story_shared'
  | 'milestone_reached'
  | 'resource_shared'

export interface ActivityFeed {
  id: string
  user_id: string
  activity_type: ActivityType
  title: string
  description: string | null
  metadata: Json
  related_user_id: string | null
  related_entity_type: string | null
  related_entity_id: string | null
  is_public: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

// =============================================================================
// EXTENDED TYPES WITH RELATIONS
// =============================================================================

export interface MentorWithUser extends Mentor {
  user: User
  availability_slots?: AvailabilitySlot[]
}

export interface MenteeWithUser extends Mentee {
  user: User
}

export interface MentorshipRequestWithDetails extends MentorshipRequest {
  mentor?: MentorWithUser
  mentee?: MenteeWithUser
  sessions?: MentorshipSession[]
  milestones?: MentorshipMilestone[]
  outcome?: MentorshipOutcome
}

export interface PublicationWithUser extends Publication {
  user: Pick<User, 'id' | 'name' | 'avatar_url' | 'current_position' | 'organization'>
}

export interface SuccessStoryWithUser extends SuccessStory {
  user: Pick<User, 'id' | 'name' | 'avatar_url' | 'current_position' | 'organization'>
}

export interface ActivityFeedWithUser extends ActivityFeed {
  user: Pick<User, 'id' | 'name' | 'avatar_url'>
  related_user?: Pick<User, 'id' | 'name' | 'avatar_url'>
}

// =============================================================================
// PROFILE TYPES (Complete user profile with all relations)
// =============================================================================

export interface CompleteProfile {
  user: User
  education: Education[]
  experience: Experience[]
  certifications: Certification[]
  external_links: ExternalLink[]
  mentor?: MentorWithUser
  mentee?: Mentee
  publications: Publication[]
  success_stories: SuccessStory[]
  media_posts: MediaPost[]
  resources: Resource[]
}

// =============================================================================
// FORM INPUT TYPES
// =============================================================================

export interface CreateEducationInput {
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
  location?: string | null
  grade?: string | null
}

export interface CreateExperienceInput {
  company: string
  title: string
  employment_type?: string | null
  location?: string | null
  is_current: boolean
  start_date: string
  end_date?: string | null
  description?: string | null
  skills?: string[]
}

export interface CreateCertificationInput {
  name: string
  issuing_organization: string
  issue_date: string
  expiration_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
}

export interface CreatePublicationInput {
  title: string
  abstract?: string | null
  authors: string[]
  publication_date?: string | null
  journal_or_conference?: string | null
  doi?: string | null
  external_url?: string | null
  file?: File
  tags?: string[]
}

export interface CreateSuccessStoryInput {
  title: string
  content: string
  excerpt?: string | null
  cover_image?: File
  mentorship_request_id?: string | null
  tags?: string[]
  is_featured?: boolean
}

export interface CreateMentorshipSessionInput {
  mentorship_request_id: string
  session_number: number
  scheduled_at?: string | null
  completed_at?: string | null
  duration_minutes?: number | null
  session_notes?: string | null
  mentor_notes?: string | null
  mentee_notes?: string | null
  topics_covered?: string[]
  action_items?: string[]
}

export interface CreateMilestoneInput {
  mentorship_request_id: string
  title: string
  description?: string | null
  target_date?: string | null
}

export interface UpdateProfileInput {
  name?: string
  bio?: string
  country?: string | null
  city?: string | null
  current_position?: string | null
  organization?: string | null
  languages?: string[]
  timezone?: string
  phone?: string | null
  linkedin_url?: string | null
  website_url?: string | null
}

export interface UpdateMentorProfileInput {
  expertise_categories?: string[]
  interests?: string[]
  experience_years?: number
  availability?: string
  languages?: string[]
  preferred_communication?: string[]
  who_can_mentor?: string[]
  how_mentor?: string[]
  weekly_availability_hours?: number
  max_mentees?: number
}

export interface UpdateMenteeProfileInput {
  goals?: string | null
  preferred_categories?: string[]
  background?: string | null
}

// =============================================================================
// SEARCH & FILTER TYPES
// =============================================================================

export interface MentorSearchFilters {
  categories?: string[]
  countries?: string[]
  languages?: string[]
  availability?: string
  experience_years_min?: number
  rating_min?: number
  has_availability?: boolean
  search_query?: string
}

export interface PublicationSearchFilters {
  tags?: string[]
  search_query?: string
  date_from?: string
  date_to?: string
}

export interface SuccessStorySearchFilters {
  tags?: string[]
  is_featured?: boolean
  search_query?: string
}

// =============================================================================
// DASHBOARD STATS TYPES
// =============================================================================

export interface MentorDashboardStats {
  active_mentorships: number
  pending_requests: number
  completed_mentorships: number
  total_sessions: number
  avg_rating: number
  total_reviews: number
  publications_count: number
  success_stories_count: number
  resources_shared: number
}

export interface MenteeDashboardStats {
  active_mentorships: number
  pending_requests: number
  completed_mentorships: number
  total_sessions: number
  milestones_completed: number
  milestones_pending: number
  resources_saved: number
}

export interface AdminDashboardStats {
  total_users: number
  total_mentors: number
  total_mentees: number
  active_mentorships: number
  completed_mentorships: number
  pending_verifications: number
  total_publications: number
  total_success_stories: number
  recent_activities: ActivityFeed[]
}

// =============================================================================
// SUPABASE DATABASE TYPE
// =============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      education: {
        Row: Education
        Insert: Omit<Education, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
      }
      experience: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
      }
      certifications: {
        Row: Certification
        Insert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
      }
      external_links: {
        Row: ExternalLink
        Insert: Omit<ExternalLink, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ExternalLink, 'id' | 'created_at' | 'updated_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      mentors: {
        Row: Mentor
        Insert: Omit<Mentor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Mentor, 'id' | 'created_at' | 'updated_at'>>
      }
      mentees: {
        Row: Mentee
        Insert: Omit<Mentee, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Mentee, 'id' | 'created_at' | 'updated_at'>>
      }
      availability_slots: {
        Row: AvailabilitySlot
        Insert: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at'>>
      }
      mentorship_requests: {
        Row: MentorshipRequest
        Insert: Omit<MentorshipRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MentorshipRequest, 'id' | 'created_at' | 'updated_at'>>
      }
      mentorship_sessions: {
        Row: MentorshipSession
        Insert: Omit<MentorshipSession, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MentorshipSession, 'id' | 'created_at' | 'updated_at'>>
      }
      mentorship_milestones: {
        Row: MentorshipMilestone
        Insert: Omit<MentorshipMilestone, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MentorshipMilestone, 'id' | 'created_at' | 'updated_at'>>
      }
      mentorship_outcomes: {
        Row: MentorshipOutcome
        Insert: Omit<MentorshipOutcome, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MentorshipOutcome, 'id' | 'created_at' | 'updated_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      publications: {
        Row: Publication
        Insert: Omit<Publication, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Publication, 'id' | 'created_at' | 'updated_at'>>
      }
      success_stories: {
        Row: SuccessStory
        Insert: Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SuccessStory, 'id' | 'created_at' | 'updated_at'>>
      }
      media_posts: {
        Row: MediaPost
        Insert: Omit<MediaPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MediaPost, 'id' | 'created_at' | 'updated_at'>>
      }
      resources: {
        Row: Resource
        Insert: Omit<Resource, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>
      }
      activity_feed: {
        Row: ActivityFeed
        Insert: Omit<ActivityFeed, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityFeed, 'id' | 'created_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
    }
  }
}
