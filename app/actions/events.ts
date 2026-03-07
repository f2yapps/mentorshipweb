"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateEventResult = { ok: true; eventId: string } | { ok: false; error: string };

export async function createEvent(formData: FormData): Promise<CreateEventResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "mentor" && profile?.role !== "admin") {
    return { ok: false, error: "Only mentors and admins can create events" };
  }

  const tagsRaw = (formData.get("tags") as string | null) ?? "";
  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const { data: event, error } = await supabase
    .from("workshop_events")
    .insert({
      title:            formData.get("title") as string,
      description:      (formData.get("description") as string) || null,
      event_type:       (formData.get("event_type") as string) || "workshop",
      event_date:       formData.get("event_date") as string,
      event_time:       formData.get("event_time") as string,
      timezone:         (formData.get("timezone") as string) || "UTC",
      duration_minutes: parseInt((formData.get("duration_minutes") as string) || "60", 10),
      location:         (formData.get("location") as string) || null,
      is_online:        formData.get("is_online") === "true",
      zoom_link:        (formData.get("zoom_link") as string) || null,
      google_meet_link: (formData.get("google_meet_link") as string) || null,
      language:         (formData.get("language") as string) || "English",
      max_attendees:    formData.get("max_attendees") ? parseInt(formData.get("max_attendees") as string, 10) : null,
      tags:             tags.length > 0 ? tags : null,
      host_id:          user.id,
      is_published:     true,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  if (!event?.id) return { ok: false, error: "Failed to create event" };

  revalidatePath("/events");
  return { ok: true, eventId: event.id };
}
