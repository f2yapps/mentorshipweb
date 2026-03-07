import Link from "next/link";
import { Trophy } from "lucide-react";

export type SuccessStoryCardProps = {
  id: string;
  title: string;
  excerpt: string;
  outcome: string;
  mentorName?: string;
  menteeName?: string;
  category?: string;
  imageUrl?: string | null;
  href?: string;
};

export function SuccessStoryCard({
  id,
  title,
  excerpt,
  outcome,
  mentorName,
  menteeName,
  category,
  imageUrl,
  href = `/success-stories#${id}`,
}: SuccessStoryCardProps) {
  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <article className="card-hover flex flex-col overflow-hidden">
      {imageUrl ? (
        <div className="relative h-40 w-full shrink-0 bg-earth-100">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-32 shrink-0 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
          <Trophy className="h-12 w-12 text-primary-400" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {category && (
          <span className="inline-block w-fit rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            {category}
          </span>
        )}
        <h3 className="mt-2 font-semibold text-earth-900 line-clamp-2">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-earth-600 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <p className="mt-3 text-sm font-medium text-primary-600">
          Outcome: {outcome}
        </p>
        {(mentorName || menteeName) && (
          <div className="mt-4 flex items-center gap-2 border-t border-earth-100 pt-4">
            {menteeName && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-earth-200 text-xs font-semibold text-earth-700">
                  {initials(menteeName)}
                </div>
                <span className="text-xs text-earth-600">{menteeName}</span>
              </div>
            )}
            {mentorName && menteeName && (
              <span className="text-earth-400">·</span>
            )}
            {mentorName && (
              <span className="text-xs text-earth-600">Mentor: {mentorName}</span>
            )}
          </div>
        )}
        <Link
          href={href}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Read full story →
        </Link>
      </div>
    </article>
  );
}
