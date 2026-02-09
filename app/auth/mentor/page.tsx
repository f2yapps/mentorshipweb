import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MentorOnboardingForm } from "@/components/auth/MentorOnboardingForm";

export const metadata: Metadata = {
  title: "Mentor profile",
  description: "Complete your mentor profile to appear in the directory.",
};

export default async function MentorOnboardingPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    redirect("/auth/login?next=/auth/mentor");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", authUser.id)
    .single();

  if (profile?.role !== "mentor") {
    await supabase.from("users").update({ role: "mentor" }).eq("id", authUser.id);
  }

  const { data: mentor } = await supabase
    .from("mentors")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (mentor) {
    redirect("/dashboard/mentor");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">Complete your mentor profile</h1>
      <p className="mt-2 text-earth-600">
        Tell mentees about your expertise, availability, and how you prefer to connect.
      </p>
      <MentorOnboardingForm className="mt-8" />
    </div>
  );
}
