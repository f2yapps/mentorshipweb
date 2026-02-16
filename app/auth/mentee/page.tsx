import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MenteeOnboardingForm } from "@/components/auth/MenteeOnboardingForm";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Set up your mentee profile to connect with mentors in AI, technology, and career development.",
};

export default async function MenteeOnboardingPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    redirect("/auth/login?next=/auth/mentee");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", authUser.id)
    .single();

  if (profile?.role !== "mentee") {
    await supabase.from("users").update({ role: "mentee" }).eq("id", authUser.id);
  }

  const { data: mentee } = await supabase
    .from("mentees")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (mentee) {
    redirect("/dashboard/mentee");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">Complete Your Profile</h1>
      <p className="mt-2 text-earth-600">
        Tell us about your goals and interests so we can connect you with the right mentors 
        in AI, technology, and career development.
      </p>
      <MenteeOnboardingForm className="mt-8" />
    </div>
  );
}
