"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import { MENTORSHIP_CATEGORIES } from "@/lib/constants";

type Props = { className?: string };

export function MenteeOnboardingForm({ className = "" }: Props) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [goals, setGoals] = useState("");
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferredCategories.length === 0) {
      setError("Please select at least one area you'd like mentorship in.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const supabase = await getSupabaseClientAsync();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("You must be logged in."); setLoading(false); return; }

      // Update user profile with country
      if (country.trim()) {
        await supabase.from("users").update({ country: country.trim() }).eq("id", user.id);
      }

      // Create or update mentee row
      const { error: insertError } = await supabase.from("mentees").insert({
        user_id: user.id,
        goals: goals.trim() || null,
        preferred_categories: preferredCategories,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          const { error: updateError } = await supabase
            .from("mentees")
            .update({
              goals: goals.trim() || null,
              preferred_categories: preferredCategories,
            })
            .eq("user_id", user.id);
          if (updateError) throw updateError;
        } else {
          throw insertError;
        }
      }

      router.push("/dashboard/mentee");
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
          placeholder="e.g. Ethiopia, Kenya, Nigeria"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input mt-1"
        />
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-earth-700">
          What do you hope to achieve? <span className="font-normal text-earth-500">(optional)</span>
        </label>
        <textarea
          id="goals"
          rows={2}
          placeholder="e.g. Get into a good university, transition to a tech career, start a business…"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="input mt-1"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-earth-700">
          Areas you want mentorship in <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 mb-2 text-xs text-earth-500">Select all that apply.</p>
        <div className="flex flex-wrap gap-2">
          {MENTORSHIP_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                preferredCategories.includes(cat)
                  ? "border-primary-500 bg-primary-50 text-primary-800"
                  : "border-earth-300 bg-white text-earth-700 hover:border-primary-300"
              }`}
            >
              <input
                type="checkbox"
                checked={preferredCategories.includes(cat)}
                onChange={() => setPreferredCategories(toggle(preferredCategories, cat))}
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving…" : "Find My Mentor →"}
      </button>
    </form>
  );
}
