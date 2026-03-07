/**
 * Mentor scoring for mentee dashboard recommendations.
 */

export type MentorForMatching = {
  id: string;
  expertise_categories: string[];
  languages: string[] | null;
  experience_years: number | null;
  [key: string]: unknown;
};

export type MatchedMentor = MentorForMatching & { score: number; matchReasons: string[] };

export function scoreMentors(
  mentors: MentorForMatching[],
  preferredCategories: string[] | null,
  goals: string | null
): MatchedMentor[] {
  const prefs = preferredCategories ?? [];
  const goalLower = (goals ?? "").toLowerCase();
  return mentors
    .map((m) => {
      const reasons: string[] = [];
      let score = 0;
      const categories = m.expertise_categories ?? [];
      for (const c of prefs) {
        if (categories.includes(c)) {
          score += 10;
          reasons.push(`Expertise in ${c}`);
        }
      }
      if (goalLower && categories.some((c) => goalLower.includes(c.toLowerCase()))) {
        score += 5;
        reasons.push("Matches your goals");
      }
      if ((m.languages?.length ?? 0) > 0) score += 2;
      if ((m.experience_years ?? 0) >= 5) score += 3;
      return { ...m, score, matchReasons: reasons };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
