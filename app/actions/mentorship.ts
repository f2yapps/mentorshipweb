"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateRequestResult = { ok: true; requestId: string } | { ok: false; error: string };

export async function createMentorshipRequest(
  mentorId: string,
  menteeId: string,
  category: string,
  message: string | null
): Promise<CreateRequestResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: menteeUser } = await supabase.from("users").select("name").eq("id", user.id).single();
  const menteeName = menteeUser?.name ?? "A mentee";

  const { data: request, error: insertError } = await supabase
    .from("mentorship_requests")
    .insert({
      mentee_id: menteeId,
      mentor_id: mentorId,
      category,
      message: message || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) return { ok: false, error: insertError.message };
  if (!request?.id) return { ok: false, error: "Failed to create request" };

  // Notification for mentor: either run migration 008 (trigger notify_mentor_on_request) or create here
  const { data: mentor } = await supabase
    .from("mentors")
    .select("user_id")
    .eq("id", mentorId)
    .single();
  if (mentor?.user_id) {
    const notifMsg = `${menteeName} sent you a mentorship request in ${category}.`;
    await supabase.from("notifications").insert({
      user_id: mentor.user_id,
      type: "mentorship_request",
      title: "New mentorship request",
      message: notifMsg,
      body: notifMsg,
      related_entity_type: "mentorship_request",
      related_entity_id: request.id,
    });
  }

  revalidatePath("/dashboard/mentee");
  revalidatePath("/dashboard/mentor");
  return { ok: true, requestId: request.id };
}
