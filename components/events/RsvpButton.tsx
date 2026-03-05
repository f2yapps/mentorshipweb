"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Props = {
  eventId: string;
  userId: string | null;
  existing: { id: string; status: string } | null;
};

export function RsvpButton({ eventId, userId, existing }: Props) {
  const router = useRouter();
  const [rsvp, setRsvp] = useState(existing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    return (
      <a href="/auth/login" className="btn-primary">
        Sign in to RSVP
      </a>
    );
  }

  const upsert = async (status: "attending" | "interested") => {
    setLoading(true);
    setError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      if (rsvp) {
        if (rsvp.status === status) {
          // Cancel RSVP
          await supabase.from("event_rsvps").delete().eq("id", rsvp.id);
          setRsvp(null);
        } else {
          // Change status
          const { data } = await supabase
            .from("event_rsvps")
            .update({ status })
            .eq("id", rsvp.id)
            .select("id, status")
            .single();
          if (data) setRsvp(data);
        }
      } else {
        const { data } = await supabase
          .from("event_rsvps")
          .insert({ event_id: eventId, user_id: userId, status })
          .select("id, status")
          .single();
        if (data) setRsvp(data);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => upsert("attending")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
            rsvp?.status === "attending"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "btn-primary"
          }`}
        >
          {rsvp?.status === "attending" ? "✓ Attending (click to cancel)" : "Attend"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => upsert("interested")}
          className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
            rsvp?.status === "interested"
              ? "border-primary-400 bg-primary-50 text-primary-700 hover:bg-primary-100"
              : "border-earth-200 bg-white text-earth-700 hover:bg-earth-50"
          }`}
        >
          {rsvp?.status === "interested" ? "★ Interested (click to cancel)" : "Interested"}
        </button>
      </div>
    </div>
  );
}
