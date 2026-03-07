import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MessageSquare, ArrowRight } from "lucide-react";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", user.id)
      .single();

    const { data: convsRaw } = await supabase
      .from("conversations")
      .select(`
        id, last_message_at, last_message_preview, created_at,
        mentors(id, user_id, users(id, name)),
        mentees(id, user_id, users(id, name))
      `)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    const conversations = (convsRaw ?? []).map((c) => {
      const mentorField = (c as { mentors?: unknown }).mentors;
      const menteeField = (c as { mentees?: unknown }).mentees;
      const mentor = (Array.isArray(mentorField) ? mentorField[0] : mentorField) as { id: string; user_id: string; users?: unknown } | null;
      const mentee = (Array.isArray(menteeField) ? menteeField[0] : menteeField) as { id: string; user_id: string; users?: unknown } | null;
      const mentorUser = mentor?.users ? (Array.isArray(mentor.users) ? (mentor.users as { name?: string }[])[0] : mentor.users as { name?: string }) : null;
      const menteeUser = mentee?.users ? (Array.isArray(mentee.users) ? (mentee.users as { name?: string }[])[0] : mentee.users as { name?: string }) : null;
      const isMentor = mentor?.user_id === user.id;
      const otherName = isMentor ? (menteeUser?.name ?? "Mentee") : (mentorUser?.name ?? "Mentor");
      return {
        id: c.id,
        otherName,
        otherInitials: otherName.slice(0, 2).toUpperCase(),
        last_message_at: c.last_message_at as string | null,
        last_message_preview: c.last_message_preview as string | null,
      };
    });

    return (
      <div className="container-narrow py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-heading">Messages</h1>
            <p className="mt-1 text-earth-500">Your direct conversations</p>
          </div>
          {profile?.role === "mentee" && (
            <Link href="/mentors" className="btn-primary text-sm">
              Find a Mentor →
            </Link>
          )}
        </div>

        <div className="mt-8">
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-earth-100 bg-white p-12 text-center shadow-soft">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <MessageSquare className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-earth-900">No messages yet</h3>
              <p className="mt-2 text-earth-500">
                {profile?.role === "mentee"
                  ? "Send a mentorship request to a mentor to start a conversation."
                  : "Once you accept a mentorship request, you can message your mentees here."}
              </p>
              <Link
                href={profile?.role === "mentee" ? "/mentors" : "/dashboard/mentor"}
                className="btn-primary mt-6 inline-flex"
              >
                {profile?.role === "mentee" ? "Find a Mentor" : "Go to Dashboard"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="card-hover flex items-center gap-4 rounded-2xl border border-earth-100 bg-white p-4 shadow-soft"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
                    {conv.otherInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-earth-900">{conv.otherName}</p>
                      {conv.last_message_at && (
                        <p className="shrink-0 text-xs text-earth-400">
                          {new Date(conv.last_message_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-earth-500">
                      {conv.last_message_preview ?? "Start the conversation…"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-earth-300" />
                </Link>
              ))}
            </div>
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
