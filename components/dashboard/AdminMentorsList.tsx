"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Mentor = {
  id: string;
  user_id: string;
  expertise_categories: string[];
  verified: boolean;
  users: { name: string; email: string } | null;
};

type Props = { mentors: Mentor[]; className?: string };

export function AdminMentorsList({ mentors, className = "" }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setVerified = async (mentorId: string, verified: boolean) => {
    if (!verified && !confirm("Unverify this mentor? They will no longer appear as verified.")) return;
    setPendingId(mentorId);
    setError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error: updateError } = await supabase
        .from("mentors")
        .update({ verified })
        .eq("id", mentorId);
      if (updateError) throw updateError;
      setSuccessId(mentorId);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSuccessId(null);
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mentor");
    } finally {
      setPendingId(null);
    }
  };

  if (mentors.length === 0) {
    return (
      <div className="rounded-xl border border-earth-200 bg-earth-50 p-6 text-center text-earth-600">
        No mentors yet.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {mentors.map((m) => {
        const isProcessing = pendingId === m.id;
        const isSuccess = successId === m.id;

        return (
          <div key={m.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold text-earth-900">{m.users?.name ?? "—"}</p>
              <p className="text-sm text-earth-600">{m.users?.email}</p>
              <p className="mt-1 text-xs text-earth-400">
                {m.expertise_categories?.slice(0, 5).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSuccess
                    ? "bg-primary-100 text-primary-800"
                    : m.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isSuccess ? "Saved!" : m.verified ? "Verified" : "Unverified"}
              </span>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setVerified(m.id, !m.verified)}
                className={`text-sm font-medium transition-colors disabled:opacity-50 ${
                  m.verified
                    ? "text-earth-500 hover:text-red-600"
                    : "text-primary-600 hover:text-primary-800"
                }`}
              >
                {isProcessing ? "Saving…" : m.verified ? "Unverify" : "Approve"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
