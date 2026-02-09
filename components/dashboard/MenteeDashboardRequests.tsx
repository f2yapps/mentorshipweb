type RequestRow = {
  id: string;
  category: string;
  message: string | null;
  status: string;
  created_at: string;
  mentorName: string;
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
        </li>
      ))}
    </ul>
  );
}
