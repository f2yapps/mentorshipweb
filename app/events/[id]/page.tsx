import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { RsvpButton } from "@/components/events/RsvpButton";

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop", webinar: "Webinar",
  meetup: "Meetup", conference: "Conference", seminar: "Seminar",
};

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: ev } = await supabase
      .from("workshop_events")
      .select(`
        *,
        host:users!host_id(id, name),
        event_rsvps(id, user_id, status)
      `)
      .eq("id", params.id)
      .single();

    if (!ev) notFound();

    const rsvps: { id: string; user_id: string; status: string }[] =
      (ev.event_rsvps as unknown as { id: string; user_id: string; status: string }[]) ?? [];

    const attendingCount = rsvps.filter((r) => r.status === "attending").length;
    const interestedCount = rsvps.filter((r) => r.status === "interested").length;
    const myRsvp = user ? rsvps.find((r) => r.user_id === user.id) ?? null : null;

    const hostName = (ev.host as unknown as { name?: string } | null)?.name ?? "Community";

    const dateStr = new Date(ev.event_date + "T" + ev.event_time).toLocaleDateString(
      undefined,
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );
    const timeStr = new Date(ev.event_date + "T" + ev.event_time).toLocaleTimeString(
      undefined,
      { hour: "2-digit", minute: "2-digit" }
    );

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Back */}
        <Link href="/events" className="text-sm text-earth-500 hover:text-primary-600 transition">
          ← Back to Events
        </Link>

        {/* Banner */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-white">
          <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">
            {TYPE_LABELS[ev.event_type] ?? ev.event_type}
          </span>
          <h1 className="mt-3 text-2xl font-bold">{ev.title}</h1>
          <p className="mt-1 text-sm text-primary-200">Hosted by {hostName}</p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {/* Main info */}
          <div className="sm:col-span-2 space-y-6">
            {ev.description && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-earth-400">
                  About this event
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-earth-800">{ev.description}</p>
              </section>
            )}

            {/* Online links */}
            {ev.is_online && (ev.zoom_link || ev.google_meet_link) && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-earth-400">
                  Join Online
                </h2>
                <div className="mt-2 space-y-2">
                  {ev.zoom_link && (
                    <a
                      href={ev.zoom_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                    >
                      <span className="text-lg">🎥</span>
                      Join via Zoom
                    </a>
                  )}
                  {ev.google_meet_link && (
                    <a
                      href={ev.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition"
                    >
                      <span className="text-lg">📹</span>
                      Join via Google Meet
                    </a>
                  )}
                </div>
              </section>
            )}

            {ev.tags && ev.tags.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-earth-400">
                  Topics
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ev.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary-100 px-3 py-0.5 text-sm text-primary-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details card */}
            <div className="card p-4 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Date &amp; Time</p>
                <p className="mt-1 font-medium text-earth-900">{dateStr}</p>
                <p className="text-earth-600">{timeStr} · {ev.timezone}</p>
              </div>
              {ev.duration_minutes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Duration</p>
                  <p className="mt-1 text-earth-700">{ev.duration_minutes} minutes</p>
                </div>
              )}
              {ev.location && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Venue</p>
                  <p className="mt-1 text-earth-700">{ev.location}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Format</p>
                <p className="mt-1 text-earth-700">
                  {ev.is_online && ev.location
                    ? "Hybrid (Online + In-person)"
                    : ev.is_online
                    ? "Online"
                    : "In-person"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Language</p>
                <p className="mt-1 text-earth-700">{ev.language}</p>
              </div>
              {ev.max_attendees && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-earth-400">Capacity</p>
                  <p className="mt-1 text-earth-700">{ev.max_attendees} seats</p>
                </div>
              )}
            </div>

            {/* Attendance */}
            <div className="card p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-earth-400 mb-3">Attendance</p>
              <p className="text-earth-700">
                <strong className="text-earth-900">{attendingCount}</strong> attending
              </p>
              <p className="text-earth-500">{interestedCount} interested</p>
            </div>

            {/* RSVP */}
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-earth-400 mb-3">Your RSVP</p>
              <RsvpButton
                eventId={ev.id}
                userId={user?.id ?? null}
                existing={myRsvp ? { id: myRsvp.id, status: myRsvp.status } : null}
              />
            </div>
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
