import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("notifications")
    .select("id, type, title, body, read_at, related_entity_type, related_entity_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.is("read_at", null);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unreadCount =
    unreadOnly && data
      ? data.length
      : (data ?? []).filter((n) => n.read_at == null).length;

  return NextResponse.json({
    notifications: data ?? [],
    unreadCount: unreadOnly ? (data?.length ?? 0) : unreadCount,
  });
}
