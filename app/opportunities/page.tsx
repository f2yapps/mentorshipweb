"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Calendar, Filter, ExternalLink } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  type: "scholarship" | "internship" | "aggregator" | "fellowship";
  organization: string;
  description: string;
  category: string;
  link: string;
};

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    title: "Scholarships for Development (Scholars4Dev)",
    type: "scholarship",
    organization: "Scholars4Dev",
    description: "Curated database of scholarships for students from developing countries — master's, PhD, and short courses worldwide.",
    category: "Education",
    link: "https://www.scholars4dev.com",
  },
  {
    id: "2",
    title: "DAAD Scholarships (Germany)",
    type: "scholarship",
    organization: "DAAD",
    description: "Official German Academic Exchange Service — funded study and research in Germany for international students.",
    category: "Education",
    link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
  },
  {
    id: "3",
    title: "Chevening Scholarships (UK)",
    type: "scholarship",
    organization: "UK Government",
    description: "Full scholarships for one-year master's degrees in the UK for future leaders from eligible countries.",
    category: "Education",
    link: "https://www.chevening.org",
  },
  {
    id: "4",
    title: "FindAPhD",
    type: "scholarship",
    organization: "FindAPhD",
    description: "Search for funded PhD projects and studentships in the UK, Europe and worldwide.",
    category: "Research",
    link: "https://www.findaphd.com",
  },
  {
    id: "5",
    title: "Idealist — Jobs & Internships",
    type: "internship",
    organization: "Idealist",
    description: "Internships and jobs at nonprofits and social enterprises globally; many remote and paid.",
    category: "Impact",
    link: "https://www.idealist.org",
  },
  {
    id: "6",
    title: "Remote OK — Remote Jobs",
    type: "internship",
    organization: "Remote OK",
    description: "Remote job board for software, design, and marketing roles — filter by internship or full-time.",
    category: "Tech",
    link: "https://remoteok.com",
  },
  {
    id: "7",
    title: "UN Careers & Internships",
    type: "internship",
    organization: "United Nations",
    description: "Official UN internships and entry-level positions worldwide.",
    category: "Impact",
    link: "https://careers.un.org",
  },
  {
    id: "8",
    title: "StudyPortals — Scholarships Worldwide",
    type: "aggregator",
    organization: "StudyPortals",
    description: "Search and compare scholarships by country, degree level, and subject.",
    category: "Education",
    link: "https://www.studyportals.com/scholarships/",
  },
];

const TYPE_LABELS: Record<string, string> = {
  scholarship: "Scholarship",
  internship: "Internship",
  aggregator: "Resource",
  fellowship: "Fellowship",
};

const TYPE_COLORS: Record<string, string> = {
  scholarship: "bg-green-100 text-green-700",
  internship: "bg-blue-100 text-blue-700",
  aggregator: "bg-purple-100 text-purple-700",
  fellowship: "bg-amber-100 text-amber-700",
};

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
            Trusted external links to scholarship databases, internship boards, and fellowship finders. We do not host applications — we point you to the right places.
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
          {filtered.map((o) => (
            <article key={o.id} className="card-hover flex flex-col p-6">
              <span
                className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  TYPE_COLORS[o.type] ?? "bg-earth-100 text-earth-700"
                }`}
              >
                {TYPE_LABELS[o.type]}
              </span>
              <h2 className="mt-3 font-semibold text-earth-900 line-clamp-2">{o.title}</h2>
              <p className="mt-1 text-sm text-earth-600">{o.organization}</p>
              <p className="mt-2 flex-1 text-sm text-earth-600 line-clamp-2">{o.description}</p>
              <div className="mt-4 border-t border-earth-100 pt-4">
                <a
                  href={o.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Visit site <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
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
