"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteMediaPost(postId: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Only the post owner or an admin may delete
  const { data: userRow } = await supabase.from("users").select("role").eq("id", user.id).single();
  const { data: post } = await supabase.from("media_posts").select("user_id").eq("id", postId).single();

  if (!post) return { ok: false, error: "Post not found" };
  if (post.user_id !== user.id && userRow?.role !== "admin") {
    return { ok: false, error: "Not authorised" };
  }

  const { error } = await supabase.from("media_posts").delete().eq("id", postId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/media");
  return { ok: true };
}
