import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: mentor } = await supabase
      .from("mentors")
      .select("users(name)")
      .eq("id", id)
      .single();
    const usersField: unknown = (mentor as { users?: unknown } | null)?.users;
    const name = ((Array.isArray(usersField) ? usersField[0] : usersField) as { name?: string } | null)?.name ?? "Mentor";
    return { title: `${name} – Mentor Profile`, description: `View ${name}'s full mentor profile and request a mentorship session.` };
  } catch {
    return { title: "Mentor Profile" };
  }
}

const AVAILABILITY_LABELS: Record<string, string> = {
  flexible: "Flexible schedule",
  weekdays: "Weekdays",
  weekends: "Weekends",
  evenings: "Evenings",
  limited: "Limited availability",
};

export default async function MentorProfilePage({ params }: Props) {
  const { id: mentorId } = await params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: mentorRaw } = await supabase
      .from("mentors")
      .select("id, user_id, expertise_categories, experience_years, availability, languages, verified, users(id, name, country, bio, avatar_url)")
      .eq("id", mentorId)
      .single();

    if (!mentorRaw) notFound();

    const usersField: unknown = (mentorRaw as { users?: unknown }).users;
    const userRow = (Array.isArray(usersField) ? usersField[0] : usersField) as {
      id: string; name: string; country: string | null; bio: string | null; avatar_url: string | null;
    } | null;

    const mentor = {
      id: mentorRaw.id,
      expertise_categories: (mentorRaw as { expertise_categories: string[] }).expertise_categories ?? [],
      experience_years: (mentorRaw as { experience_years: number | null }).experience_years,
      availability: (mentorRaw as { availability: string }).availability,
      languages: (mentorRaw as { languages: string[] | null }).languages ?? [],
      verified: (mentorRaw as { verified: boolean }).verified,
      name: userRow?.name ?? "Mentor",
      country: userRow?.country ?? null,
      bio: userRow?.bio ?? null,
      avatar_url: userRow?.avatar_url ?? null,
    };

    const initials = mentor.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

    // Check if current user is a mentee (to show request button)
    let isMentee = false;
    if (user) {
      const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
      isMentee = profile?.role === "mentee";
    }

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Back link */}
          <Link href="/mentors" className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-earth-800 transition-colors mb-6">
            ← Back to directory
          </Link>

          {/* Header card */}
          <div className="card overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-800" />
            <div className="px-6 pb-6">
              <div className="-mt-14 flex items-end gap-4">
                {mentor.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.avatar_url}
                    alt={mentor.name}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary-100 text-2xl font-bold text-primary-700 shadow-lg">
                    {initials}
                  </div>
                )}
                <div className="mb-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-earth-900">{mentor.name}</h1>
                    {mentor.verified && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        ✓ Verified Mentor
                      </span>
                    )}
                  </div>
                  {mentor.country && (
                    <p className="mt-0.5 text-sm text-earth-500">📍 {mentor.country}</p>
                  )}
                </div>
              </div>

              {mentor.bio && (
                <p className="mt-4 text-earth-700 leading-relaxed">{mentor.bio}</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Expertise / Mentorship topics */}
            {mentor.expertise_categories.length > 0 && (
              <section className="card rounded-2xl p-5 sm:col-span-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-3">Mentorship Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise_categories.map((cat: string) => (
                    <span key={cat} className="rounded-full bg-primary-100 border border-primary-200 px-3 py-1 text-sm font-medium text-primary-700">
                      {cat}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Stats */}
            <section className="card rounded-2xl p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-4">Details</h2>
              <dl className="space-y-3">
                {mentor.experience_years != null && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🕐</span>
                    <div>
                      <dt className="text-xs text-earth-500">Experience</dt>
                      <dd className="text-sm font-semibold text-earth-900">{mentor.experience_years} year{mentor.experience_years !== 1 ? "s" : ""}</dd>
                    </div>
                  </div>
                )}
                {mentor.availability && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <dt className="text-xs text-earth-500">Availability</dt>
                      <dd className="text-sm font-semibold text-earth-900">{AVAILABILITY_LABELS[mentor.availability] ?? mentor.availability}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </section>

            {/* Languages */}
            {mentor.languages.length > 0 && (
              <section className="card rounded-2xl p-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((lang: string) => (
                    <span key={lang} className="rounded-full bg-earth-100 px-3 py-1 text-sm font-medium text-earth-700">
                      🗣️ {lang}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Reviews / Testimonials placeholder */}
          <section className="mt-6 card rounded-2xl p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-4">Reviews & Testimonials</h2>
            <p className="text-sm text-earth-600">
              Mentees who have worked with this mentor can leave reviews here. Be the first to connect and share your experience!
            </p>
          </section>

          {/* CTA */}
          <div className="mt-6 card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 bg-primary-50 border-primary-100">
            <div className="flex-1">
              <h2 className="font-semibold text-primary-900">Ready to connect with {mentor.name.split(" ")[0]}?</h2>
              <p className="mt-1 text-sm text-primary-700">
                Send a mentorship request and start your journey. It's free and they'll respond within a few days.
              </p>
            </div>
            {isMentee ? (
              <Link href={`/mentors/${mentorId}/request`} className="btn-primary shrink-0">
                Request Mentorship →
              </Link>
            ) : !user ? (
              <Link href={`/auth/login?next=/mentors/${mentorId}/request`} className="btn-primary shrink-0">
                Sign in to Request →
              </Link>
            ) : (
              <Link href="/mentors" className="btn-secondary shrink-0">
                Browse More Mentors
              </Link>
            )}
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
