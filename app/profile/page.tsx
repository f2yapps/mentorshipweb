import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";

export default async function ProfilePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/profile");

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role, country, bio, avatar_url")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "mentee";

    const { data: mentor } =
      role === "mentor"
        ? await supabase
            .from("mentors")
            .select("expertise_categories, experience_years, availability, languages, verified")
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };

    const { data: mentee } =
      role === "mentee"
        ? await supabase
            .from("mentees")
            .select("goals, preferred_categories")
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };

    const initials = (profile?.name ?? "U").slice(0, 2).toUpperCase();

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Header card */}
          <div className="card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700" />
            <div className="px-6 pb-6">
              <div className="-mt-12 flex items-end gap-4">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.name ?? "Avatar"}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary-100 text-xl font-bold text-primary-700 shadow">
                    {initials}
                  </div>
                )}
                <div className="mb-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-earth-900">{profile?.name}</h1>
                    {mentor?.verified && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Verified Mentor
                      </span>
                    )}
                    <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 capitalize">
                      {role}
                    </span>
                  </div>
                  {profile?.country && (
                    <p className="mt-0.5 text-sm text-earth-500">📍 {profile.country}</p>
                  )}
                </div>
                <Link href="/profile/edit" className="btn-ghost text-sm shrink-0">
                  Edit Profile
                </Link>
              </div>

              {profile?.bio && (
                <p className="mt-4 text-sm text-earth-700 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">

            {/* Mentor details */}
            {role === "mentor" && mentor && (
              <>
                {mentor.expertise_categories && mentor.expertise_categories.length > 0 && (
                  <section className="card p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-3">Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise_categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <section className="card p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-3">Details</h2>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {mentor.experience_years != null && (
                      <div className="rounded-lg bg-earth-50 p-3 text-center">
                        <dt className="text-xs text-earth-500">Experience</dt>
                        <dd className="mt-1 text-lg font-bold text-earth-900">{mentor.experience_years}y</dd>
                      </div>
                    )}
                    {mentor.availability && (
                      <div className="rounded-lg bg-earth-50 p-3 text-center">
                        <dt className="text-xs text-earth-500">Availability</dt>
                        <dd className="mt-1 text-sm font-semibold text-earth-900 capitalize">{mentor.availability}</dd>
                      </div>
                    )}
                    {mentor.languages && (
                      <div className="rounded-lg bg-earth-50 p-3 text-center">
                        <dt className="text-xs text-earth-500">Languages</dt>
                        <dd className="mt-1 text-sm font-semibold text-earth-900">{mentor.languages}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              </>
            )}

            {/* Mentee details */}
            {role === "mentee" && mentee && (
              <>
                {mentee.goals && (
                  <section className="card p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-3">Goals</h2>
                    <p className="text-sm text-earth-700 leading-relaxed">{mentee.goals}</p>
                  </section>
                )}

                {mentee.preferred_categories && mentee.preferred_categories.length > 0 && (
                  <section className="card p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-3">Interested In</h2>
                    <div className="flex flex-wrap gap-2">
                      {mentee.preferred_categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="rounded-full bg-earth-100 px-3 py-1 text-sm font-medium text-earth-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Contact info */}
            <section className="card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-3">Account</h2>
              <dl className="space-y-2">
                <div className="flex gap-2 text-sm">
                  <dt className="w-16 shrink-0 text-earth-500">Email</dt>
                  <dd className="text-earth-900">{profile?.email}</dd>
                </div>
              </dl>
            </section>

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
