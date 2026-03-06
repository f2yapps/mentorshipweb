import type { Metadata } from "next";
import { SuccessStoryCard } from "@/components/cards/SuccessStoryCard";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real achievements from our mentor–mentee pairs: scholarships, career advancement, and personal growth.",
};

const SUCCESS_STORIES = [
  {
    id: "scholarship-1",
    title: "From Local University to Full Scholarship Abroad",
    excerpt:
      "With my mentor's guidance on application essays and interview prep, I secured a full scholarship to a top European university for my master's in data science.",
    outcome: "Full scholarship to MSc Data Science program",
    menteeName: "Aisha M.",
    mentorName: "David K.",
    category: "Scholarship",
  },
  {
    id: "career-1",
    title: "First Tech Role in Four Months",
    excerpt:
      "I had the skills but didn't know how to present them. My mentor helped me refine my CV, practice interviews, and negotiate my first software engineering offer.",
    outcome: "Software Engineer at a growing startup",
    menteeName: "Samuel T.",
    mentorName: "Jennifer L.",
    category: "Career",
  },
  {
    id: "research-1",
    title: "Published My First Paper with Mentor Support",
    excerpt:
      "My mentor walked me through the research process, paper structure, and submission strategy. We got accepted to a reputable conference within a year.",
    outcome: "Conference paper accepted",
    menteeName: "Fatima N.",
    mentorName: "Michael R.",
    category: "Research",
  },
  {
    id: "startup-1",
    title: "From Idea to First Customers",
    excerpt:
      "I had an idea but no business background. My mentor helped me validate the concept, build a minimal product, and land our first 10 paying customers.",
    outcome: "Launched MVP with 10+ customers",
    menteeName: "Omar H.",
    mentorName: "Sarah P.",
    category: "Entrepreneurship",
  },
  {
    id: "career-2",
    title: "Pivoting into AI from a Different Field",
    excerpt:
      "I was in marketing and wanted to move into ML. My mentor suggested a learning path, projects to build, and how to position my transition to employers.",
    outcome: "ML Engineer role at tech company",
    menteeName: "Lina K.",
    mentorName: "James W.",
    category: "Career",
  },
  {
    id: "scholarship-2",
    title: "PhD Application Success",
    excerpt:
      "Applying for PhD programs felt overwhelming. My mentor helped me choose programs, draft research statements, and prepare for interviews. I got into my dream school.",
    outcome: "PhD admission with funding",
    menteeName: "Yusuf A.",
    mentorName: "Emily C.",
    category: "Scholarship",
  },
];

export default function SuccessStoriesPage() {
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SUCCESS_STORIES.map((story) => (
            <SuccessStoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              excerpt={story.excerpt}
              outcome={story.outcome}
              menteeName={story.menteeName}
              mentorName={story.mentorName}
              category={story.category}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
