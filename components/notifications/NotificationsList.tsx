"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  created_at: string;
};

type Props = { notifications: Notification[]; userId: string };

export function NotificationsList({ notifications: initial, userId }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initial);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const markAsRead = async (id: string) => {
    const supabase = await getSupabaseClientAsync();
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  // Accept or decline a mentor_interest directly from the notification
  const handleInterestAction = async (
    notifId: string,
    interestId: string,
    status: "accepted" | "declined"
  ) => {
    setActionPending(notifId + status);
    setActionError(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error } = await supabase
        .from("mentor_interests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", interestId);
      if (error) throw error;
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notifId)
        .eq("user_id", userId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notifId ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      router.refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionPending(null);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-2">
      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {actionError}
        </div>
      )}
      {notifications.map((n) => {
        const isUnread = !n.read_at;
        const isMentorInterest = n.type === "mentor_interest" && !!n.related_entity_id;

        return (
          <div
            key={n.id}
            className={`rounded-xl border p-4 transition-colors ${
              isUnread ? "border-primary-200 bg-primary-50/60" : "border-earth-100 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {isUnread && (
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  )}
                  <p className="font-medium text-earth-900">{n.title}</p>
                </div>
                {n.body && (
                  <p className="mt-0.5 text-sm text-earth-600">{n.body}</p>
                )}
                <p className="mt-1 text-xs text-earth-400">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              {isUnread && !isMentorInterest && (
                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className="shrink-0 text-xs text-primary-600 hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {/* Mentor showed interest in mentee — accept or decline directly */}
              {isMentorInterest && isUnread && (
                <>
                  <button
                    type="button"
                    disabled={!!actionPending}
                    onClick={() => handleInterestAction(n.id, n.related_entity_id!, "accepted")}
                    className="btn-primary text-sm disabled:opacity-60"
                  >
                    {actionPending === n.id + "accepted" ? "Accepting…" : "Accept"}
                  </button>
                  <button
                    type="button"
                    disabled={!!actionPending}
                    onClick={() => handleInterestAction(n.id, n.related_entity_id!, "declined")}
                    className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
                  >
                    {actionPending === n.id + "declined" ? "Declining…" : "Decline"}
                  </button>
                </>
              )}

              {/* Mentor interest already responded to */}
              {isMentorInterest && !isUnread && (
                <Link href="/dashboard/mentee" className="text-xs text-earth-500 hover:underline">
                  View in dashboard →
                </Link>
              )}

              {/* New mentorship request — link mentor to dashboard to accept/decline there */}
              {n.type === "mentorship_request" && (
                <Link href="/dashboard/mentor" className="btn-secondary text-sm">
                  View & Respond in Dashboard →
                </Link>
              )}

              {/* Mentorship accepted — link mentee to their dashboard */}
              {n.type === "mentorship_accepted" && (
                <Link href="/dashboard/mentee" className="btn-secondary text-sm">
                  View Dashboard →
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
