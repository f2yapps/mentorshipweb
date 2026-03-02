/**
 * Shared constants used across the app.
 * These lists must stay in sync — they are used for onboarding, filtering, and display.
 */

export const MENTORSHIP_CATEGORIES = [
  "Academic Success",
  "Artificial Intelligence & ML",
  "Career Development",
  "Cloud Computing & DevOps",
  "Cybersecurity",
  "Data Science & Analytics",
  "Digital Skills",
  "Entrepreneurship",
  "Faith & Purpose",
  "Immigration Support",
  "Leadership & Impact",
  "Personal Development",
  "Software Development",
  "UI/UX Design",
] as const;

export type MentorshipCategory = (typeof MENTORSHIP_CATEGORIES)[number];

export const LANGUAGES = [
  "English",
  "Amharic",
  "Oromo",
  "Tigrinya",
  "Spanish",
  "French",
  "Arabic",
  "Portuguese",
  "Hindi",
  "Swahili",
  "Chinese",
  "Other",
] as const;

export type Language = (typeof LANGUAGES)[number];
