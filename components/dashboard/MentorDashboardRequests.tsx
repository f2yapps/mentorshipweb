"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  const updateStatus = async (requestId: string, status: "accepted" | "declined") => {
    await supabase
      .from("mentorship_requests")
      .update({ status })
      .eq("id", requestId);
    router.refresh();
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
        No mentorship requests yet. When mentees send you requests, they will appear here.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {requests.map((r) => (
        <li key={r.id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-earth-900">{r.menteeName}</p>
              {r.menteeEmail && (
                <p className="text-sm text-earth-600">{r.menteeEmail}</p>
              )}
              <p className="mt-1 text-sm text-earth-500">
                Category: {r.category} · {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                r.status === "pending"
                  ? "bg-amber-100 text-amber-800"
                  : r.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : r.status === "declined"
                      ? "bg-earth-100 text-earth-600"
                      : "bg-earth-100 text-earth-600"
              }`}
            >
              {r.status}
            </span>
          </div>
          {r.message && (
            <p className="mt-3 text-sm text-earth-700">{r.message}</p>
          )}
          {r.menteeGoals && (
            <p className="mt-2 text-xs text-earth-500">Goals: {r.menteeGoals}</p>
          )}
          {r.status === "pending" && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => updateStatus(r.id, "accepted")}
                className="btn-primary text-sm"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => updateStatus(r.id, "declined")}
                className="btn-ghost text-sm text-earth-600"
              >
                Decline
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
