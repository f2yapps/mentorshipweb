import { redirect } from "next/navigation";
import Link from "next/link";
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
    .select("id, name, role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentee") redirect("/dashboard");

  const { data: mentee } = await supabase
    .from("mentees")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentee) redirect("/auth/mentee");

  // Track last active time for admin metrics (fire-and-forget)
  supabase.from("users").update({ last_active_at: new Date().toISOString() }).eq("id", user.id);

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

  const acceptedRequests = requests.filter((r) => r.status === "accepted").length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const pendingInterests = interests.filter((i) => i.status === "pending").length;

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 text-white">
        <p className="text-sm text-primary-100">Welcome back</p>
        <h1 className="text-2xl font-bold">{profile?.name ?? "Scholar"}</h1>
        <p className="mt-1 text-sm text-primary-200">Keep growing — your next breakthrough is one mentorship away.</p>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{acceptedRequests}</p>
          <p className="mt-0.5 text-xs text-earth-500">Active</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingRequests}</p>
          <p className="mt-0.5 text-xs text-earth-500">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{pendingInterests}</p>
          <p className="mt-0.5 text-xs text-earth-500">New Offers</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/mentors" className="btn-primary text-sm">
          Find a Mentor →
        </Link>
        <Link href="/profile" className="btn-secondary text-sm">
          My Profile
        </Link>
        <Link href="/categories" className="btn-ghost text-sm">
          Explore Areas
        </Link>
      </div>

      {pendingInterests > 0 && (
        <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
          🎉 <strong>{pendingInterests} mentor{pendingInterests !== 1 ? "s" : ""}</strong> {pendingInterests !== 1 ? "are" : "is"} interested in mentoring you — scroll down to respond!
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-earth-900">Mentors interested in you</h2>
        <div className="mt-4">
          <MenteeMentorInterests interests={interests} />
        </div>
      </section>

      <section className="mt-8">
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
