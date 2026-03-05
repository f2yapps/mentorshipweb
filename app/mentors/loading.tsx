export default function MentorsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 animate-pulse">
      <div className="h-9 w-64 rounded bg-earth-200" />
      <div className="mt-3 h-5 w-96 rounded bg-earth-100" />

      {/* Filter bar skeleton */}
      <div className="mt-8 flex gap-3">
        <div className="h-10 flex-1 max-w-xs rounded-xl bg-earth-200" />
        <div className="h-10 w-36 rounded-xl bg-earth-200" />
        <div className="h-10 w-36 rounded-xl bg-earth-200" />
      </div>

      {/* Cards grid skeleton */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6 space-y-4">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-full bg-earth-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-earth-200" />
                <div className="h-3 w-1/2 rounded bg-earth-100" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-earth-100" />
              <div className="h-3 w-4/5 rounded bg-earth-100" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-earth-100" />
              <div className="h-6 w-24 rounded-full bg-earth-100" />
              <div className="h-6 w-16 rounded-full bg-earth-100" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-9 flex-1 rounded-xl bg-earth-200" />
              <div className="h-9 flex-1 rounded-xl bg-earth-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
