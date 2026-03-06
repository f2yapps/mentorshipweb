"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Calendar, Filter } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  type: "scholarship" | "internship" | "conference" | "fellowship";
  organization: string;
  description: string;
  deadline: string;
  category: string;
  link?: string;
};

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Global Tech Scholarship 2025",
    type: "scholarship",
    organization: "Tech Foundation",
    description: "Full scholarship for master's in computer science or related field at partner universities.",
    deadline: "2025-04-15",
    category: "Education",
    link: "#",
  },
  {
    id: "2",
    title: "Remote Software Engineering Internship",
    type: "internship",
    organization: "Startup Inc.",
    description: "12-week paid remote internship for students in Africa and Latin America.",
    deadline: "2025-03-30",
    category: "Tech",
    link: "#",
  },
  {
    id: "3",
    title: "AI & ML Conference — Travel Grant",
    type: "conference",
    organization: "ML Society",
    description: "Travel grants for accepted papers from underrepresented regions.",
    deadline: "2025-05-01",
    category: "Research",
    link: "#",
  },
  {
    id: "4",
    title: "Women in Data Science Fellowship",
    type: "fellowship",
    organization: "Data for Good",
    description: "6-month fellowship with stipend and mentorship for women in data science.",
    deadline: "2025-04-01",
    category: "Data Science",
    link: "#",
  },
  {
    id: "5",
    title: "PhD Positions in Europe (Funded)",
    type: "scholarship",
    organization: "EU Universities Network",
    description: "Multiple fully funded PhD positions for international students.",
    deadline: "2025-06-15",
    category: "Education",
    link: "#",
  },
  {
    id: "6",
    title: "Developer Advocacy Internship",
    type: "internship",
    organization: "Open Source Corp",
    description: "Summer internship for developers interested in community and advocacy.",
    deadline: "2025-03-20",
    category: "Tech",
    link: "#",
  },
];

const TYPE_LABELS: Record<string, string> = {
  scholarship: "Scholarship",
  internship: "Internship",
  conference: "Conference",
  fellowship: "Fellowship",
};

const TYPE_COLORS: Record<string, string> = {
  scholarship: "bg-green-100 text-green-700",
  internship: "bg-blue-100 text-blue-700",
  conference: "bg-purple-100 text-purple-700",
  fellowship: "bg-amber-100 text-amber-700",
};

function formatDeadline(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (days < 0) return { text: "Closed", dateStr, urgent: false };
  if (days <= 14) return { text: `${days} days left`, dateStr, urgent: true };
  return { text: dateStr, dateStr, urgent: false };
}

export default function OpportunitiesPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = OPPORTUNITIES.filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (categoryFilter !== "all" && o.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(OPPORTUNITIES.map((o) => o.category)));

  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Opportunities</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Scholarships, internships, conferences, and fellowships curated for our community.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-earth-200 bg-white p-4 shadow-soft">
          <span className="flex items-center gap-2 text-sm font-medium text-earth-700">
            <Filter className="h-4 w-4" /> Filter
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input w-auto min-w-[140px] py-2"
          >
            <option value="all">All types</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto min-w-[140px] py-2"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => {
            const { text, dateStr, urgent } = formatDeadline(o.deadline);
            return (
              <article
                key={o.id}
                className="card-hover flex flex-col p-6"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      TYPE_COLORS[o.type] ?? "bg-earth-100 text-earth-700"
                    }`}
                  >
                    {TYPE_LABELS[o.type]}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      urgent ? "text-red-600" : "text-earth-500"
                    }`}
                  >
                    {text}
                  </span>
                </div>
                <h2 className="mt-3 font-semibold text-earth-900 line-clamp-2">
                  {o.title}
                </h2>
                <p className="mt-1 text-sm text-earth-600">{o.organization}</p>
                <p className="mt-2 flex-1 text-sm text-earth-600 line-clamp-2">
                  {o.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-earth-100 pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-earth-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Deadline: {dateStr}
                  </span>
                  {o.link && (
                    <Link
                      href={o.link}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-earth-200 bg-earth-50 py-16 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-earth-400" />
            <p className="mt-4 font-medium text-earth-700">No opportunities match your filters.</p>
            <p className="mt-1 text-sm text-earth-500">Try adjusting the filters above.</p>
          </div>
        )}
      </section>
    </div>
  );
}
