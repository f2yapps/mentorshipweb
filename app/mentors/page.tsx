import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MentorDirectoryFilters } from "@/components/mentors/MentorDirectoryFilters";
import { MentorCard } from "@/components/mentors/MentorCard";

export const metadata: Metadata = {
  title: "Find Mentors",
  description:
    "Search and filter volunteer mentors by category, country, and language. Request free mentorship.",
};

type Props = { searchParams: Promise<{ category?: string; country?: string; language?: string }> };

export default async function MentorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("mentors")
    .select("id, user_id, expertise_categories, experience_years, availability, languages, verified, users(id, name, country, bio)")
    .eq("verified", true);

  if (params.category) {
    query = query.contains("expertise_categories", [params.category]);
  }
  if (params.language) {
    query = query.contains("languages", [params.language]);
  }

  const { data: mentors } = await query.order("created_at", { ascending: false });

  let filtered = mentors ?? [];
  if (params.country) {
    filtered = filtered.filter(
      (m: { users?: { country: string | null } }) => m.users?.country === params.country
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">Mentor Directory</h1>
      <p className="mt-4 text-earth-700">
        Browse verified mentors. Filter by category, country, or language, then send a request.
      </p>

      <MentorDirectoryFilters
        currentCategory={params.category}
        currentCountry={params.country}
        currentLanguage={params.language}
        className="mt-8"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((mentor: {
            id: string;
            user_id: string;
            expertise_categories: string[];
            experience_years: number;
            availability: string;
            languages: string[];
            verified: boolean;
            users: { id: string; name: string; country: string | null; bio: string | null } | null;
          }) => (
            <MentorCard
              key={mentor.id}
              id={mentor.id}
              name={mentor.users?.name ?? "Mentor"}
              country={mentor.users?.country ?? undefined}
              bio={mentor.users?.bio ?? undefined}
              expertiseCategories={mentor.expertise_categories}
              experienceYears={mentor.experience_years}
              availability={mentor.availability}
              languages={mentor.languages}
              verified={mentor.verified}
            />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
            No mentors match your filters. Try changing filters or check back later.
          </div>
        )}
      </div>
    </div>
  );
}
