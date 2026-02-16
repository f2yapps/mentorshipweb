"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Artificial Intelligence & ML",
  "Software Development",
  "Data Science & Analytics",
  "Career Development",
  "Tech Entrepreneurship",
  "Digital Skills",
  "Academic Success",
  "Personal Development",
  "Cloud Computing & DevOps",
  "Cybersecurity",
  "UI/UX Design",
  "Leadership & Impact",
];

type Props = { className?: string };

export function MenteeOnboardingForm({ className = "" }: Props) {
  const router = useRouter();
  const [goals, setGoals] = useState("");
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [background, setBackground] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferredCategories.length === 0) {
      setError("Select at least one preferred category.");
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
    
    // Try to insert, if it fails due to duplicate, update instead
    const { error: insertError } = await supabase.from("mentees").insert({
      user_id: user.id,
      goals: goals || null,
      preferred_categories: preferredCategories,
      background: background || null,
    });
    
    if (insertError) {
      // If duplicate key error, update instead
      if (insertError.code === '23505') {
        const { error: updateError } = await supabase
          .from("mentees")
          .update({
            goals: goals || null,
            preferred_categories: preferredCategories,
            background: background || null,
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
    router.push("/dashboard/mentee");
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
        <label htmlFor="goals" className="block text-sm font-medium text-earth-700">
          Your goals (optional)
        </label>
        <textarea
          id="goals"
          rows={3}
          placeholder="What do you hope to achieve with a mentor?"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="input mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700">
          Preferred categories (select at least one) *
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="inline-flex items-center gap-1 rounded-full border border-earth-300 bg-white px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={preferredCategories.includes(cat)}
                onChange={() => setPreferredCategories(toggleArray(preferredCategories, cat))}
                className="h-4 w-4 rounded text-primary-600"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="background" className="block text-sm font-medium text-earth-700">
          Brief background (optional)
        </label>
        <textarea
          id="background"
          rows={2}
          placeholder="e.g. student, recent graduate, professional"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="input mt-1"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving…" : "Complete profile"}
      </button>
    </form>
  );
}
