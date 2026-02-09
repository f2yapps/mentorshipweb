import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RequestMentorshipForm } from "@/components/mentors/RequestMentorshipForm";

export const metadata: Metadata = {
  title: "Request mentorship",
  description: "Send a mentorship request to this mentor.",
};

type Props = { params: Promise<{ id: string }> };

export default async function RequestMentorshipPage({ params }: Props) {
  const { id: mentorId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/login?next=/mentors/${mentorId}/request`);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentee") {
    redirect("/auth/mentee");
  }

  const { data: mentee } = await supabase
    .from("mentees")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentee) {
    redirect("/auth/mentee");
  }

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id, expertise_categories, users(name)")
    .eq("id", mentorId)
    .eq("verified", true)
    .single();

  if (!mentor) {
    notFound();
  }

  const mentorName = (mentor as { users?: { name: string } }).users?.name ?? "Mentor";

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-20">
      <h1 className="section-heading">Request mentorship</h1>
      <p className="mt-2 text-earth-600">
        Send a request to <strong>{mentorName}</strong>. They will see your message and can accept or decline.
      </p>
      <RequestMentorshipForm
        mentorId={mentorId}
        menteeId={mentee.id}
        expertiseCategories={(mentor as { expertise_categories: string[] }).expertise_categories}
        className="mt-8"
      />
    </div>
  );
}
