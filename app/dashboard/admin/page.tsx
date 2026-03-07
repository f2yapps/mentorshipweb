import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { AdminStats } from "@/components/dashboard/AdminStats";
import { AdminUsersList } from "@/components/dashboard/AdminUsersList";
import { AdminMentorsList } from "@/components/dashboard/AdminMentorsList";

export default async function AdminDashboardPage() {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalMentees },
    { count: totalMentors },
    { count: requestsCount },
    { count: usersCount },
    { count: newMenteesCount },
    { count: newMentorsCount },
    { count: activeMenteesCount },
  ] = await Promise.all([
    supabase.from("mentees").select("id", { count: "exact", head: true }),
    supabase.from("mentors").select("id", { count: "exact", head: true }),
    supabase.from("mentorship_requests").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("mentees").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabase.from("mentors").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    // Active mentees = mentee users who visited their dashboard in last 30 days (last_active_at)
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "mentee")
      .gte("last_active_at", thirtyDaysAgo),
  ]);

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, role, country, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: mentorsRaw } = await supabase
    .from("mentors")
    .select("id, user_id, expertise_categories, verified, users(name, email)")
    .order("created_at", { ascending: false })
    .limit(50);

  // Normalize: Supabase relation can return users as object or array
  const mentors = (mentorsRaw ?? []).map((m) => {
    const usersField: unknown = (m as { users?: unknown }).users;
    const user: { name: string; email: string } | null = Array.isArray(usersField)
      ? (usersField[0] ?? null) as { name: string; email: string } | null
      : (usersField as { name: string; email: string } | null) ?? null;
    return { id: m.id, user_id: m.user_id, expertise_categories: m.expertise_categories, verified: m.verified, users: user };
  });

  return (
    <div>
      <h1 className="section-heading">Admin Dashboard</h1>
      <p className="mt-2 text-earth-600">
        Platform statistics and user management.
      </p>

      <AdminStats
        usersCount={usersCount ?? 0}
        mentorsCount={totalMentors ?? 0}
        menteesCount={totalMentees ?? 0}
        activeMenteesCount={activeMenteesCount ?? 0}
        requestsCount={requestsCount ?? 0}
        newMenteesCount={newMenteesCount ?? 0}
        newMentorsCount={newMentorsCount ?? 0}
        className="mt-8"
      />

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Recent users</h2>
        <AdminUsersList users={users ?? []} className="mt-4" />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Mentors (approve / flag)</h2>
        <AdminMentorsList mentors={mentors ?? []} className="mt-4" />
      </section>
    </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
