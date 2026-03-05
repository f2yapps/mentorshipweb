import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MenteeCard } from "@/components/mentees/MenteeCard";

export const metadata: Metadata = {
  title: "Mentee list",
  description: "Browse mentees. Mentors can express interest to mentor.",
};

export default async function MenteesPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/mentees");

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    const role = profile?.role ?? "mentee";
    if (role !== "mentor" && role !== "admin") {
      redirect("/dashboard");
    }

    const { data: mentor } = role === "mentor"
      ? await supabase.from("mentors").select("id").eq("user_id", user.id).maybeSingle()
      : { data: null };

    const { data: menteesRaw } = await supabase
      .from("mentees")
      .select("id, user_id, goals, preferred_categories, users(name, country)")
      .order("created_at", { ascending: false });

    type UserRow = { name: string; country: string | null } | null;
    const mentees = (menteesRaw ?? []).map((m) => {
      const usersField: unknown = (m as { users?: unknown }).users;
      const u: UserRow = Array.isArray(usersField)
        ? (usersField[0] ?? null) as UserRow
        : (usersField as UserRow) ?? null;
      return {
        id: m.id,
        user_id: m.user_id,
        goals: m.goals,
        preferred_categories: m.preferred_categories ?? [],
        name: u?.name ?? "Mentee",
        country: u?.country ?? null,
      };
    });

    const existingInterestMenteeIds =
      mentor?.id
        ? (await supabase
            .from("mentor_interests")
            .select("mentee_id")
            .eq("mentor_id", mentor.id))
            .data?.map((r) => r.mentee_id) ?? []
        : [];

    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="section-heading">Mentee list</h1>
        <p className="mt-2 text-earth-600">
          {role === "mentor"
            ? "Browse mentees and express interest to mentor. Filter by area, country, or language."
            : "All registered mentees."}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentees.length === 0 ? (
            <div className="col-span-full rounded-xl border border-earth-200 bg-earth-50 p-10 text-center text-earth-600">
              No mentees have registered yet.
            </div>
          ) : (
            mentees.map((mentee) => (
              <MenteeCard
                key={mentee.id}
                id={mentee.id}
                name={mentee.name}
                country={mentee.country}
                goals={mentee.goals}
                preferredCategories={mentee.preferred_categories}
                currentUserRole={role as "mentor" | "admin"}
                mentorId={mentor?.id ?? null}
                alreadyInterested={existingInterestMenteeIds.includes(mentee.id)}
              />
            ))
          )}
        </div>
      </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
