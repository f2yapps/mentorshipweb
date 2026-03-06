/**
 * Mentor matching scoring algorithm.
 * Computes a 0-100 compatibility score between a mentee and each mentor
 * using category overlap, experience, location, and profile quality signals.
 * No external AI API required — explanations are generated from templates.
 */

export type MenteeProfile = {
  preferred_categories: string[];
  goals: string | null;
  country: string | null;
};

export type MentorForMatching = {
  id: string;
  user_id: string;
  expertise_categories: string[] | null;
  experience_years: number | null;
  availability: string | null;
  languages: string[] | null;
  verified: boolean;
  users: {
    name: string;
    country: string | null;
    bio: string | null;
    current_position: string | null;
    organization: string | null;
  } | null;
};

export type MatchedMentor = MentorForMatching & {
  score: number;
  matchedCategories: string[];
  explanation: string;
};

function categoryOverlapScore(
  menteeCategories: string[],
  mentorCategories: string[]
): { score: number; matched: string[] } {
  if (menteeCategories.length === 0 || mentorCategories.length === 0) {
    return { score: 0, matched: [] };
  }
  const mentorSet = new Set(mentorCategories.map((c) => c.toLowerCase()));
  const matched = menteeCategories.filter((c) =>
    mentorSet.has(c.toLowerCase())
  );
  const score = (matched.length / menteeCategories.length) * 50;
  return { score, matched };
}

function experienceScore(years: number | null): number {
  if (!years || years < 1) return 0;
  if (years <= 2) return 5;
  if (years <= 5) return 10;
  return 15;
}

function countryScore(
  menteeCountry: string | null,
  mentorCountry: string | null
): number {
  if (!menteeCountry || !mentorCountry) return 0;
  return menteeCountry.toLowerCase().trim() ===
    mentorCountry.toLowerCase().trim()
    ? 10
    : 0;
}

function availabilityScore(availability: string | null): number {
  if (!availability) return 0;
  const lower = availability.toLowerCase();
  if (
    lower.includes("not available") ||
    lower.includes("unavailable") ||
    lower === "none"
  ) {
    return 0;
  }
  return 5;
}

function profileScore(mentor: MentorForMatching): number {
  let s = 0;
  if (mentor.verified) s += 5;
  if (mentor.users?.bio) s += 5;
  // English is the platform language — having any languages listed is a proxy
  if (
    mentor.languages &&
    mentor.languages.length > 0 &&
    mentor.languages.some(
      (l) => l.toLowerCase().includes("english") || l.toLowerCase() === "en"
    )
  ) {
    s += 10;
  }
  return s;
}

function buildExplanation(
  mentee: MenteeProfile,
  mentor: MentorForMatching,
  matched: string[],
  score: number
): string {
  const name = mentor.users?.name ?? "This mentor";
  const parts: string[] = [];

  if (matched.length > 0) {
    const cats = matched.slice(0, 3).join(", ");
    parts.push(
      `Expertise aligns with your interest${matched.length > 1 ? "s" : ""} in ${cats}`
    );
  }

  const yrs = mentor.experience_years;
  if (yrs && yrs >= 3) {
    parts.push(`${yrs}+ years of experience`);
  } else if (yrs && yrs >= 1) {
    parts.push(`${yrs} year${yrs > 1 ? "s" : ""} of experience`);
  }

  if (mentee.country && mentor.users?.country) {
    const same =
      mentee.country.toLowerCase().trim() ===
      mentor.users.country.toLowerCase().trim();
    if (same) parts.push(`based in the same country as you`);
  }

  if (mentor.verified) parts.push(`verified mentor`);

  if (mentor.availability) {
    const lower = mentor.availability.toLowerCase();
    if (!lower.includes("not available") && !lower.includes("unavailable")) {
      parts.push(`available ${mentor.availability}`);
    }
  }

  if (parts.length === 0) {
    return `${name} could be a good fit based on their profile.`;
  }

  const scoreLabel =
    score >= 80
      ? "Excellent match"
      : score >= 60
      ? "Strong match"
      : score >= 40
      ? "Good match"
      : "Potential match";

  return `${scoreLabel}: ${parts.join(", ")}.`;
}

export function scoreMentors(
  mentee: MenteeProfile,
  mentors: MentorForMatching[]
): MatchedMentor[] {
  return mentors
    .map((mentor) => {
      const { score: catScore, matched } = categoryOverlapScore(
        mentee.preferred_categories ?? [],
        mentor.expertise_categories ?? []
      );
      const expScore = experienceScore(mentor.experience_years);
      const cScore = countryScore(mentee.country, mentor.users?.country ?? null);
      const avScore = availabilityScore(mentor.availability);
      const profScore = profileScore(mentor);

      const total = Math.round(
        Math.min(100, catScore + expScore + cScore + avScore + profScore)
      );

      return {
        ...mentor,
        score: total,
        matchedCategories: matched,
        explanation: buildExplanation(mentee, mentor, matched, total),
      };
    })
    .sort((a, b) => b.score - a.score);
}
