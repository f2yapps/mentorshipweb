import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MentorDashboardRequests } from "@/components/dashboard/MentorDashboardRequests";

export default async function MentorDashboardPage() {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentor") redirect("/dashboard");

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentor) redirect("/auth/mentor");

  // Track last active time for admin metrics
  await supabase.from("users").update({ last_active_at: new Date().toISOString() }).eq("id", user.id);

  // Interests this mentor has expressed in mentees
  const { data: interestsRaw } = await supabase
    .from("mentor_interests")
    .select("id, status, created_at, mentees(id, user_id, users(name))")
    .eq("mentor_id", mentor.id)
    .order("created_at", { ascending: false });

  const expressedInterests = (interestsRaw ?? []).map((i) => {
    const m = (i as { mentees?: unknown }).mentees;
    const mentee = Array.isArray(m) ? m[0] : m;
    const menteeObj = mentee as { id?: string; users?: unknown } | null;
    const u = menteeObj?.users;
    const userObj = Array.isArray(u) ? u[0] : u;
    return {
      id: i.id,
      status: i.status,
      created_at: i.created_at,
      menteeName: (userObj as { name?: string } | null)?.name ?? "Mentee",
    };
  });

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
      mentees(id, goals, user_id, users(id, name, email))
    `)
    .eq("mentor_id", mentor.id)
    .order("created_at", { ascending: false });

  const requests = (requestsRaw ?? []).map((r) => {
    const menteesField: unknown = (r as { mentees?: unknown }).mentees;
    const mentee = Array.isArray(menteesField) ? menteesField[0] : menteesField;
    const usersField: unknown = mentee != null ? (mentee as { users?: unknown }).users : null;
    const user = Array.isArray(usersField) ? usersField[0] : usersField;
    const u = user as { name?: string; email?: string } | null;
    const m = mentee as { goals?: string | null } | null;
    return {
      id: r.id,
      category: r.category,
      message: r.message,
      status: r.status,
      created_at: r.created_at,
      meeting_link: (r as { meeting_link?: string | null }).meeting_link ?? null,
      meeting_provider: (r as { meeting_provider?: string | null }).meeting_provider ?? null,
      meeting_scheduled_at: (r as { meeting_scheduled_at?: string | null }).meeting_scheduled_at ?? null,
      menteeName: u?.name ?? "Mentee",
      menteeEmail: u?.email,
      menteeGoals: m?.goals ?? null,
    };
  });

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 text-white">
        <p className="text-sm text-primary-100">Welcome back</p>
        <h1 className="text-2xl font-bold">{profile?.name ?? "Mentor"}</h1>
        <p className="mt-1 text-sm text-primary-200">Thank you for volunteering your time to shape the next generation.</p>
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/profile" className="btn-primary text-sm">
          My Profile
        </Link>
        <Link href="/mentees" className="btn-secondary text-sm">
          Browse Mentees
        </Link>
        <Link href="/mentors" className="btn-ghost text-sm">
          Mentor Directory
        </Link>
      </div>

      {expressedInterests.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-earth-900">Mentees I expressed interest in</h2>
          <div className="mt-4 space-y-3">
            {expressedInterests.map((i) => (
              <div key={i.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                    {i.menteeName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{i.menteeName}</p>
                    <p className="text-xs text-earth-500">
                      {new Date(i.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    i.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : i.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-earth-100 text-earth-500"
                  }`}
                >
                  {i.status === "pending" ? "Awaiting response" : i.status === "accepted" ? "Accepted" : "Declined"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-earth-900">Mentorship Requests</h2>
        <div className="mt-4">
          <MentorDashboardRequests requests={requests} />
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
