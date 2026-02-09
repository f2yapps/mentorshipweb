import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Mentorship categories: Academics, Career, Life, Relationships, Mental Health, Entrepreneurship, Tech, Agriculture, Leadership, Immigration, Faith & Purpose.",
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">Mentorship Categories</h1>
      <p className="mt-4 text-earth-700">
        Find support in the area that matters to you. Browse mentors by category.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {categories?.length
          ? categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/mentors?category=${encodeURIComponent(cat.name)}`}
                className="card block p-6 transition hover:border-primary-300 hover:shadow-md"
              >
                <h2 className="font-semibold text-earth-900">{cat.name}</h2>
                {cat.description && (
                  <p className="mt-2 text-sm text-earth-600">{cat.description}</p>
                )}
                <span className="mt-2 inline-block text-sm font-medium text-primary-600">
                  Find mentors →
                </span>
              </Link>
            ))
          : (
            <div className="col-span-2 rounded-lg border border-earth-200 bg-earth-50 p-8 text-center text-earth-600">
              No categories yet. Run the Supabase seed script to add categories, or add them in the database.
            </div>
          )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/mentors" className="btn-primary">
          Browse all mentors
        </Link>
      </div>
    </div>
  );
}
