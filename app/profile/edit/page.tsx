import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import type { UserRole } from "@/types/database";
import { ProfilePictureSection } from "@/components/profile/ProfilePictureSection";
import { MentorProfileForm } from "@/components/profile/MentorProfileForm";
import { MenteeProfileForm } from "@/components/profile/MenteeProfileForm";

export default async function EditProfilePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/profile/edit");

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role, country, bio, avatar_url")
      .eq("id", user.id)
      .single();

    const role = (profile?.role ?? "mentee") as UserRole;

    const { data: mentor } =
      role === "mentor"
        ? await supabase
            .from("mentors")
            .select("expertise_categories, experience_years, availability, languages")
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

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="section-heading">Edit Profile</h1>
            <p className="mt-2 text-earth-600">
              Keep your profile short and focused so it&apos;s easy for mentors and mentees to understand you.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Profile Picture</h2>
              <ProfilePictureSection
                userId={user.id}
                currentAvatarUrl={profile?.avatar_url ?? null}
              />
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-earth-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Name</label>
                  <p className="text-earth-900">{profile?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
                  <p className="text-earth-900">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Role</label>
                  <p className="text-earth-900 capitalize">{profile?.role}</p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              {role === "mentor" ? (
                <MentorProfileForm
                  userId={user.id}
                  name={profile?.name ?? ""}
                  email={profile?.email ?? ""}
                  initialCountry={profile?.country ?? null}
                  initialBio={profile?.bio ?? null}
                  initialExpertiseCategories={mentor?.expertise_categories ?? []}
                  initialExperienceYears={mentor?.experience_years ?? null}
                  initialAvailability={mentor?.availability ?? "flexible"}
                  initialLanguages={mentor?.languages ?? null}
                />
              ) : role === "mentee" ? (
                <MenteeProfileForm
                  userId={user.id}
                  name={profile?.name ?? ""}
                  email={profile?.email ?? ""}
                  initialCountry={profile?.country ?? null}
                  initialGoals={mentee?.goals ?? null}
                  initialPreferredCategories={mentee?.preferred_categories ?? []}
                />
              ) : (
                <p className="text-sm text-earth-600">
                  There is no dedicated profile form for this role yet.
                </p>
              )}
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
