import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { CareerAdvisorChat } from "@/components/advisor/CareerAdvisorChat";

export const metadata = { title: "AI Career Advisor" };

export default async function CareerAdvisorPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/career-advisor");

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    let userProfile: { role: string; preferredCategories?: string[]; goals?: string } = {
      role: profile?.role ?? "mentee",
    };

    if (profile?.role === "mentee") {
      const { data: mentee } = await supabase
        .from("mentees")
        .select("goals, preferred_categories")
        .eq("user_id", user.id)
        .maybeSingle();
      if (mentee) {
        userProfile.goals = mentee.goals ?? undefined;
        userProfile.preferredCategories = mentee.preferred_categories ?? [];
      }
    }

    return (
      <div className="min-h-screen bg-earth-50">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-10 text-white">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                🧠
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">AI Career Advisor</h1>
                <p className="mt-0.5 text-primary-100">
                  Ask anything about scholarships, PhD programs, career paths, and more.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "How do I get a PhD scholarship in the US?",
                "How can I become a data scientist?",
                "Best universities for hydrology?",
                "How to apply for Fulbright?",
              ].map((q) => (
                <span
                  key={q}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white border border-white/20"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-6">
          <CareerAdvisorChat userProfile={userProfile} />
        </div>
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
