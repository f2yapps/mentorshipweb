import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MentorDashboardRequests } from "@/components/dashboard/MentorDashboardRequests";

export default async function MentorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentor") redirect("/dashboard");

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentor) redirect("/auth/mentor");

  const { data: requests } = await supabase
    .from("mentorship_requests")
    .select(`
      id,
      category,
      message,
      status,
      created_at,
      mentees(id, goals, user_id, users(id, name, email))
    `)
    .eq("mentor_id", mentor.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="section-heading">Mentor Dashboard</h1>
      <p className="mt-2 text-earth-600">
        View and respond to mentorship requests.
      </p>
      <div className="mt-6">
        <MentorDashboardRequests
          requests={(requests ?? []).map((r: {
            id: string;
            category: string;
            message: string | null;
            status: string;
            created_at: string;
            mentees: {
              id: string;
              goals: string | null;
              user_id: string;
              users: { id: string; name: string; email: string } | null;
            } | null;
          }) => ({
            id: r.id,
            category: r.category,
            message: r.message,
            status: r.status,
            created_at: r.created_at,
            menteeName: r.mentees?.users?.name ?? "Mentee",
            menteeEmail: r.mentees?.users?.email,
            menteeGoals: r.mentees?.goals,
          }))}
        />
      </div>
    </div>
  );
}
