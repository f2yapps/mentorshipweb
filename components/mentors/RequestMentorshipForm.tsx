"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  mentorId: string;
  menteeId: string;
  expertiseCategories: string[];
  className?: string;
};

export function RequestMentorshipForm({
  mentorId,
  menteeId,
  expertiseCategories,
  className = "",
}: Props) {
  const router = useRouter();
  const [category, setCategory] = useState(expertiseCategories[0] ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: insertError } = await supabase.from("mentorship_requests").insert({
      mentee_id: menteeId,
      mentor_id: mentorId,
      category,
      message: message || null,
      status: "pending",
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push("/dashboard/mentee");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-earth-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input mt-1"
        >
          {expertiseCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-earth-700">
          Message (optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Introduce yourself and what you hope to get from mentorship."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input mt-1"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
