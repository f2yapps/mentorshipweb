import Link from "next/link";

type Props = {
  id: string;
  name: string;
  country?: string | null;
  currentPosition?: string | null;
  organization?: string | null;
  bio?: string | null;
  expertiseCategories: string[];
  experienceYears: number;
  availability: string;
  languages: string[];
  verified: boolean;
  /** When "mentor", hide Request Mentorship (mentors don't request themselves). When "mentee" or undefined, show it. */
  currentUserRole?: "mentor" | "mentee" | "admin" | null;
};

const AVAILABILITY_LABELS: Record<string, string> = {
  flexible: "Flexible schedule",
  weekdays: "Weekdays",
  weekends: "Weekends",
  evenings: "Evenings",
  limited: "Limited hours",
};

export function MentorCard({
  id,
  name,
  country,
  currentPosition,
  organization,
  bio,
  expertiseCategories,
  experienceYears,
  availability,
  languages,
  verified,
  currentUserRole,
}: Props) {
  const showRequestButton = currentUserRole === "mentee";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="card-hover flex flex-col p-6">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-earth-900 truncate">{name}</h2>
            {verified && (
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                ✓ Verified
              </span>
            )}
          </div>
          {(currentPosition || organization) && (
            <p className="mt-0.5 text-sm font-medium text-earth-700 truncate">
              {[currentPosition, organization].filter(Boolean).join(" · ")}
            </p>
          )}
          {country && (
            <p className="mt-0.5 text-sm text-earth-500">📍 {country}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="mt-4 line-clamp-3 text-sm text-earth-700 leading-relaxed">{bio}</p>
      )}

      {/* Categories */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {expertiseCategories.slice(0, 4).map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-primary-50 border border-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700"
          >
            {cat}
          </span>
        ))}
        {expertiseCategories.length > 4 && (
          <span className="rounded-full bg-earth-100 px-2.5 py-0.5 text-xs text-earth-500">
            +{expertiseCategories.length - 4} more
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 space-y-1 border-t border-earth-100 pt-4">
        <p className="text-xs text-earth-500">
          🕐 {experienceYears > 0 ? `${experienceYears} yr${experienceYears !== 1 ? "s" : ""} experience` : "Experience not listed"}{" "}
          · {AVAILABILITY_LABELS[availability] ?? availability}
        </p>
        {languages.length > 0 && (
          <p className="text-xs text-earth-500">
            🗣️ {languages.slice(0, 3).join(", ")}
            {languages.length > 3 && ` +${languages.length - 3}`}
          </p>
        )}
      </div>

      {/* CTA buttons */}
      <div className="mt-5 flex gap-2">
        <Link
          href={`/mentors/${id}`}
          className="flex-1 rounded-xl border border-earth-200 px-3 py-2 text-center text-sm font-medium text-earth-700 hover:bg-earth-50 hover:border-earth-300 transition-colors"
        >
          View Profile
        </Link>
        {showRequestButton && (
          <Link
            href={`/mentors/${id}/request`}
            className="btn-primary flex-1 text-center text-sm"
          >
            Request
          </Link>
        )}
      </div>
    </article>
  );
}
