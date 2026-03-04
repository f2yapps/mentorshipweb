"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import { toggleArrayItem } from "@/lib/utils";
import { MENTORSHIP_CATEGORIES, LANGUAGES } from "@/lib/constants";

type Props = { className?: string };

export function MentorOnboardingForm({ className = "" }: Props) {
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [expertiseCategories, setExpertiseCategories] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [availability, setAvailability] = useState("flexible");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      const finalLanguages = languages.length ? languages : ["English"];

      const mentorData = {
        user_id: user.id,
        expertise_categories: expertiseCategories,
        experience_years: experienceYears,
        availability,
        languages: finalLanguages,
        verified: true,
      };

      const profileUpdate: Record<string, string> = {};
      if (country.trim()) profileUpdate.country = country.trim();
      if (bio.trim()) profileUpdate.bio = bio.trim();

      // Run user profile update and mentor insert in parallel
      const [, { error: insertError }] = await Promise.all([
        Object.keys(profileUpdate).length > 0
          ? supabase.from("users").update(profileUpdate).eq("id", user.id)
          : Promise.resolve({ error: null, data: null }),
        supabase.from("mentors").insert(mentorData),
      ]);

      if (insertError) {
        if (insertError.code === "23505") {
          const { error: updateError } = await supabase
            .from("mentors")
            .update({ expertise_categories: expertiseCategories, experience_years: experienceYears, availability, languages: finalLanguages })
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
                onChange={() => setExpertiseCategories(toggleArrayItem(expertiseCategories, cat))}
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

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
                onChange={() => setLanguages(toggleArrayItem(languages, lang))}
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
