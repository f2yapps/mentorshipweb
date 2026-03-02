import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { MediaUploadForm } from "@/components/media/MediaUploadForm";

export default async function UploadMediaPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/media/upload");

    return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
          <p className="mt-2 text-gray-600">
            Share photos, videos, or audio with the community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <MediaUploadForm userId={user.id} />
        </div>
      </div>
    </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
