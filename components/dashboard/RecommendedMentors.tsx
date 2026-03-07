"use client";

import Link from "next/link";
import type { MatchedMentor } from "@/lib/mentor-matching";
import { Sparkles, MapPin, Star, Clock, BadgeCheck } from "lucide-react";

type Props = { mentors: MatchedMentor[] };

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-primary-600"
      : score >= 40
      ? "text-amber-600"
      : "text-earth-500";

  return (
    <div
      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-2 ${
        score >= 80
          ? "border-green-200 bg-green-50"
          : score >= 60
          ? "border-primary-200 bg-primary-50"
          : score >= 40
          ? "border-amber-200 bg-amber-50"
          : "border-earth-200 bg-earth-50"
      }`}
    >
      <span className={`text-base font-bold leading-none ${color}`}>
        {score}
      </span>
      <span className="text-[9px] font-medium text-earth-400 leading-tight">
        match
      </span>
    </div>
  );
}

export function RecommendedMentors({ mentors }: Props) {
  if (mentors.length === 0) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-earth-50 px-5 py-8 text-center text-sm text-earth-500">
        No recommendations yet. Complete your profile and add areas of interest
        to get personalised matches.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mentors.map((mentor) => {
        const name = mentor.users?.name ?? "Mentor";
        const position = mentor.users?.current_position;
        const org = mentor.users?.organization;
        const country = mentor.users?.country;
        const bio = mentor.users?.bio;

        const positionLine =
          position && org
            ? `${position} · ${org}`
            : position || org || null;

        return (
          <div
            key={mentor.id}
            className="flex items-start gap-4 rounded-2xl border border-earth-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* Score ring */}
            <ScoreRing score={mentor.score} />

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-earth-900">{name}</p>
                {mentor.verified && (
                  <BadgeCheck className="h-4 w-4 text-primary-500" aria-label="Verified mentor" />
                )}
              </div>

              {positionLine && (
                <p className="text-xs text-earth-500 mt-0.5">{positionLine}</p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-earth-500">
                {country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {country}
                  </span>
                )}
                {mentor.experience_years != null &&
                  mentor.experience_years > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {mentor.experience_years}yr
                      {mentor.experience_years !== 1 ? "s" : ""} exp
                    </span>
                  )}
                {mentor.availability && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {mentor.availability}
                  </span>
                )}
              </div>

              {mentor.matchedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {mentor.matchedCategories.slice(0, 4).map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-2 text-xs text-earth-600 italic">
                {mentor.explanation}
              </p>

              {bio && (
                <p className="mt-1.5 line-clamp-2 text-xs text-earth-500">
                  {bio}
                </p>
              )}

              <div className="mt-3">
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                >
                  View Profile & Request
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
