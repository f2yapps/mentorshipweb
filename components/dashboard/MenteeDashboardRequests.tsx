import Link from "next/link";

type RequestRow = {
  id: string;
  category: string;
  message: string | null;
  status: string;
  created_at: string;
  meeting_link: string | null;
  meeting_provider: string | null;
  meeting_scheduled_at: string | null;
  mentorName: string;
  mentorProfileId?: string | null;
};

type Props = { requests: RequestRow[] };

export function MenteeDashboardRequests({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
        You haven&apos;t sent any mentorship requests yet.{" "}
        <a href="/mentors" className="font-medium text-primary-600 hover:underline">
          Find mentors
        </a>{" "}
        and send a request.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {requests.map((r) => (
        <li key={r.id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-earth-900">{r.mentorName}</p>
              <p className="text-sm text-earth-500">
                Category: {r.category} · {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                r.status === "pending"
                  ? "bg-amber-100 text-amber-800"
                  : r.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : r.status === "declined"
                      ? "bg-earth-100 text-earth-600"
                      : "bg-earth-100 text-earth-600"
              }`}
            >
              {r.status}
            </span>
          </div>
          {r.message && (
            <p className="mt-3 text-sm text-earth-700">{r.message}</p>
          )}
          {r.status === "accepted" && (r.meeting_link || r.meeting_provider || r.meeting_scheduled_at) && (
            <div className="mt-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-xs font-semibold text-green-800 mb-1">Virtual Meeting Scheduled</p>
              {r.meeting_provider && (
                <p className="text-xs text-green-700 capitalize mb-1">
                  Platform: {r.meeting_provider.replace(/_/g, " ")}
                </p>
              )}
              {r.meeting_scheduled_at && (
                <p className="text-sm text-green-700 mb-2">
                  📅 {new Date(r.meeting_scheduled_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              )}
              {r.meeting_link && (
                <a
                  href={r.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800 transition"
                >
                  🎥 Join Meeting
                </a>
              )}
            </div>
          )}
          {r.status === "accepted" && !r.meeting_link && (
            <p className="mt-2 text-xs text-earth-400 italic">
              Your mentor hasn&apos;t added a meeting link yet.
            </p>
          )}
          {r.status === "accepted" && r.mentorProfileId && (
            <div className="mt-3">
              <Link
                href={`/messages/start?mentor_id=${r.mentorProfileId}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition"
              >
                💬 Message {r.mentorName}
              </Link>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
