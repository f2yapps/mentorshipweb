import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MenteeDashboardRequests } from "@/components/dashboard/MenteeDashboardRequests";

export default async function MenteeDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "mentee") redirect("/dashboard");

  const { data: mentee } = await supabase
    .from("mentees")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!mentee) redirect("/auth/mentee");

  const { data: requests } = await supabase
    .from("mentorship_requests")
    .select(`
      id,
      category,
      message,
      status,
      created_at,
      mentors(id, user_id, users(id, name))
    `)
    .eq("mentee_id", mentee.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="section-heading">Mentee Dashboard</h1>
      <p className="mt-2 text-earth-600">
        Track your mentorship requests and connect with mentors.
      </p>
      <div className="mt-6">
        <MenteeDashboardRequests
          requests={(requests ?? []).map((r: {
            id: string;
            category: string;
            message: string | null;
            status: string;
            created_at: string;
            mentors: {
              id: string;
              user_id: string;
              users: { id: string; name: string } | null;
            } | null;
          }) => ({
            id: r.id,
            category: r.category,
            message: r.message,
            status: r.status,
            created_at: r.created_at,
            mentorName: r.mentors?.users?.name ?? "Mentor",
          }))}
        />
      </div>
      <div className="mt-8">
        <a href="/mentors" className="btn-primary">
          Find more mentors
        </a>
      </div>
    </div>
  );
}
