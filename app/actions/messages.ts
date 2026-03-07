"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Get or create a conversation between the current user and the other party. */
export async function getOrCreateConversation(
  otherMentorId?: string | null,
  otherMenteeId?: string | null
): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  let mentorId: string;
  let menteeId: string;

  if (profile?.role === "mentor") {
    // current user is mentor, other party must be a mentee
    const { data: myMentor } = await supabase
      .from("mentors")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!myMentor) throw new Error("Mentor profile not found");
    if (!otherMenteeId) throw new Error("menteeId required");
    mentorId = myMentor.id;
    menteeId = otherMenteeId;
  } else {
    // current user is mentee, other party must be a mentor
    const { data: myMentee } = await supabase
      .from("mentees")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!myMentee) throw new Error("Mentee profile not found");
    if (!otherMentorId) throw new Error("mentorId required");
    mentorId = otherMentorId;
    menteeId = myMentee.id;
  }

  // Try to find existing conversation first
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("mentee_id", menteeId)
    .maybeSingle();

  if (existing) return existing.id;

  // Create new conversation
  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ mentor_id: mentorId, mentee_id: menteeId })
    .select("id")
    .single();

  if (error || !conv) throw new Error(error?.message ?? "Failed to open conversation");
  return conv.id;
}

export type SendMessageResult = { ok: true } | { ok: false; error: string };

export async function sendMessage(
  conversationId: string,
  body: string
): Promise<SendMessageResult> {
  const trimmed = body?.trim();
  if (!trimmed) return { ok: false, error: "Message cannot be empty." };
  if (trimmed.length > 2000) return { ok: false, error: "Message is too long (max 2000 chars)." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: trimmed,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { ok: true };
}

export async function markMessagesRead(conversationId: string, userId: string) {
  const supabase = await createClient();
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .is("read_at", null);
}
