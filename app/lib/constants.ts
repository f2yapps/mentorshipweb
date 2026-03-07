/**
 * Platform constants - categories and languages for onboarding and filtering.
 */

export const MENTORSHIP_CATEGORIES = [
  { slug: "academics", name: "Academics" },
  { slug: "career", name: "Career" },
  { slug: "life", name: "Life" },
  { slug: "relationships", name: "Relationships" },
  { slug: "mental-health", name: "Mental Health" },
  { slug: "entrepreneurship", name: "Entrepreneurship" },
  { slug: "tech", name: "Tech" },
  { slug: "agriculture", name: "Agriculture" },
  { slug: "leadership", name: "Leadership" },
  { slug: "immigration", name: "Immigration" },
  { slug: "faith-purpose", name: "Faith & Purpose" },
] as const;

export const LANGUAGES = [
  "English",
  "Amharic",
  "Oromo",
  "Tigrinya",
  "French",
  "Arabic",
  "Spanish",
  "Portuguese",
  "Swahili",
  "Hindi",
  "Mandarin",
  "Other",
] as const;
