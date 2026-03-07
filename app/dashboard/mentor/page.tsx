import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MentorDashboardRequests } from "@/components/dashboard/MentorDashboardRequests";
import { LayoutDashboard, Users, Calendar, Bell, ArrowRight } from "lucide-react";

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

    await supabase.from("users").update({ last_active_at: new Date().toISOString() }).eq("id", user.id);

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
        id, category, message, status, created_at,
        meeting_link, meeting_provider, meeting_scheduled_at,
        mentees(id, goals, user_id, users(id, name, email))
      `)
      .eq("mentor_id", mentor.id)
      .order("created_at", { ascending: false });

    const requests = (requestsRaw ?? []).map((r) => {
      const menteesField: unknown = (r as { mentees?: unknown }).mentees;
      const mentee = Array.isArray(menteesField) ? menteesField[0] : menteesField;
      const menteeObj = mentee as { id?: string; goals?: string | null; users?: unknown } | null;
      const usersField: unknown = menteeObj?.users ?? null;
      const userRow = Array.isArray(usersField) ? usersField[0] : usersField;
      const u = userRow as { name?: string; email?: string } | null;
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
        menteeGoals: menteeObj?.goals ?? null,
        menteeProfileId: menteeObj?.id ?? null,
      };
    });

    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    const activeMentorships = requests.filter((r) => r.status === "accepted").length;

    const { data: events } = await supabase
      .from("workshop_events")
      .select("id, title, event_date, event_time")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(3);

    return (
      <div className="space-y-8">
        {/* Welcome card */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-6 text-white shadow-soft-lg sm:py-8">
          <p className="text-sm font-medium text-primary-100">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{profile?.name ?? "Mentor"}</h1>
          <p className="mt-2 text-primary-100">
            Thank you for volunteering your time to shape the next generation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/profile" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow transition hover:bg-primary-50">
              My Profile
            </Link>
            <Link href="/mentees" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Browse Mentees <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card-hover flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-earth-900">{activeMentorships}</p>
              <p className="text-sm text-earth-500">Active mentorships</p>
            </div>
          </div>
          <div className="card-hover flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-earth-900">{pendingRequests}</p>
              <p className="text-sm text-earth-500">Pending requests</p>
            </div>
          </div>
          <Link href="/notifications" className="card-hover flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-100 text-earth-600">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth-900">Notifications</p>
              <p className="text-xs text-earth-500">Stay updated</p>
            </div>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Mentorship requests */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-earth-900">Mentorship requests</h2>
            <div className="mt-4">
              <MentorDashboardRequests requests={requests} />
            </div>
          </section>

          {/* Sidebar: expressed interests + upcoming events */}
          <div className="space-y-8">
            {expressedInterests.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-earth-900">Mentees I expressed interest in</h2>
                <div className="mt-4 space-y-3">
                  {expressedInterests.slice(0, 5).map((i) => (
                    <div key={i.id} className="card flex items-center justify-between gap-3 p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                          {i.menteeName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-earth-900">{i.menteeName}</p>
                          <p className="text-xs text-earth-500">
                            {new Date(i.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          i.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : i.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-earth-100 text-earth-500"
                        }`}
                      >
                        {i.status === "pending" ? "Pending" : i.status === "accepted" ? "Accepted" : "Declined"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-earth-900">Upcoming events</h2>
              <div className="mt-4 space-y-3">
                {events && events.length > 0 ? (
                  events.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.id}`}
                      className="card-hover block rounded-2xl border border-earth-100 p-4"
                    >
                      <p className="font-medium text-earth-900 line-clamp-1">{ev.title}</p>
                      <p className="mt-1 text-xs text-earth-500">
                        {new Date(ev.event_date + "T" + ev.event_time).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-earth-100 bg-earth-50/50 p-4 text-center text-sm text-earth-500">
                    No upcoming events. <Link href="/events/create" className="text-primary-600 hover:underline">Create one</Link>
                  </div>
                )}
              </div>
              <Link href="/events" className="mt-3 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700">
                View all events →
              </Link>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
