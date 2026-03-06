import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User } from "lucide-react";

const POSTS: Record<
  string,
  { title: string; body: string; author: string; date: string; category: string }
> = {
  "why-mentorship-matters": {
    title: "Why Mentorship Matters for Early-Career Professionals",
    author: "Platform Team",
    date: "2025-02-15",
    category: "Mentorship",
    body: `
Access to experienced guides can accelerate your learning, open doors, and build confidence. Here's what the research says and how to get started.

Mentorship isn't just a nice-to-have — it's one of the most reliable predictors of career satisfaction and advancement. For early-career professionals, especially those in developing countries with fewer local role models, connecting with a mentor can change the trajectory of your career.

In this article, we'll cover why mentorship matters, what to look for in a mentor, and how our platform makes it easy to find and connect with volunteer mentors worldwide.
    `.trim(),
  },
  "scholarship-tips-2025": {
    title: "Scholarship Application Tips for 2025",
    author: "Platform Team",
    date: "2025-02-01",
    category: "Scholarships",
    body: `
A roundup of practical advice from our mentors: timelines, common mistakes, and how to stand out in a competitive pool.

Applying for scholarships can feel overwhelming. Our mentors have helped dozens of scholars secure funding. Here are their top tips for 2025: start early, tailor each application, and get feedback on your essays from someone you trust.
    `.trim(),
  },
  "transitioning-into-tech": {
    title: "Transitioning into Tech: Three Paths That Work",
    author: "Platform Team",
    date: "2025-01-20",
    category: "Career",
    body: `
Whether you're coming from another field or just starting out, here are three proven paths into software, data, and AI roles.

Path 1: Bootcamps and structured programs. Path 2: Self-directed learning with projects. Path 3: Academic route (master's in CS or related). Each has trade-offs; a mentor can help you choose and stay on track.
    `.trim(),
  },
  "mentor-spotlight-david": {
    title: "Mentor Spotlight: How David Supports Scholars from Africa",
    author: "Platform Team",
    date: "2025-01-10",
    category: "Community",
    body: `
A conversation with one of our most active mentors on his motivation, approach, and the impact he's seen.

David has been mentoring on our platform for over a year. He shares why he volunteers his time, how he structures sessions, and a few success stories that keep him going.
    `.trim(),
  },
  "building-resilience": {
    title: "Building Resilience in Your Career Journey",
    author: "Platform Team",
    date: "2024-12-28",
    category: "Personal Growth",
    body: `
Rejection and setbacks are part of the process. Learn how to stay motivated and keep moving forward.

Everyone faces rejection — in job applications, scholarships, and projects. The difference between those who make it and those who give up often comes down to resilience. We share strategies from our community.
    `.trim(),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.body.slice(0, 160) };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-earth-50/50 py-12">
      <article className="container-narrow">
        <Link href="/blog" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          ← Back to Blog
        </Link>
        <header className="mt-6">
          <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            {post.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-earth-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {dateFormatted}
            </span>
          </div>
        </header>
        <div className="prose prose-earth mt-8 max-w-none">
          {post.body.split("\n\n").map((p, i) => (
            <p key={i} className="mt-4 text-earth-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-12 border-t border-earth-200 pt-8">
          <Link href="/blog" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            ← All posts
          </Link>
        </div>
      </article>
    </div>
  );
}
