import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MessageThread } from "@/components/messages/MessageThread";

export const metadata = { title: "Conversation" };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // Load conversation + participants
    const { data: conv } = await supabase
      .from("conversations")
      .select(`
        id,
        mentors(id, user_id, users(id, name)),
        mentees(id, user_id, users(id, name))
      `)
      .eq("id", id)
      .single();

    if (!conv) notFound();

    const mentorField = (conv as { mentors?: unknown }).mentors;
    const menteeField = (conv as { mentees?: unknown }).mentees;
    const mentor = (Array.isArray(mentorField) ? mentorField[0] : mentorField) as { id: string; user_id: string; users?: unknown } | null;
    const mentee = (Array.isArray(menteeField) ? menteeField[0] : menteeField) as { id: string; user_id: string; users?: unknown } | null;

    const isParticipant = mentor?.user_id === user.id || mentee?.user_id === user.id;
    if (!isParticipant) notFound();

    const mentorUser = mentor?.users ? (Array.isArray(mentor.users) ? (mentor.users as { name?: string }[])[0] : mentor.users as { name?: string }) : null;
    const menteeUser = mentee?.users ? (Array.isArray(mentee.users) ? (mentee.users as { name?: string }[])[0] : mentee.users as { name?: string }) : null;
    const isMentor = mentor?.user_id === user.id;
    const otherName = isMentor ? (menteeUser?.name ?? "Mentee") : (mentorUser?.name ?? "Mentor");

    // Load initial messages
    const { data: messagesRaw } = await supabase
      .from("messages")
      .select("id, sender_id, body, created_at, read_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(100);

    const messages = (messagesRaw ?? []).map((m) => ({
      id: m.id as string,
      sender_id: m.sender_id as string,
      body: m.body as string,
      created_at: m.created_at as string,
      read_at: m.read_at as string | null,
    }));

    return (
      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        otherName={otherName}
        initialMessages={messages}
      />
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
