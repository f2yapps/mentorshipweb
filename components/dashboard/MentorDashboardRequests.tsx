"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type RequestRow = {
  id: string;
  category: string;
  message: string | null;
  status: string;
  created_at: string;
  menteeName: string;
  menteeEmail?: string;
  menteeGoals?: string | null;
};

type Props = { requests: RequestRow[] };

export function MentorDashboardRequests({ requests }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const updateStatus = async (requestId: string, status: "accepted" | "declined") => {
    setPendingId(requestId);
    setActionError(null);
    setSuccessId(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error } = await supabase
        .from("mentorship_requests")
        .update({ status })
        .eq("id", requestId);
      if (error) throw error;
      setSuccessId(requestId);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSuccessId(null);
        router.refresh();
      }, 1200);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setPendingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-earth-200 bg-earth-50 p-8 text-center">
        <p className="text-earth-500">No mentorship requests yet.</p>
        <p className="mt-1 text-sm text-earth-400">
          When scholars send you a request it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}
      {requests.map((r) => {
        const isPending = r.status === "pending";
        const isProcessing = pendingId === r.id;
        const isSuccess = successId === r.id;

        return (
          <div key={r.id} className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-earth-900">{r.menteeName}</p>
                {r.menteeEmail && (
                  <p className="text-sm text-earth-500">{r.menteeEmail}</p>
                )}
                <p className="mt-0.5 text-sm text-earth-500">
                  {r.category} · {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isSuccess
                    ? "bg-green-100 text-green-800"
                    : r.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : r.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-earth-100 text-earth-600"
                }`}
              >
                {isSuccess ? "Updated!" : r.status}
              </span>
            </div>

            {r.menteeGoals && (
              <p className="mt-2 text-sm text-earth-600">
                <span className="font-medium">Goals:</span> {r.menteeGoals}
              </p>
            )}

            {r.message && (
              <p className="mt-2 text-sm text-earth-700 border-l-2 border-earth-200 pl-3 italic">
                "{r.message}"
              </p>
            )}

            {isPending && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => updateStatus(r.id, "accepted")}
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  {isProcessing ? "Saving…" : "Accept"}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => updateStatus(r.id, "declined")}
                  className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
