"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Interest = {
  id: string;
  status: string;
  created_at: string;
  mentorName: string;
};

type Props = { interests: Interest[] };

export function MenteeMentorInterests({ interests }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (interestId: string, status: "accepted" | "declined") => {
    setPendingId(interestId);
    setError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error: updateError } = await supabase
        .from("mentor_interests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", interestId);
      if (updateError) throw updateError;
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setPendingId(null);
    }
  };

  const pending = interests.filter((i) => i.status === "pending");
  if (pending.length === 0) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {pending.map((i) => (
        <div key={i.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium text-earth-900">{i.mentorName}</p>
            <p className="text-xs text-earth-500">
              Expressed interest on {new Date(i.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pendingId === i.id}
              onClick={() => updateStatus(i.id, "accepted")}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {pendingId === i.id ? "Saving…" : "Accept"}
            </button>
            <button
              type="button"
              disabled={pendingId === i.id}
              onClick={() => updateStatus(i.id, "declined")}
              className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
