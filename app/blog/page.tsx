import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Articles on mentorship, career development, scholarships, and stories from our community.",
};

const POSTS = [
  {
    id: "1",
    slug: "why-mentorship-matters",
    title: "Why Mentorship Matters for Early-Career Professionals",
    excerpt:
      "Access to experienced guides can accelerate your learning, open doors, and build confidence. Here's what the research says and how to get started.",
    author: "Platform Team",
    date: "2025-02-15",
    category: "Mentorship",
    image: null,
  },
  {
    id: "2",
    slug: "scholarship-tips-2025",
    title: "Scholarship Application Tips for 2025",
    excerpt:
      "A roundup of practical advice from our mentors: timelines, common mistakes, and how to stand out in a competitive pool.",
    author: "Platform Team",
    date: "2025-02-01",
    category: "Scholarships",
    image: null,
  },
  {
    id: "3",
    slug: "transitioning-into-tech",
    title: "Transitioning into Tech: Three Paths That Work",
    excerpt:
      "Whether you're coming from another field or just starting out, here are three proven paths into software, data, and AI roles.",
    author: "Platform Team",
    date: "2025-01-20",
    category: "Career",
    image: null,
  },
  {
    id: "4",
    slug: "mentor-spotlight-david",
    title: "Mentor Spotlight: How David Supports Scholars from Africa",
    excerpt:
      "A conversation with one of our most active mentors on his motivation, approach, and the impact he's seen.",
    author: "Platform Team",
    date: "2025-01-10",
    category: "Community",
    image: null,
  },
  {
    id: "5",
    slug: "building-resilience",
    title: "Building Resilience in Your Career Journey",
    excerpt:
      "Rejection and setbacks are part of the process. Learn how to stay motivated and keep moving forward.",
    author: "Platform Team",
    date: "2024-12-28",
    category: "Personal Growth",
    image: null,
  },
];

const CATEGORIES = ["All", "Mentorship", "Scholarships", "Career", "Community", "Personal Growth"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Blog & Insights</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Articles, tips, and stories from our community on mentorship, careers,
            scholarships, and personal growth.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full bg-earth-100 px-4 py-1.5 text-sm font-medium text-earth-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {POSTS.map((post) => (
            <article key={post.id} className="card-hover overflow-hidden">
              {post.image ? (
                <div className="aspect-video w-full bg-earth-100">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-primary-50 to-earth-100 text-primary-200">
                  <span className="text-6xl font-serif">&ldquo;</span>
                </div>
              )}
              <div className="p-6 sm:p-8">
                <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                  {post.category}
                </span>
                <h2 className="mt-3 text-xl font-bold text-earth-900 sm:text-2xl">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-earth-600 leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-earth-500">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date)}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
