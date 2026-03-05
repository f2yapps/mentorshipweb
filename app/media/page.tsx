import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Media Gallery",
  description: "Photos, videos, and audio shared by our global mentorship community.",
};

export default async function MediaGalleryPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: mediaPosts } = await supabase
      .from("media_posts")
      .select(`*, user:users(id, name, avatar_url)`)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);

    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="section-heading">Media Gallery</h1>
            <p className="mt-2 text-earth-600">
              Photos, videos, and audio from our global mentorship community
            </p>
          </div>
          {user && (
            <Link href="/media/upload" className="btn-primary shrink-0">
              + Upload Media
            </Link>
          )}
        </div>

        {!mediaPosts || mediaPosts.length === 0 ? (
          <div className="mt-12 rounded-xl border border-earth-200 bg-earth-50 py-16 text-center">
            <p className="text-4xl">🎞️</p>
            <p className="mt-4 text-lg font-medium text-earth-700">No media posts yet</p>
            <p className="mt-1 text-sm text-earth-500">
              Be the first to share a photo, video, or audio with the community.
            </p>
            {user && (
              <Link href="/media/upload" className="btn-primary mt-6 inline-flex">
                Share Something
              </Link>
            )}
            {!user && (
              <Link href="/auth/register" className="btn-primary mt-6 inline-flex">
                Join to Share
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mediaPosts.map((post) => (
              <div key={post.id} className="card overflow-hidden">
                {/* Media Preview */}
                <div className="relative aspect-video bg-earth-100">
                  {post.media_type === "image" && (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {post.media_type === "video" && (
                    post.media_url?.includes("youtube.com/embed") || post.media_url?.includes("player.vimeo.com") ? (
                      <iframe
                        src={post.media_url}
                        title={post.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={post.media_url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    )
                  )}
                  {post.media_type === "audio" && (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                      <span className="text-5xl">🎵</span>
                      <audio src={post.media_url} controls className="w-full" />
                    </div>
                  )}
                  {/* Type badge */}
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                    {post.media_type === "image" && "📷 Photo"}
                    {post.media_type === "video" && "🎥 Video"}
                    {post.media_type === "audio" && "🎵 Audio"}
                  </span>
                </div>

                {/* Post Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-earth-900 line-clamp-1">{post.title}</h3>
                  {post.description && (
                    <p className="mt-1 text-sm text-earth-600 line-clamp-2">{post.description}</p>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.slice(0, 4).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author & Time */}
                  <div className="mt-3 flex items-center justify-between border-t border-earth-100 pt-3 text-xs text-earth-500">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-earth-200 text-xs font-medium text-earth-700">
                        {(post.user?.name ?? "A").charAt(0).toUpperCase()}
                      </span>
                      <span>{post.user?.name ?? "Community Member"}</span>
                    </div>
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
