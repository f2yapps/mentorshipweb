import type { Metadata } from "next";
import { ResourceCard } from "@/components/cards/ResourceCard";

export const metadata: Metadata = {
  title: "Resources & Learning Hub",
  description:
    "Scholarship guides, resume templates, interview prep, and career development resources for mentees.",
};

const CATEGORIES = [
  {
    id: "scholarship-guides",
    name: "Scholarship Guides",
    resources: [
      {
        id: "sg-1",
        title: "How to Find and Apply for Scholarships",
        description: "Step-by-step guide to discovering scholarships and writing strong applications.",
        type: "guide" as const,
      },
      {
        id: "sg-2",
        title: "Statement of Purpose Template",
        description: "A structured template and examples for SoP essays for graduate programs.",
        type: "template" as const,
      },
      {
        id: "sg-3",
        title: "Recommendation Letter Guide",
        description: "How to request and use recommendation letters effectively.",
        type: "guide" as const,
      },
    ],
  },
  {
    id: "resume-cv",
    name: "Resume / CV",
    resources: [
      {
        id: "cv-1",
        title: "Tech Resume Template (ATS-Friendly)",
        description: "Clean, ATS-optimized resume template for software and data roles.",
        type: "template" as const,
      },
      {
        id: "cv-2",
        title: "Academic CV Template",
        description: "Format and sections for academic and research positions.",
        type: "template" as const,
      },
      {
        id: "cv-3",
        title: "Writing Strong Bullet Points",
        description: "Turn your experience into impact-focused bullet points.",
        type: "article" as const,
      },
    ],
  },
  {
    id: "interview-prep",
    name: "Interview Preparation",
    resources: [
      {
        id: "ip-1",
        title: "Technical Interview Prep Roadmap",
        description: "Structured plan for coding and system design interview preparation.",
        type: "guide" as const,
      },
      {
        id: "ip-2",
        title: "Behavioral Interview Questions",
        description: "Common STAR-format questions and how to answer them.",
        type: "article" as const,
      },
      {
        id: "ip-3",
        title: "Salary Negotiation Tips",
        description: "How to research and negotiate your offer with confidence.",
        type: "article" as const,
      },
    ],
  },
  {
    id: "career-development",
    name: "Career Development",
    resources: [
      {
        id: "cd-1",
        title: "Building a Personal Brand Online",
        description: "LinkedIn, portfolio, and visibility for early-career professionals.",
        type: "guide" as const,
      },
      {
        id: "cd-2",
        title: "Networking for Introverts",
        description: "Practical ways to build connections without burning out.",
        type: "article" as const,
      },
      {
        id: "cd-3",
        title: "Transitioning into Tech",
        description: "Paths from non-tech backgrounds into software, data, and AI roles.",
        type: "guide" as const,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Resources & Learning Hub</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Free guides, templates, and articles to support your scholarship applications,
            resume building, interview prep, and career growth.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="space-y-14">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-xl font-bold text-earth-900 sm:text-2xl">{cat.name}</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cat.resources.map((r) => (
                  <ResourceCard
                    key={r.id}
                    id={r.id}
                    title={r.title}
                    description={r.description}
                    category={cat.name}
                    type={r.type}
                    href={`/resources#${r.id}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
