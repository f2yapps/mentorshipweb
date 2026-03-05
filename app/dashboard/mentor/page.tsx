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

  const pending = requests.filter((r) => r.status === "pending").length;
  const accepted = requests.filter((r) => r.status === "accepted").length;
  const declined = requests.filter((r) => r.status === "declined").length;

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 text-white">
        <p className="text-sm text-primary-100">Welcome back</p>
        <h1 className="text-2xl font-bold">{profile?.name ?? "Mentor"}</h1>
        <p className="mt-1 text-sm text-primary-200">Thank you for volunteering your time to shape the next generation.</p>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="mt-0.5 text-xs text-earth-500">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{accepted}</p>
          <p className="mt-0.5 text-xs text-earth-500">Accepted</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-earth-500">{requests.length}</p>
          <p className="mt-0.5 text-xs text-earth-500">Total</p>
        </div>
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

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-earth-900">Mentorship Requests</h2>
        {pending > 0 && (
          <p className="mt-0.5 text-sm text-amber-600">{pending} request{pending !== 1 ? "s" : ""} waiting for your response</p>
        )}
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
