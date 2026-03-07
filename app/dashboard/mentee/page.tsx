import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MenteeDashboardRequests } from "@/components/dashboard/MenteeDashboardRequests";
import { MenteeMentorInterests } from "@/components/dashboard/MenteeMentorInterests";
import { RecommendedMentors } from "@/components/dashboard/RecommendedMentors";
import { scoreMentors } from "@/lib/mentor-matching";
import type { MentorForMatching } from "@/lib/mentor-matching";
import { LayoutDashboard, Users, Sparkles, Bell, ArrowRight, GraduationCap, Calendar, ExternalLink } from "lucide-react";

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
      .select("id, preferred_categories, goals")
      .eq("user_id", user.id)
      .single();
    if (!mentee) redirect("/auth/mentee");

    supabase.from("users").update({ last_active_at: new Date().toISOString() }).eq("id", user.id);

    const { data: requestsRaw } = await supabase
      .from("mentorship_requests")
      .select(`
        id, category, message, status, created_at,
        meeting_link, meeting_provider, meeting_scheduled_at,
        mentors(id, user_id, users(id, name))
      `)
      .eq("mentee_id", mentee.id)
      .order("created_at", { ascending: false });

    const requests = (requestsRaw ?? []).map((r) => {
      const mentorsField: unknown = (r as { mentors?: unknown }).mentors;
      const mentor = Array.isArray(mentorsField) ? mentorsField[0] : mentorsField;
      const mentorObj = mentor as { id?: string; users?: unknown } | null;
      const usersField: unknown = mentorObj?.users ?? null;
      const userRow = Array.isArray(usersField) ? usersField[0] : usersField;
      const mentorName = (userRow as { name?: string } | null)?.name ?? "Mentor";
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
        mentorProfileId: mentorObj?.id ?? null,
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
      const mentorObj = mentor as { id?: string; users?: unknown } | null;
      const u = mentorObj?.users;
      const userObj = Array.isArray(u) ? u[0] : u;
      return {
        id: i.id,
        status: i.status,
        created_at: i.created_at,
        mentorName: (userObj as { name?: string } | null)?.name ?? "Mentor",
        mentorProfileId: mentorObj?.id ?? null,
      };
    });

    const pendingCount = requests.filter((r) => r.status === "pending").length;
    const acceptedCount = requests.filter((r) => r.status === "accepted").length;
    const pendingInterests = interests.filter((i) => i.status === "pending").length;

    const { data: events } = await supabase
      .from("workshop_events")
      .select("id, title, event_date, event_time")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(3);

    // AI matching: fetch all mentors and score them
    const { data: userProfile } = await supabase
      .from("users")
      .select("country")
      .eq("id", user.id)
      .single();

    const { data: mentorsRaw } = await supabase
      .from("mentors")
      .select(
        "id, user_id, expertise_categories, experience_years, availability, languages, verified, users(name, country, bio, current_position, organization)"
      );

    type UserRow = { name: string; country: string | null; bio: string | null; current_position: string | null; organization: string | null } | null;
    const mentorsForMatching: MentorForMatching[] = (mentorsRaw ?? []).map((m) => {
      const usersField: unknown = (m as { users?: unknown }).users;
      const userRow: UserRow = Array.isArray(usersField)
        ? (usersField[0] ?? null) as UserRow
        : (usersField as UserRow) ?? null;
      return {
        id: m.id,
        user_id: m.user_id,
        expertise_categories: m.expertise_categories,
        experience_years: m.experience_years,
        availability: m.availability,
        languages: m.languages,
        verified: m.verified,
        users: userRow,
      };
    });

    const menteeProfile = {
      preferred_categories: (mentee as { preferred_categories?: string[] }).preferred_categories ?? [],
      goals: (mentee as { goals?: string | null }).goals ?? null,
      country: userProfile?.country ?? null,
    };

    const recommendedMentors = scoreMentors(menteeProfile, mentorsForMatching).slice(0, 5);

    // Scholarship recommendations: match by field_of_study overlap with mentee categories
    let schQuery = supabase
      .from("opportunities")
      .select("id, title, organization, deadline, opportunity_type, funding_type, field_of_study, application_link")
      .eq("is_published", true)
      .order("deadline", { ascending: true, nullsFirst: false })
      .limit(20);

    const { data: allOpps } = await schQuery;

    const menteeCategories = menteeProfile.preferred_categories.map((c) => c.toLowerCase());
    const scoredOpps = (allOpps ?? []).map((opp) => {
      const fields = ((opp as { field_of_study?: string[] }).field_of_study ?? []).map((f) => f.toLowerCase());
      const hasAny = fields.includes("any");
      const overlap = hasAny ? 1 : fields.filter((f) => menteeCategories.some((c) => c.includes(f) || f.includes(c))).length;
      return { ...opp, _score: hasAny ? 0.5 : overlap };
    }).sort((a, b) => (b as { _score: number })._score - (a as { _score: number })._score).slice(0, 4);

    const today = new Date(); today.setHours(0, 0, 0, 0);

    return (
      <div className="space-y-8">
        {/* Welcome card */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-6 text-white shadow-soft-lg sm:py-8">
          <p className="text-sm font-medium text-primary-100">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{profile?.name ?? "Scholar"}</h1>
          <p className="mt-2 text-primary-100">
            Keep growing — your next breakthrough is one mentorship away.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/mentors" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow transition hover:bg-primary-50">
              Find a Mentor <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/profile" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              My Profile
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/mentors" className="card-hover flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-earth-900">{acceptedCount}</p>
              <p className="text-sm text-earth-500">Active mentorships</p>
            </div>
          </Link>
          <div className="card-hover flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-earth-900">{pendingCount}</p>
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

        {pendingInterests > 0 && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50 px-5 py-4 text-sm text-primary-800">
            <strong>{pendingInterests} mentor{pendingInterests !== 1 ? "s" : ""}</strong> {pendingInterests !== 1 ? "are" : "is"} interested in mentoring you — respond below!
          </div>
        )}

        {/* AI Recommended Mentors */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-earth-900">Recommended Mentors For You</h2>
          </div>
          <p className="mb-4 text-sm text-earth-500">
            Matched based on your interests, goals, and profile — updated each visit.
          </p>
          <RecommendedMentors mentors={recommendedMentors} />
        </section>

        {/* Scholarships You May Qualify For */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-earth-900">Scholarships You May Qualify For</h2>
            </div>
            <Link href="/opportunities" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          {scoredOpps.length === 0 ? (
            <div className="rounded-2xl border border-earth-100 bg-earth-50 px-5 py-6 text-center text-sm text-earth-500">
              No opportunities yet.{" "}
              <Link href="/opportunities" className="text-primary-600 hover:underline">Browse the full list</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scoredOpps.map((opp) => {
                const deadline = (opp as { deadline?: string }).deadline
                  ? new Date(((opp as { deadline?: string }).deadline as string) + "T00:00:00")
                  : null;
                const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / 86400000) : null;
                const isExpired = daysLeft !== null && daysLeft < 0;
                return (
                  <div key={(opp as { id: string }).id} className={`flex items-start justify-between gap-3 rounded-2xl border border-earth-100 bg-white p-4 shadow-sm ${isExpired ? "opacity-50" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-earth-900 text-sm">{(opp as { title: string }).title}</p>
                      <p className="text-xs text-earth-500 mt-0.5">{(opp as { organization: string }).organization}</p>
                      {deadline && (
                        <p className={`mt-1 flex items-center gap-1 text-xs ${daysLeft !== null && daysLeft <= 14 && !isExpired ? "text-red-600 font-semibold" : "text-earth-400"}`}>
                          <Calendar className="h-3 w-3" />
                          {isExpired ? "Closed" : `Deadline: ${deadline.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      )}
                    </div>
                    {(opp as { application_link?: string }).application_link && !isExpired && (
                      <a
                        href={(opp as { application_link: string }).application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition"
                      >
                        Apply <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Mentors interested */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-earth-900">Mentors interested in you</h2>
            <div className="mt-4">
              {interests.length === 0 ? (
                <div className="rounded-2xl border border-earth-200 bg-earth-50 px-5 py-8 text-center text-sm text-earth-500">
                  No mentors have expressed interest yet. Complete your profile and explore categories to get discovered.
                </div>
              ) : (
                <MenteeMentorInterests interests={interests} />
              )}
            </div>
          </section>

          {/* Upcoming events */}
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
                  No upcoming events. <Link href="/events" className="text-primary-600 hover:underline">Browse events</Link>
                </div>
              )}
            </div>
            <Link href="/events" className="mt-3 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700">
              View all events →
            </Link>
          </section>
        </div>

        {/* My requests */}
        <section>
          <h2 className="text-lg font-semibold text-earth-900">My requests</h2>
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
