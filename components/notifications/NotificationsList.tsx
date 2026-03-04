"use client";

import { useRouter } from "next/navigation";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
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

type Props = { notifications: Notification[]; userId: string };

export function NotificationsList({ notifications, userId }: Props) {
  const router = useRouter();

  const markAsRead = async (id: string) => {
    const supabase = await getSupabaseClientAsync();
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
    router.refresh();
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
        No notifications yet.
      </div>
    );
  }

  return (
    <ul className="mt-6 space-y-2">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`rounded-xl border p-4 ${n.read_at ? "border-earth-100 bg-white" : "border-primary-200 bg-primary-50/50"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-earth-900">{n.title}</p>
              {n.body && <p className="mt-0.5 text-sm text-earth-600">{n.body}</p>}
              <p className="mt-1 text-xs text-earth-500">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {n.related_entity_type === "mentorship_request" && n.related_entity_id && (
                <Link
                  href="/dashboard/mentor"
                  className="btn-secondary text-xs"
                >
                  View
                </Link>
              )}
              {!n.read_at && (
                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
