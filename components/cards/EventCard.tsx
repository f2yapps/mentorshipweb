import Link from "next/link";
import { Calendar, MapPin, Globe } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  webinar: "Webinar",
  meetup: "Meetup",
  conference: "Conference",
  seminar: "Seminar",
};

const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-primary-100 text-primary-700",
  webinar: "bg-blue-100 text-blue-700",
  meetup: "bg-green-100 text-green-700",
  conference: "bg-purple-100 text-purple-700",
  seminar: "bg-amber-100 text-amber-700",
};

export type EventCardProps = {
  id: string;
  title: string;
  description?: string | null;
  event_type: string;
  event_date: string;
  event_time: string;
  timezone?: string | null;
  duration_minutes?: number | null;
  location?: string | null;
  is_online?: boolean;
  language?: string | null;
  hostName?: string;
  attendingCount?: number;
  interestedCount?: number;
  tags?: string[];
};

export function EventCard({
  id,
  title,
  description,
  event_type,
  event_date,
  event_time,
  timezone = "UTC",
  duration_minutes,
  location,
  is_online,
  language,
  hostName = "Community",
  attendingCount = 0,
  interestedCount = 0,
  tags = [],
}: EventCardProps) {
  const dateStr = new Date(`${event_date}T${event_time}`).toLocaleDateString(
    undefined,
    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
  );
  const timeStr = new Date(`${event_date}T${event_time}`).toLocaleTimeString(
    undefined,
    { hour: "2-digit", minute: "2-digit" }
  );

  return (
    <Link
      href={`/events/${id}`}
      className="card-hover group flex flex-col overflow-hidden"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 to-primary-700" />
      <div className="flex flex-1 flex-col p-5">
        <span
          className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            TYPE_COLORS[event_type] ?? "bg-earth-100 text-earth-700"
          }`}
        >
          {TYPE_LABELS[event_type] ?? event_type}
        </span>
        <h2 className="mt-2 font-semibold text-earth-900 line-clamp-2 transition-colors group-hover:text-primary-600">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-earth-600 line-clamp-2">{description}</p>
        )}
        <div className="mt-3 flex flex-col gap-1 text-xs text-earth-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {dateStr} · {timeStr}
            {timezone && ` (${timezone})`}
          </span>
          {duration_minutes && (
            <span>⏱ {duration_minutes} min</span>
          )}
          {is_online ? (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Online
            </span>
          ) : location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </span>
          ) : null}
          {language && <span>🌍 {language}</span>}
        </div>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-earth-100 pt-3 text-xs text-earth-500">
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
}
