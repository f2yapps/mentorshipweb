import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";

export const metadata: Metadata = {
  title: "Events & Workshops",
  description: "Workshops, webinars and meetups from our global mentorship community.",
};

const TYPE_LABELS: Record<string, string> = {
  workshop:   "Workshop",
  webinar:    "Webinar",
  meetup:     "Meetup",
  conference: "Conference",
  seminar:    "Seminar",
};

const TYPE_COLORS: Record<string, string> = {
  workshop:   "bg-primary-100 text-primary-700",
  webinar:    "bg-blue-100 text-blue-700",
  meetup:     "bg-green-100 text-green-700",
  conference: "bg-purple-100 text-purple-700",
  seminar:    "bg-amber-100 text-amber-700",
};

export default async function EventsPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = user
      ? await supabase.from("users").select("role").eq("id", user.id).single()
      : { data: null };

    const canCreate = profile?.role === "mentor" || profile?.role === "admin";

    const { data: events } = await supabase
      .from("workshop_events")
      .select(`
        id, title, description, event_type, event_date, event_time,
        timezone, duration_minutes, location, is_online, language,
        max_attendees, tags,
        host:users!host_id(name),
        event_rsvps(id, status)
      `)
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(50);

    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="section-heading">Events &amp; Workshops</h1>
            <p className="mt-2 text-earth-600">
              Free workshops, webinars, and meetups from our global mentorship network
            </p>
          </div>
          {canCreate && (
            <Link href="/events/create" className="btn-primary shrink-0">
              + Create Event
            </Link>
          )}
        </div>

        {!events || events.length === 0 ? (
          <div className="mt-12 rounded-xl border border-earth-200 bg-earth-50 py-16 text-center">
            <p className="text-4xl">📅</p>
            <p className="mt-4 text-lg font-medium text-earth-700">No upcoming events yet</p>
            <p className="mt-1 text-sm text-earth-500">
              Check back soon — our mentors are planning workshops and webinars.
            </p>
            {canCreate && (
              <Link href="/events/create" className="btn-primary mt-6 inline-flex">
                Create the First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => {
              const rsvps = (ev.event_rsvps as unknown as { id: string; status: string }[]) ?? [];
              const attendingCount = rsvps.filter((r) => r.status === "attending").length;
              const interestedCount = rsvps.filter((r) => r.status === "interested").length;
              const hostName = (ev.host as unknown as { name?: string } | null)?.name ?? "Community";
              const dateStr = new Date(ev.event_date + "T" + ev.event_time).toLocaleDateString(
                undefined,
                { weekday: "short", month: "short", day: "numeric", year: "numeric" }
              );
              const timeStr = new Date(ev.event_date + "T" + ev.event_time).toLocaleTimeString(
                undefined,
                { hour: "2-digit", minute: "2-digit" }
              );

              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="card group flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Coloured header bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-primary-700" />

                  <div className="flex flex-1 flex-col p-5">
                    {/* Type badge */}
                    <span
                      className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        TYPE_COLORS[ev.event_type] ?? "bg-earth-100 text-earth-700"
                      }`}
                    >
                      {TYPE_LABELS[ev.event_type] ?? ev.event_type}
                    </span>

                    <h2 className="mt-2 font-semibold text-earth-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {ev.title}
                    </h2>

                    {ev.description && (
                      <p className="mt-1 text-sm text-earth-600 line-clamp-2">{ev.description}</p>
                    )}

                    <div className="mt-3 space-y-1 text-xs text-earth-500">
                      <p>📅 {dateStr} · {timeStr} ({ev.timezone})</p>
                      {ev.duration_minutes && (
                        <p>⏱ {ev.duration_minutes} min</p>
                      )}
                      {ev.is_online && <p>🌐 Online</p>}
                      {ev.location && <p>📍 {ev.location}</p>}
                      <p>🌍 {ev.language}</p>
                    </div>

                    {ev.tags && ev.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {ev.tags.slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-earth-100 pt-3 text-xs text-earth-500 mt-4">
                      <span>By {hostName}</span>
                      <span>
                        {attendingCount > 0 && <>{attendingCount} attending</>}
                        {attendingCount > 0 && interestedCount > 0 && " · "}
                        {interestedCount > 0 && <>{interestedCount} interested</>}
                        {attendingCount === 0 && interestedCount === 0 && "Be the first to RSVP"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
