import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";

export const metadata: Metadata = {
  title: "Mentorship Areas",
  description:
    "Find mentors in AI & Machine Learning, Software Development, Data Science, Career Development, Tech Entrepreneurship, Digital Skills, and more.",
};

// Emoji icons keyed by category name (partial match)
const CATEGORY_ICONS: Record<string, string> = {
  "Artificial Intelligence": "🤖",
  "AI": "🤖",
  "Software Development": "💻",
  "Software": "💻",
  "Data Science": "📊",
  "Data": "📊",
  "Career Development": "💼",
  "Career": "💼",
  "Entrepreneurship": "🚀",
  "Cloud Computing": "☁️",
  "Cloud": "☁️",
  "DevOps": "☁️",
  "Cybersecurity": "🔒",
  "UI/UX": "🎨",
  "Design": "🎨",
  "Academic": "🎓",
  "Leadership": "🌍",
  "Personal Development": "🌱",
  "Personal": "🌱",
  "Digital Skills": "📱",
  "Digital": "📱",
  "Faith": "🌟",
  "Immigration": "✈️",
};

function getIcon(name: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "📚";
}

export default async function CategoriesPage() {
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, slug, description, sort_order")
      .order("sort_order", { ascending: true });

    return (
      <div>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary-50 to-earth-100 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="section-heading">Mentorship Areas</h1>
            <p className="mx-auto mt-4 max-w-2xl text-earth-700">
              Explore all available mentorship categories. Click any area to browse
              mentors who specialize in that field.
            </p>
          </div>
        </section>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          {categories?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/mentors?category=${encodeURIComponent(cat.name)}`}
                  className="card group flex gap-4 p-6 transition hover:border-primary-300 hover:shadow-md"
                >
                  <span className="text-3xl">{getIcon(cat.name)}</span>
                  <div className="flex-1">
                    <h2 className="font-semibold text-earth-900 group-hover:text-primary-700 transition">
                      {cat.name}
                    </h2>
                    {cat.description && (
                      <p className="mt-1 text-sm text-earth-600 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                    <span className="mt-2 inline-block text-xs font-medium text-primary-600">
                      Find mentors →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-earth-200 bg-earth-50 py-16 text-center">
              <p className="text-4xl">📚</p>
              <p className="mt-4 font-medium text-earth-700">
                Mentorship areas are being set up
              </p>
              <p className="mt-1 text-sm text-earth-500">
                Run the category seed script in Supabase to populate this page.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/mentors" className="btn-primary">
              Browse All Mentors
            </Link>
          </div>
        </section>
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="section-heading">Mentorship Areas</h1>
        <p className="mt-4 text-earth-600">
          We couldn&apos;t load categories right now. Please try again later.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Go Home
        </Link>
      </div>
    );
  }
}
