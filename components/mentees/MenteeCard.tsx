"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Props = {
  id: string;
  name: string;
  country: string | null;
  goals: string | null;
  preferredCategories: string[];
  currentUserRole: "mentor" | "admin";
  mentorId: string | null;
  alreadyInterested: boolean;
};

export function MenteeCard({
  id,
  name,
  country,
  goals,
  preferredCategories,
  currentUserRole,
  mentorId,
  alreadyInterested,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interested, setInterested] = useState(alreadyInterested);
  const [error, setError] = useState<string | null>(null);

  const handleInterested = async () => {
    if (!mentorId) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error: insertError } = await supabase.from("mentor_interests").insert({
        mentor_id: mentorId,
        mentee_id: id,
        status: "pending",
      });
      if (insertError) throw insertError;
      setInterested(true);
      const { data: menteeRow } = await supabase.from("mentees").select("user_id").eq("id", id).single();
      if (menteeRow?.user_id) {
        const notifMsg = "A mentor has expressed interest in mentoring you. Visit your dashboard to accept or decline.";
        await supabase.from("notifications").insert({
          user_id: menteeRow.user_id,
          type: "mentor_interest",
          title: "A mentor is interested in you",
          message: notifMsg,
          body: notifMsg,
          related_entity_type: "mentor_interest",
          related_entity_id: id,
        });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit interest");
    } finally {
      setLoading(false);
    }
  };

  const showInterestedButton = currentUserRole === "mentor" && mentorId && !interested;

  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-earth-900 truncate">{name}</h2>
          {country && <p className="text-sm text-earth-500">📍 {country}</p>}
        </div>
      </div>
      {goals && (
        <p className="mt-3 line-clamp-3 text-sm text-earth-700">{goals}</p>
      )}
      {preferredCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {preferredCategories.slice(0, 4).map((c) => (
            <span
              key={c}
              className="rounded-full bg-earth-100 px-2.5 py-0.5 text-xs text-earth-700"
            >
              {c}
            </span>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {showInterestedButton && (
        <button
          type="button"
          onClick={handleInterested}
          disabled={loading}
          className="btn-primary mt-4 w-full text-sm"
        >
          {loading ? "Sending…" : "Interested to Mentor"}
        </button>
      )}
      {interested && currentUserRole === "mentor" && (
        <p className="mt-4 text-sm text-earth-500">Interest sent. Waiting for mentee response.</p>
      )}
    </article>
  );
}
