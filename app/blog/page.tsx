import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Articles on mentorship, career development, scholarships, and stories from our community.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = await createClient();
  let posts: { id: string; title: string; excerpt: string | null; content: string; created_at: string; tags: string[] }[] = [];

  try {
    const { data: rows } = await supabase
      .from("success_stories")
      .select("id, title, excerpt, content, created_at, tags")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (rows?.length) {
      posts = rows.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        title: r.title as string,
        excerpt: (r.excerpt as string | null) ?? null,
        content: r.content as string,
        created_at: r.created_at as string,
        tags: (r.tags as string[]) ?? [],
      }));
    }
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Blog & Insights</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Stories and reflections from our community. When members publish success stories, they appear here.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        {posts.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="card-hover overflow-hidden">
                <div className="p-6 sm:p-8">
                  {post.tags[0] && (
                    <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {post.tags[0]}
                    </span>
                  )}
                  <h2 className="mt-3 text-xl font-bold text-earth-900 sm:text-2xl">
                    <Link href={`/success-stories#${post.id}`} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-earth-600 leading-relaxed">
                    {post.excerpt ?? post.content.slice(0, 200) + (post.content.length > 200 ? "…" : "")}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-earth-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <Link
                    href={`/success-stories#${post.id}`}
                    className="mt-4 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-2xl border border-earth-200 bg-white p-10 text-center shadow-soft">
            <p className="text-6xl" aria-hidden>📝</p>
            <h2 className="mt-4 text-xl font-semibold text-earth-900">Insights coming soon</h2>
            <p className="mt-3 text-earth-600">
              When community members share success stories and reflections, they will appear here. In the meantime, explore our resources and find a mentor to start your journey.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/resources" className="btn-primary">
                Resources
              </Link>
              <Link href="/mentors" className="btn-secondary">
                Find a mentor
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
