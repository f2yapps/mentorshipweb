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

type MentorInfo = { name: string; profileId: string };
type RequestInfo = { menteeName: string; requestStatus: string };

type Props = {
  notifications: Notification[];
  userId: string;
  mentorInfoMap: Record<string, MentorInfo>;
  requestInfoMap: Record<string, RequestInfo>;
};

export function NotificationsList({
  notifications: initial,
  userId,
  mentorInfoMap,
  requestInfoMap,
}: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initial);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // confirmDecline stores { notifId, entityId } when user clicked "Decline" to show warning
  const [confirmDecline, setConfirmDecline] = useState<{ notifId: string; entityId: string; actionType: "interest" | "request" } | null>(null);
  // acceptedMap: notifId → true when just accepted (to show profile CTA)
  const [acceptedMap, setAcceptedMap] = useState<Record<string, boolean>>({});

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

  // Accept or decline a mentor_interest (mentee side)
  const handleInterestAction = async (
    notifId: string,
    interestId: string,
    status: "accepted" | "declined"
  ) => {
    setActionPending(notifId + status);
    setActionError(null);
    setConfirmDecline(null);
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
      if (status === "accepted") {
        setAcceptedMap((prev) => ({ ...prev, [notifId]: true }));
      }
      router.refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionPending(null);
    }
  };

  // Accept or decline a mentorship_request (mentor side)
  const handleRequestAction = async (
    notifId: string,
    requestId: string,
    status: "accepted" | "declined"
  ) => {
    setActionPending(notifId + status);
    setActionError(null);
    setConfirmDecline(null);
    try {
      const supabase = await getSupabaseClientAsync();
      const { error } = await supabase
        .from("mentorship_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", requestId);
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
      if (status === "accepted") {
        setAcceptedMap((prev) => ({ ...prev, [notifId]: true }));
      }
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
        const isMentorshipRequest = n.type === "mentorship_request" && !!n.related_entity_id;

        // Enriched data
        const mentorInfo = isMentorInterest && n.related_entity_id ? mentorInfoMap[n.related_entity_id] : null;
        const requestInfo = isMentorshipRequest && n.related_entity_id ? requestInfoMap[n.related_entity_id] : null;

        // Was this request already handled before this session?
        const alreadyHandled = !isUnread || (requestInfo && requestInfo.requestStatus !== "pending");

        const isConfirmingDecline =
          confirmDecline?.notifId === n.id;

        const wasJustAccepted = acceptedMap[n.id];

        return (
          <div
            key={n.id}
            className={`rounded-xl border p-4 transition-colors ${
              isUnread ? "border-primary-200 bg-primary-50/60" : "border-earth-100 bg-white"
            }`}
          >
            {/* Header row */}
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
              {isUnread && !isMentorInterest && !isMentorshipRequest && (
                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className="shrink-0 text-xs text-primary-600 hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>

            {/* ── mentor_interest: mentee accepts/declines mentor ── */}
            {isMentorInterest && (
              <div className="mt-3">
                {/* Show mentor profile snippet before action buttons */}
                {mentorInfo && isUnread && !wasJustAccepted && (
                  <div className="mb-3 flex items-center gap-3 rounded-lg bg-earth-50 border border-earth-200 px-3 py-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {mentorInfo.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-earth-900">{mentorInfo.name}</p>
                      <Link
                        href={`/mentors/${mentorInfo.profileId}`}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View full profile →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Decline warning */}
                {isConfirmingDecline && (
                  <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p className="font-semibold mb-1">Are you sure you want to decline?</p>
                    <p className="mb-3">
                      Please be thoughtful before declining. Our mentors generously volunteer their time to support others.
                      Declining may discourage them from offering their help in the future.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!!actionPending}
                        onClick={() =>
                          handleInterestAction(n.id, n.related_entity_id!, "declined")
                        }
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                      >
                        {actionPending === n.id + "declined" ? "Declining…" : "Yes, Decline"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDecline(null)}
                        className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action buttons — unread & not yet accepted */}
                {isUnread && !wasJustAccepted && !isConfirmingDecline && (
                  <div className="flex flex-wrap gap-2">
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
                      onClick={() =>
                        setConfirmDecline({ notifId: n.id, entityId: n.related_entity_id!, actionType: "interest" })
                      }
                      className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {/* Just accepted — show profile CTA */}
                {wasJustAccepted && mentorInfo && (
                  <Link
                    href={`/mentors/${mentorInfo.profileId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition"
                  >
                    View {mentorInfo.name}&apos;s Profile →
                  </Link>
                )}

                {/* Already actioned (read) */}
                {!isUnread && !wasJustAccepted && mentorInfo && (
                  <Link
                    href={`/mentors/${mentorInfo.profileId}`}
                    className="text-xs text-earth-500 hover:underline"
                  >
                    View {mentorInfo.name}&apos;s profile →
                  </Link>
                )}
              </div>
            )}

            {/* ── mentorship_request: mentor accepts/declines mentee ── */}
            {isMentorshipRequest && (
              <div className="mt-3">
                {/* Show mentee info */}
                {requestInfo && isUnread && !wasJustAccepted && requestInfo.requestStatus === "pending" && (
                  <div className="mb-3 flex items-center gap-3 rounded-lg bg-earth-50 border border-earth-200 px-3 py-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {requestInfo.menteeName.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-earth-900">{requestInfo.menteeName}</p>
                  </div>
                )}

                {/* Decline warning for request */}
                {isConfirmingDecline && (
                  <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p className="font-semibold mb-1">Are you sure you want to decline?</p>
                    <p className="mb-3">
                      Declining may discourage this mentee from seeking mentorship again. If you&apos;re busy,
                      consider accepting and scheduling a later date instead.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!!actionPending}
                        onClick={() =>
                          handleRequestAction(n.id, n.related_entity_id!, "declined")
                        }
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                      >
                        {actionPending === n.id + "declined" ? "Declining…" : "Yes, Decline"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDecline(null)}
                        className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Accept/Decline buttons — only if still pending */}
                {isUnread && !wasJustAccepted && !isConfirmingDecline &&
                  requestInfo?.requestStatus === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={!!actionPending}
                      onClick={() => handleRequestAction(n.id, n.related_entity_id!, "accepted")}
                      className="btn-primary text-sm disabled:opacity-60"
                    >
                      {actionPending === n.id + "accepted" ? "Accepting…" : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={!!actionPending}
                      onClick={() =>
                        setConfirmDecline({ notifId: n.id, entityId: n.related_entity_id!, actionType: "request" })
                      }
                      className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-600 hover:bg-earth-50 transition disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {/* Already responded */}
                {requestInfo && requestInfo.requestStatus !== "pending" && !wasJustAccepted && (
                  <Link href="/dashboard/mentor" className="text-xs text-earth-500 hover:underline">
                    View in dashboard →
                  </Link>
                )}

                {/* Just accepted CTA */}
                {wasJustAccepted && (
                  <Link
                    href="/dashboard/mentor"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition"
                  >
                    Go to Dashboard → Schedule a meeting
                  </Link>
                )}

                {/* Already read but was pending when loaded */}
                {!isUnread && !wasJustAccepted && requestInfo?.requestStatus === "pending" && (
                  <Link href="/dashboard/mentor" className="btn-secondary text-sm">
                    View & Respond in Dashboard →
                  </Link>
                )}
              </div>
            )}

            {/* ── mentorship_accepted: mentee's request was accepted ── */}
            {n.type === "mentorship_accepted" && (
              <div className="mt-3">
                <Link href="/dashboard/mentee" className="btn-secondary text-sm">
                  View Dashboard →
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
