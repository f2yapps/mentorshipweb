/**
 * Database types for Supabase tables.
 * Matches the schema in supabase/schema.sql
 */

export type UserRole = "mentor" | "mentee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mentor {
  id: string;
  user_id: string;
  expertise_categories: string[];
  interests: string[];
  experience_years: number;
  availability: string;
  languages: string[];
  preferred_communication: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Mentee {
  id: string;
  user_id: string;
  goals: string | null;
  preferred_categories: string[];
  background: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export type MentorshipRequestStatus = "pending" | "accepted" | "declined" | "completed";

export interface MentorshipRequest {
  id: string;
  mentee_id: string;
  mentor_id: string;
  category: string;
  message: string | null;
  status: MentorshipRequestStatus;
  created_at: string;
  updated_at: string;
  mentee?: Mentee & { user?: User };
  mentor?: Mentor & { user?: User };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  mentor_id: string;
  mentee_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  mentee?: Mentee & { user?: User };
}

export interface Database {
  public: {
    Tables: {
      users: { Row: User; Insert: Omit<User, "id" | "created_at" | "updated_at"> & { id?: string }; Update: Partial<User> };
      mentors: { Row: Mentor; Insert: Omit<Mentor, "id" | "created_at" | "updated_at"> & { id?: string }; Update: Partial<Mentor> };
      mentees: { Row: Mentee; Insert: Omit<Mentee, "id" | "created_at" | "updated_at"> & { id?: string }; Update: Partial<Mentee> };
      mentorship_requests: { Row: MentorshipRequest; Insert: Omit<MentorshipRequest, "id" | "created_at" | "updated_at"> & { id?: string }; Update: Partial<MentorshipRequest> };
      categories: { Row: Category; Insert: Omit<Category, "id" | "created_at"> & { id?: string }; Update: Partial<Category> };
      reviews: { Row: Review; Insert: Omit<Review, "id" | "created_at"> & { id?: string }; Update: Partial<Review> };
    };
  };
}
