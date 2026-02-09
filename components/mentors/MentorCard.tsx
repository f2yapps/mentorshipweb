import Link from "next/link";

type Props = {
  id: string;
  name: string;
  country?: string | null;
  bio?: string | null;
  expertiseCategories: string[];
  experienceYears: number;
  availability: string;
  languages: string[];
  verified: boolean;
};

export function MentorCard({
  id,
  name,
  country,
  bio,
  expertiseCategories,
  experienceYears,
  availability,
  languages,
  verified,
}: Props) {
  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-earth-900">{name}</h2>
        {verified && (
          <span className="shrink-0 rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
            Verified
          </span>
        )}
      </div>
      {country && (
        <p className="mt-1 text-sm text-earth-600">{country}</p>
      )}
      {bio && (
        <p className="mt-2 line-clamp-3 text-sm text-earth-700">{bio}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {expertiseCategories.slice(0, 4).map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-earth-100 px-2 py-0.5 text-xs text-earth-700"
          >
            {cat}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-earth-500">
        {experienceYears} yr experience · {availability}
      </p>
      {languages.length > 0 && (
        <p className="mt-1 text-xs text-earth-500">
          Languages: {languages.slice(0, 3).join(", ")}
        </p>
      )}
      <Link
        href={`/mentors/${id}/request`}
        className="btn-primary mt-4 w-full text-center text-sm"
      >
        Request mentorship
      </Link>
    </article>
  );
}
