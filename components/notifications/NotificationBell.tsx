"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSupabaseClientAsync } from "@/lib/supabase/client";

type Props = { userId: string | null };

export function NotificationBell({ userId }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    const fetchCount = async () => {
      const supabase = await getSupabaseClientAsync();
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("read_at", null);
      setUnreadCount(count ?? 0);
    };
    fetchCount();
  }, [userId]);

  if (!userId) return null;

  return (
    <Link
      href="/notifications"
      className="relative rounded-lg p-2 text-earth-600 hover:bg-earth-100 hover:text-earth-900"
      aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
    >
      <span className="text-lg" aria-hidden>🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
