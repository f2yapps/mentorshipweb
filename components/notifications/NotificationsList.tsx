"use client";

import Link from "next/link";

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

type Props = {
  notifications: Notification[];
  userId: string;
  mentorInfoMap: Record<string, { name: string; profileId: string }>;
  requestInfoMap: Record<string, { menteeName: string; requestStatus: string }>;
};

export function NotificationsList({ notifications, mentorInfoMap, requestInfoMap }: Props) {
  if (notifications.length === 0) {
    return (
      <p className="mt-6 text-earth-600">No notifications yet.</p>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {notifications.map((n) => {
        const isUnread = !n.read_at;
        const mentorInfo = n.related_entity_id && n.type === "mentor_interest"
          ? mentorInfoMap[n.related_entity_id]
          : null;
        const requestInfo = n.related_entity_id && n.type === "mentorship_request"
          ? requestInfoMap[n.related_entity_id]
          : null;

        return (
          <li
            key={n.id}
            className={`rounded-xl border p-4 ${isUnread ? "border-primary-200 bg-primary-50/30" : "border-earth-100 bg-white"}`}
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium text-earth-900">{n.title}</p>
              {(n.body || requestInfo?.menteeName) && (
                <p className="text-sm text-earth-600">
                  {n.type === "mentorship_request" && requestInfo
                    ? `${requestInfo.menteeName} – ${requestInfo.requestStatus}`
                    : n.body}
                </p>
              )}
              <p className="text-xs text-earth-400">
                {new Date(n.created_at).toLocaleDateString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              {mentorInfo && (
                <Link
                  href={`/mentors/${mentorInfo.profileId}`}
                  className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline"
                >
                  View {mentorInfo.name}&apos;s profile →
                </Link>
              )}
              {n.type === "mentorship_request" && requestInfo?.requestStatus === "pending" && (
                <Link
                  href="/dashboard/mentor"
                  className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline"
                >
                  Go to dashboard to respond →
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
