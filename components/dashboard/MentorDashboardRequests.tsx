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
  meeting_link: string | null;
  meeting_provider: string | null;
  meeting_scheduled_at: string | null;
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
  const [meetingLinkSaving, setMeetingLinkSaving] = useState<string | null>(null);
  const [meetingLinkValue, setMeetingLinkValue] = useState<Record<string, string>>({});
  const [meetingProviderValue, setMeetingProviderValue] = useState<Record<string, string>>({});
  const [meetingScheduledValue, setMeetingScheduledValue] = useState<Record<string, string>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const saveMeeting = async (requestId: string) => {
    const link = meetingLinkValue[requestId]?.trim() || null;
    const provider = meetingProviderValue[requestId]?.trim() || null;
    const scheduled = meetingScheduledValue[requestId]?.trim() || null;
    setMeetingLinkSaving(requestId);
    setActionError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error } = await supabase
        .from("mentorship_requests")
        .update({
          meeting_link: link,
          meeting_provider: provider,
          meeting_scheduled_at: scheduled ? new Date(scheduled).toISOString() : null,
        })
        .eq("id", requestId);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save meeting details");
    } finally {
      setMeetingLinkSaving(null);
    }
  };

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

            {(r.meeting_link || r.meeting_provider || r.meeting_scheduled_at) && (
              <div className="mt-4 border-t border-earth-100 pt-4">
                <p className="text-sm font-medium text-earth-700 mb-1">Virtual meeting</p>
                {r.meeting_provider && (
                  <p className="text-xs text-earth-500 capitalize">{r.meeting_provider.replace(/_/g, " ")}</p>
                )}
                {r.meeting_scheduled_at && (
                  <p className="text-sm text-earth-600">
                    Scheduled: {new Date(r.meeting_scheduled_at).toLocaleString()}
                  </p>
                )}
                {r.meeting_link && (
                  <a
                    href={r.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline break-all"
                  >
                    {r.meeting_link}
                  </a>
                )}
              </div>
            )}

            {r.status === "accepted" && (
              <div className="mt-4 border-t border-earth-100 pt-4">
                <p className="text-sm font-medium text-earth-700 mb-2">Set or update meeting</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-earth-500 mb-0.5">Provider</label>
                    <select
                      value={meetingProviderValue[r.id] ?? r.meeting_provider ?? ""}
                      onChange={(e) => setMeetingProviderValue((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      className="input text-sm"
                    >
                      <option value="">Select</option>
                      <option value="zoom">Zoom</option>
                      <option value="google_meet">Google Meet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-earth-500 mb-0.5">Meeting link (paste or add later)</label>
                    <input
                      type="url"
                      placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                      value={meetingLinkValue[r.id] ?? r.meeting_link ?? ""}
                      onChange={(e) => setMeetingLinkValue((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      className="input flex-1 min-w-0 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-earth-500 mb-0.5">Scheduled at (optional)</label>
                    <input
                      type="datetime-local"
                      value={meetingScheduledValue[r.id] ?? (r.meeting_scheduled_at ? new Date(r.meeting_scheduled_at).toISOString().slice(0, 16) : "")}
                      onChange={(e) => setMeetingScheduledValue((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      className="input text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={meetingLinkSaving === r.id}
                    onClick={() => saveMeeting(r.id)}
                    className="btn-secondary text-sm"
                  >
                    {meetingLinkSaving === r.id ? "Saving…" : "Save meeting"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
