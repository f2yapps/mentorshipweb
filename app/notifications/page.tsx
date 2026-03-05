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

    const { data: notifData } = await supabase
      .from("notifications")
      .select("id, type, title, body, read_at, related_entity_type, related_entity_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    const notifications = notifData ?? [];

    // ── Enrich mentor_interest notifications ──────────────────────────────
    // related_entity_id = mentor_interests.id
    const interestIds = notifications
      .filter((n) => n.type === "mentor_interest" && n.related_entity_id)
      .map((n) => n.related_entity_id!);

    // mentorInfoMap: mentor_interests.id → { name, profileId (mentors.id) }
    const mentorInfoMap: Record<string, { name: string; profileId: string }> = {};

    if (interestIds.length > 0) {
      const { data: interests } = await supabase
        .from("mentor_interests")
        .select("id, mentor_id")
        .in("id", interestIds);

      if (interests && interests.length > 0) {
        const mentorIds = interests.map((i) => i.mentor_id);
        const { data: mentors } = await supabase
          .from("mentors")
          .select("id, user_id")
          .in("id", mentorIds);

        if (mentors && mentors.length > 0) {
          const userIds = mentors.map((m) => m.user_id);
          const { data: users } = await supabase
            .from("users")
            .select("id, name")
            .in("id", userIds);

          for (const interest of interests) {
            const mentor = mentors.find((m) => m.id === interest.mentor_id);
            if (mentor) {
              const u = users?.find((u) => u.id === mentor.user_id);
              mentorInfoMap[interest.id] = {
                name: u?.name ?? "A mentor",
                profileId: mentor.id,
              };
            }
          }
        }
      }
    }

    // ── Enrich mentorship_request notifications ───────────────────────────
    // related_entity_id = mentorship_requests.id
    const requestIds = notifications
      .filter((n) => n.type === "mentorship_request" && n.related_entity_id)
      .map((n) => n.related_entity_id!);

    // requestInfoMap: mentorship_requests.id → { menteeName, requestStatus }
    const requestInfoMap: Record<string, { menteeName: string; requestStatus: string }> = {};

    if (requestIds.length > 0) {
      const { data: requests } = await supabase
        .from("mentorship_requests")
        .select("id, mentee_id, status")
        .in("id", requestIds);

      if (requests && requests.length > 0) {
        const menteeIds = requests.map((r) => r.mentee_id);
        const { data: mentees } = await supabase
          .from("mentees")
          .select("id, user_id")
          .in("id", menteeIds);

        if (mentees && mentees.length > 0) {
          const userIds = mentees.map((m) => m.user_id);
          const { data: users } = await supabase
            .from("users")
            .select("id, name")
            .in("id", userIds);

          for (const request of requests) {
            const mentee = mentees.find((m) => m.id === request.mentee_id);
            if (mentee) {
              const u = users?.find((u) => u.id === mentee.user_id);
              requestInfoMap[request.id] = {
                menteeName: u?.name ?? "A mentee",
                requestStatus: request.status,
              };
            }
          }
        }
      }
    }

    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="section-heading">Notifications</h1>
        <NotificationsList
          notifications={notifications}
          userId={user.id}
          mentorInfoMap={mentorInfoMap}
          requestInfoMap={requestInfoMap}
        />
      </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
