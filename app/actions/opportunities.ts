"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BookmarkResult = { ok: true; bookmarked: boolean } | { ok: false; error: string };

export async function toggleBookmark(opportunityId: string): Promise<BookmarkResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from("saved_opportunities")
    .select("id")
    .eq("user_id", user.id)
    .eq("opportunity_id", opportunityId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_opportunities").delete().eq("id", existing.id);
    revalidatePath("/opportunities");
    revalidatePath("/opportunities/saved");
    return { ok: true, bookmarked: false };
  } else {
    const { error } = await supabase
      .from("saved_opportunities")
      .insert({ user_id: user.id, opportunity_id: opportunityId });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/opportunities");
    revalidatePath("/opportunities/saved");
    return { ok: true, bookmarked: true };
  }
}
