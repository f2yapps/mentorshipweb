import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "media";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadMedia(
  supabase: SupabaseClient,
  file: File,
  path: string
): Promise<{ url: string } | { error: string }> {
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File must be under 5MB" };
  }
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) return { error: error.message };
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: urlData.publicUrl };
}
