export default function MentorDashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="h-24 rounded-2xl bg-earth-200" />

      {/* Stats skeleton */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 text-center">
            <div className="mx-auto h-8 w-12 rounded bg-earth-200" />
            <div className="mx-auto mt-2 h-3 w-16 rounded bg-earth-100" />
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="mt-5 flex gap-3">
        <div className="h-10 w-28 rounded-xl bg-earth-200" />
        <div className="h-10 w-32 rounded-xl bg-earth-100" />
        <div className="h-10 w-28 rounded-xl bg-earth-100" />
      </div>

      {/* Requests skeleton */}
      <div className="mt-8 space-y-4">
        <div className="h-6 w-40 rounded bg-earth-200" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-earth-200" />
                <div className="h-3 w-48 rounded bg-earth-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-earth-100" />
            </div>
            <div className="h-3 w-full rounded bg-earth-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
