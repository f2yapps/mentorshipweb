"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import { MENTORSHIP_CATEGORIES, LANGUAGES } from "@/lib/constants";

type Props = { className?: string };

export function MentorOnboardingForm({ className = "" }: Props) {
  const router = useRouter();

  // Core fields
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [expertiseCategories, setExpertiseCategories] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [availability, setAvailability] = useState("flexible");
  const [languages, setLanguages] = useState<string[]>(["English"]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertiseCategories.length === 0) {
      setError("Please select at least one area of expertise.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const supabase = await getSupabaseClientAsync();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("You must be logged in."); setLoading(false); return; }

      // Update user profile with country + bio
      await supabase.from("users").update({
        ...(country.trim() && { country: country.trim() }),
        ...(bio.trim() && { bio: bio.trim() }),
      }).eq("id", user.id);

      // Create or update mentor row — verified: true so they appear immediately
      const mentorData = {
        user_id: user.id,
        expertise_categories: expertiseCategories,
        experience_years: experienceYears,
        availability,
        languages: languages.length ? languages : ["English"],
        verified: true,
      };

      const { error: insertError } = await supabase.from("mentors").insert(mentorData);

      if (insertError) {
        if (insertError.code === "23505") {
          // Already exists — update
          const { error: updateError } = await supabase
            .from("mentors")
            .update({
              expertise_categories: expertiseCategories,
              experience_years: experienceYears,
              availability,
              languages: languages.length ? languages : ["English"],
            })
            .eq("user_id", user.id);
          if (updateError) throw updateError;
        } else {
          throw insertError;
        }
      }

      router.push("/dashboard/mentor");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-earth-700">
          Your country
        </label>
        <input
          id="country"
          type="text"
          placeholder="e.g. United States, Canada, Germany"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input mt-1"
        />
        <p className="mt-1 text-xs text-earth-500">Shown on your mentor card so scholars know where you're based.</p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-earth-700">
          Short bio
        </label>
        <textarea
          id="bio"
          rows={2}
          placeholder="e.g. Software engineer at Google with 8 years experience. Passionate about helping students break into tech."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="input mt-1"
        />
        <p className="mt-1 text-xs text-earth-500">1–2 sentences. Shown on your mentor card.</p>
      </div>

      {/* Expertise categories */}
      <div>
        <label className="block text-sm font-medium text-earth-700">
          Areas of expertise <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 mb-2 text-xs text-earth-500">Pick the areas you can best guide scholars in.</p>
        <div className="flex flex-wrap gap-2">
          {MENTORSHIP_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                expertiseCategories.includes(cat)
                  ? "border-primary-500 bg-primary-50 text-primary-800"
                  : "border-earth-300 bg-white text-earth-700 hover:border-primary-300"
              }`}
            >
              <input
                type="checkbox"
                checked={expertiseCategories.includes(cat)}
                onChange={() => setExpertiseCategories(toggle(expertiseCategories, cat))}
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Experience + Availability side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-earth-700">
            Years of experience
          </label>
          <input
            id="experience"
            type="number"
            min={0}
            max={50}
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-earth-700">
            Availability
          </label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="input mt-1"
          >
            <option value="flexible">Flexible</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
            <option value="limited">Limited (a few hours/week)</option>
          </select>
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-earth-700">
          Languages you can mentor in
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                languages.includes(lang)
                  ? "border-primary-500 bg-primary-50 text-primary-800"
                  : "border-earth-300 bg-white text-earth-700 hover:border-primary-300"
              }`}
            >
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => setLanguages(toggle(languages, lang))}
                className="sr-only"
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving…" : "Join as Mentor →"}
      </button>
    </form>
  );
}
