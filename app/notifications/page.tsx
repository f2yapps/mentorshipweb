import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata = {
  title: "Notifications",
  description: "Your notifications",
};

export default async function NotificationsPage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: notifications } = await supabase
      .from("notifications")
      .select("id, type, title, body, read_at, related_entity_type, related_entity_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="section-heading">Notifications</h1>
        <NotificationsList notifications={notifications ?? []} userId={user.id} />
      </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
