"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
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

  // Use admin client for the insert so any remaining DB triggers run as service_role (bypasses RLS)
  const admin = createAdminClient();
  const { data: request, error: insertError } = await admin
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
  try {
    if (mentor?.user_id) {
      const notifMsg = `${menteeName} sent you a mentorship request in ${category}.`;
      const admin = createAdminClient();
      await admin.from("notifications").insert({
        user_id: mentor.user_id,
        type: "mentorship_request",
        title: "New mentorship request",
        message: notifMsg,
        body: notifMsg,
        related_entity_type: "mentorship_request",
        related_entity_id: request.id,
      });
    }
  } catch {
    // Notification failure must never block the request creation
  }

  revalidatePath("/dashboard/mentee");
  revalidatePath("/dashboard/mentor");
  return { ok: true, requestId: request.id };
}

export type UpdateStatusResult = { ok: true } | { ok: false; error: string };

export async function updateMentorshipStatus(
  requestId: string,
  status: "accepted" | "declined"
): Promise<UpdateStatusResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("mentorship_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) return { ok: false, error: error.message };

  if (status === "accepted") {
    try {
      const { data: req } = await supabase
        .from("mentorship_requests")
        .select("mentee_id, mentor_id")
        .eq("id", requestId)
        .single();

      if (req) {
        const { data: menteeRow } = await supabase
          .from("mentees")
          .select("user_id")
          .eq("id", req.mentee_id)
          .single();

        const { data: mentorUser } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (menteeRow?.user_id) {
          const msg = `${mentorUser?.name ?? "A mentor"} accepted your mentorship request. Check your dashboard to schedule a meeting.`;
          const admin = createAdminClient();
          await admin.from("notifications").insert({
            user_id: menteeRow.user_id,
            type: "mentorship_accepted",
            title: "Your mentorship request was accepted!",
            message: msg,
            body: msg,
            related_entity_type: "mentorship_request",
            related_entity_id: requestId,
          });
        }
      }
    } catch {
      // Notification failure must never block the accept
    }
  }

  revalidatePath("/dashboard/mentor");
  revalidatePath("/dashboard/mentee");
  return { ok: true };
}
