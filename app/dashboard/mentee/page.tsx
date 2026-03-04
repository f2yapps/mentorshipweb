import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MenteeDashboardRequests } from "@/components/dashboard/MenteeDashboardRequests";
import { MenteeMentorInterests } from "@/components/dashboard/MenteeMentorInterests";

export default async function MenteeDashboardPage() {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentee") redirect("/dashboard");

  const { data: mentee } = await supabase
    .from("mentees")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentee) redirect("/auth/mentee");

  const { data: requestsRaw } = await supabase
    .from("mentorship_requests")
    .select(`
      id,
      category,
      message,
      status,
      created_at,
      meeting_link,
      meeting_provider,
      meeting_scheduled_at,
      mentors(id, user_id, users(id, name))
    `)
    .eq("mentee_id", mentee.id)
    .order("created_at", { ascending: false });

  // Normalize: Supabase relations can return as object or array
  const requests = (requestsRaw ?? []).map((r) => {
    const mentorsField: unknown = (r as { mentors?: unknown }).mentors;
    const mentor = Array.isArray(mentorsField) ? mentorsField[0] : mentorsField;
    const usersField: unknown = mentor != null ? (mentor as { users?: unknown }).users : null;
    const user = Array.isArray(usersField) ? usersField[0] : usersField;
    const mentorName = (user as { name?: string } | null)?.name ?? "Mentor";
    return {
      id: r.id,
      category: r.category,
      message: r.message,
      status: r.status,
      created_at: r.created_at,
      meeting_link: (r as { meeting_link?: string | null }).meeting_link ?? null,
      meeting_provider: (r as { meeting_provider?: string | null }).meeting_provider ?? null,
      meeting_scheduled_at: (r as { meeting_scheduled_at?: string | null }).meeting_scheduled_at ?? null,
      mentorName,
    };
  });

  const { data: interestsRaw } = await supabase
    .from("mentor_interests")
    .select("id, status, created_at, mentors(id, users(name))")
    .eq("mentee_id", mentee.id)
    .order("created_at", { ascending: false });

  const interests = (interestsRaw ?? []).map((i) => {
    const m = (i as { mentors?: unknown }).mentors;
    const mentor = Array.isArray(m) ? m[0] : m;
    const u = (mentor as { users?: unknown })?.users;
    const user = Array.isArray(u) ? u[0] : u;
    return {
      id: i.id,
      status: i.status,
      created_at: i.created_at,
      mentorName: (user as { name?: string } | null)?.name ?? "Mentor",
    };
  });

  return (
    <div>
      <h1 className="section-heading">Mentee Dashboard</h1>
      <p className="mt-2 text-earth-600">
        Track your mentorship requests and connect with mentors.
      </p>

      {/* Quick action: Browse mentors */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/mentors"
          className="btn-primary"
        >
          Browse Mentor Directory →
        </a>
        <a
          href="/categories"
          className="btn-secondary"
        >
          Explore Areas
        </a>
        <a
          href="/profile/edit"
          className="rounded-xl border border-earth-200 px-4 py-2 text-sm font-medium text-earth-700 hover:bg-earth-50 transition"
        >
          Edit Profile
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Mentors interested in you</h2>
        <div className="mt-4">
          <MenteeMentorInterests interests={interests} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-earth-900">My Requests</h2>
        <div className="mt-4">
          <MenteeDashboardRequests requests={requests} />
        </div>
      </section>
    </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
