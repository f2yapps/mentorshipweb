"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "Academics", "Career", "Life", "Relationships", "Mental Health",
  "Entrepreneurship", "Tech", "Agriculture", "Leadership", "Immigration", "Faith & Purpose",
];
const LANGUAGES = ["English", "Amharic", "Oromo", "Tigrinya", "French", "Arabic"];

type Props = {
  currentCategory?: string;
  currentCountry?: string;
  currentLanguage?: string;
  className?: string;
};

export function MentorDirectoryFilters({
  currentCategory,
  currentCountry,
  currentLanguage,
  className = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/mentors?${next.toString()}`);
  };

  return (
    <div className={`flex flex-wrap gap-4 rounded-lg border border-earth-200 bg-earth-50 p-4 ${className}`}>
      <div>
        <label className="block text-xs font-medium text-earth-600">Category</label>
        <select
          value={currentCategory ?? ""}
          onChange={(e) => setFilter("category", e.target.value || null)}
          className="input mt-1 w-40 text-sm"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-earth-600">Language</label>
        <select
          value={currentLanguage ?? ""}
          onChange={(e) => setFilter("language", e.target.value || null)}
          className="input mt-1 w-40 text-sm"
        >
          <option value="">All</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-earth-600">Country</label>
        <input
          type="text"
          placeholder="e.g. Ethiopia"
          value={currentCountry ?? ""}
          onChange={(e) => setFilter("country", e.target.value.trim() || null)}
          className="input mt-1 w-40 text-sm"
        />
      </div>
    </div>
  );
}
