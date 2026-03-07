"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Interest = {
  id: string;
  status: string;
  created_at: string;
  mentorName: string;
  mentorProfileId?: string | null;
};

type Props = { interests: Interest[] };

export function MenteeMentorInterests({ interests: initialInterests }: Props) {
  const router = useRouter();
  const [interests, setInterests] = useState(initialInterests);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeclineId, setConfirmDeclineId] = useState<string | null>(null);

  const updateStatus = async (interestId: string, status: "accepted" | "declined") => {
    setPendingId(interestId);
    setConfirmDeclineId(null);
    setError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error: updateError } = await supabase
        .from("mentor_interests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", interestId);
      if (updateError) throw updateError;
      setInterests((prev) =>
        prev.map((i) => (i.id === interestId ? { ...i, status } : i))
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {interests.map((i) => {
        const isPending = i.status === "pending";
        const isAccepted = i.status === "accepted";
        const isConfirmingDecline = confirmDeclineId === i.id;

        return (
          <div key={i.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              {/* Mentor info */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {i.mentorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{i.mentorName}</p>
                    <p className="text-xs text-earth-500">
                      Expressed interest on {new Date(i.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${
                  isPending
                    ? "bg-amber-100 text-amber-700"
                    : isAccepted
                    ? "bg-green-100 text-green-700"
                    : "bg-earth-100 text-earth-500"
                }`}
              >
                {isPending ? "Awaiting your response" : isAccepted ? "Accepted" : "Declined"}
              </span>
            </div>

            {/* Decline warning */}
            {isConfirmingDecline && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold mb-1">Are you sure you want to decline?</p>
                <p className="mb-3">
                  Please be thoughtful before declining. Our mentors generously volunteer their
                  time. Declining may discourage them from helping others in the future.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pendingId === i.id}
                    onClick={() => updateStatus(i.id, "declined")}
                    className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                  >
                    {pendingId === i.id ? "Declining…" : "Yes, Decline"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeclineId(null)}
                    className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {/* View profile always available */}
              {i.mentorProfileId && (
                <Link
                  href={`/mentors/${i.mentorProfileId}`}
                  className="btn-secondary text-sm"
                >
                  View Profile
                </Link>
              )}

              {/* Accept / Decline only for pending */}
              {isPending && !isConfirmingDecline && (
                <>
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
                    onClick={() => setConfirmDeclineId(i.id)}
                    className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
