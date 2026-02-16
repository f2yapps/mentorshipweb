"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Academics", "Career", "Life", "Relationships", "Mental Health",
  "Entrepreneurship", "Tech", "Agriculture", "Leadership", "Immigration", "Faith & Purpose",
];
const COMM_OPTIONS = ["chat", "email", "video"];
const LANGUAGES = ["English", "Amharic", "Oromo", "Tigrinya", "French", "Arabic", "Other"];

type Props = { className?: string };

export function MentorOnboardingForm({ className = "" }: Props) {
  const router = useRouter();
  const [expertiseCategories, setExpertiseCategories] = useState<string[]>([]);
  const [interestsText, setInterestsText] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [availability, setAvailability] = useState("flexible");
  const [languages, setLanguages] = useState<string[]>([]);
  const [preferredCommunication, setPreferredCommunication] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertiseCategories.length === 0) {
      setError("Select at least one expertise category.");
      return;
    }
    setError(null);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }
    const mentorData = {
      user_id: user.id,
      expertise_categories: expertiseCategories,
      interests: interestsText.split(",").map((s) => s.trim()).filter(Boolean),
      experience_years: experienceYears,
      availability,
      languages: languages.length ? languages : ["English"],
      preferred_communication: preferredCommunication.length ? preferredCommunication : ["email"],
      verified: false,
    };
    
    const { error: insertError } = await supabase.from("mentors").insert(mentorData);
    
    if (insertError) {
      // If duplicate key error, update instead
      if (insertError.code === '23505') {
        const { error: updateError } = await supabase
          .from("mentors")
          .update({
            expertise_categories: expertiseCategories,
            interests: interestsText.split(",").map((s) => s.trim()).filter(Boolean),
            experience_years: experienceYears,
            availability,
            languages: languages.length ? languages : ["English"],
            preferred_communication: preferredCommunication.length ? preferredCommunication : ["email"],
          })
          .eq("user_id", user.id);
        
        if (updateError) {
          setLoading(false);
          setError(updateError.message);
          return;
        }
      } else {
        setLoading(false);
        setError(insertError.message);
        return;
      }
    }
    
    setLoading(false);
    router.push("/dashboard/mentor");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Expertise categories (select at least one) *
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="inline-flex items-center gap-1 rounded-full border border-earth-300 bg-white px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={expertiseCategories.includes(cat)}
                onChange={() => setExpertiseCategories(toggleArray(expertiseCategories, cat))}
                className="h-4 w-4 rounded text-primary-600"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Additional interests (optional)
        </label>
        <input
          type="text"
          placeholder="e.g. startups, study abroad"
          value={interestsText}
          onChange={(e) => setInterestsText(e.target.value)}
          className="input mt-1"
        />
      </div>

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
          className="input mt-1 w-24"
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

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Languages you can mentor in
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <label key={lang} className="inline-flex items-center gap-1 rounded-full border border-earth-300 bg-white px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => setLanguages(toggleArray(languages, lang))}
                className="h-4 w-4 rounded text-primary-600"
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Preferred communication
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMM_OPTIONS.map((opt) => (
            <label key={opt} className="inline-flex items-center gap-1 rounded-full border border-earth-300 bg-white px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={preferredCommunication.includes(opt)}
                onChange={() =>
                  setPreferredCommunication(toggleArray(preferredCommunication, opt))
                }
                className="h-4 w-4 rounded text-primary-600"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving…" : "Complete profile"}
      </button>
    </form>
  );
}
