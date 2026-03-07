"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PostQuestionResult = { ok: true } | { ok: false; error: string };

const ALLOWED_CATEGORIES = ["Mentorship", "Career", "Scholarships", "Opportunities", "General"];

export async function postQuestion(body: string, category: string): Promise<PostQuestionResult> {
  const trimmed = body?.trim();
  if (!trimmed) return { ok: false, error: "Please enter a question." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to post a question." };

  const safeCategory = ALLOWED_CATEGORIES.includes(category) ? category : "General";

  const { error } = await supabase.from("community_discussions").insert({
    user_id: user.id,
    body: trimmed,
    category: safeCategory,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/community");
  return { ok: true };
}
