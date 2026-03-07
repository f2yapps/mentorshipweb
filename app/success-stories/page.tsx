import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SuccessStoryCard } from "@/components/cards/SuccessStoryCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real achievements from our mentor-mentee pairs: scholarships, career advancement, and personal growth.",
};

export default async function SuccessStoriesPage() {
  const supabase = await createClient();
  let stories: {
    id: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    tags: string[];
    user_id: string;
    created_at: string;
  }[] = [];

  try {
    const { data: rows } = await supabase
      .from("success_stories")
      .select("id, title, excerpt, content, cover_image_url, tags, user_id, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (rows?.length) {
      stories = rows.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        title: r.title as string,
        excerpt: (r.excerpt as string | null) ?? null,
        content: r.content as string,
        cover_image_url: r.cover_image_url as string | null,
        tags: (r.tags as string[]) ?? [],
        user_id: r.user_id as string,
        created_at: r.created_at as string,
      }));
    }
  } catch {
    stories = [];
  }

  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Success Stories</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Real achievements from our community: scholarships, career advancement,
            research, and entrepreneurship. Every story starts with a mentor who believed.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        {stories.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div key={story.id} id={story.id} className="scroll-mt-24">
              <SuccessStoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                excerpt={story.excerpt ?? story.content.slice(0, 200) + (story.content.length > 200 ? "…" : "")}
                outcome={story.tags[0] ?? "Mentorship"}
                category={story.tags[0] ?? undefined}
                imageUrl={story.cover_image_url}
                href={`/success-stories#${story.id}`}
              />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-2xl border border-earth-200 bg-white p-10 text-center shadow-soft">
            <p className="text-6xl" aria-hidden>✨</p>
            <h2 className="mt-4 text-xl font-semibold text-earth-900">Success stories are on the way</h2>
            <p className="mt-3 text-earth-600">
              When mentees and mentors complete their journeys and share outcomes, their stories will appear here. Be the first to add yours by connecting with a mentor and achieving your goals.
            </p>
            <Link href="/mentors" className="btn-primary mt-8 inline-flex">
              Find a mentor
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
