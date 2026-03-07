import type { Metadata } from "next";
import { ResourceCard } from "@/components/cards/ResourceCard";

export const metadata: Metadata = {
  title: "Resources & Learning Hub",
  description:
    "Curated links to scholarship guides, resume tips, interview prep, and career development resources.",
};

const CATEGORIES = [
  {
    id: "scholarship-guides",
    name: "Scholarship Guides",
    resources: [
      {
        id: "sg-1",
        title: "Scholarships for Development (Scholars4Dev)",
        description: "Database of scholarships for students from developing countries - master's, PhD, and short courses.",
        type: "guide" as const,
        href: "https://www.scholars4dev.com",
        external: true,
      },
      {
        id: "sg-2",
        title: "DAAD Scholarship Database",
        description: "Official German Academic Exchange Service database for studying in Germany.",
        type: "guide" as const,
        href: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
        external: true,
      },
      {
        id: "sg-3",
        title: "StudyPortals Scholarships",
        description: "Search scholarships worldwide by country, level, and subject.",
        type: "guide" as const,
        href: "https://www.studyportals.com/scholarships/",
        external: true,
      },
    ],
  },
  {
    id: "resume-cv",
    name: "Resume & CV",
    resources: [
      {
        id: "cv-1",
        title: "Google Docs Resume Templates",
        description: "Free, professional resume templates you can edit and download.",
        type: "template" as const,
        href: "https://docs.google.com/document/u/0/?tgif=d&ftv=1",
        external: true,
      },
      {
        id: "cv-2",
        title: "Harvard FAS Resume & Cover Letter Guide",
        description: "Guidance on structure, content, and tailoring from Harvard's career office.",
        type: "guide" as const,
        href: "https://ocs.fas.harvard.edu/resume-cover-letter-guide",
        external: true,
      },
      {
        id: "cv-3",
        title: "LinkedIn Profile Tips",
        description: "Build a strong LinkedIn profile to attract recruiters and mentors.",
        type: "article" as const,
        href: "https://www.linkedin.com/help/linkedin/answer/a521928",
        external: true,
      },
    ],
  },
  {
    id: "interview-prep",
    name: "Interview Preparation",
    resources: [
      {
        id: "ip-1",
        title: "LeetCode (Coding Practice)",
        description: "Practice coding problems commonly used in technical interviews.",
        type: "tool" as const,
        href: "https://leetcode.com",
        external: true,
      },
      {
        id: "ip-2",
        title: "Glassdoor Interview Questions",
        description: "Real interview questions shared by candidates at thousands of companies.",
        type: "article" as const,
        href: "https://www.glassdoor.com/Interview/",
        external: true,
      },
      {
        id: "ip-3",
        title: "STAR Method (Behavioral Interviews)",
        description: "NHS guide to answering competency-based questions using Situation, Task, Action, Result.",
        type: "guide" as const,
        href: "https://www.nhscareers.nhs.uk/explore-by-career/wider-healthcare-team/careers-in-the-wider-healthcare-team/working-in-the-wider-healthcare-team/star-approach/",
        external: true,
      },
    ],
  },
  {
    id: "career-development",
    name: "Career Development",
    resources: [
      {
        id: "cd-1",
        title: "Coursera - Career Success Specialization",
        description: "Free courses on communication, project management, and career planning.",
        type: "guide" as const,
        href: "https://www.coursera.org",
        external: true,
      },
      {
        id: "cd-2",
        title: "Idealist - Jobs & Internships in Social Impact",
        description: "Find roles at nonprofits and social enterprises worldwide.",
        type: "tool" as const,
        href: "https://www.idealist.org",
        external: true,
      },
      {
        id: "cd-3",
        title: "Remote Work Resources (We Work Remotely)",
        description: "Remote job board and tips for working from anywhere.",
        type: "article" as const,
        href: "https://weworkremotely.com",
        external: true,
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
            Curated links to free, trusted resources for scholarships, resumes, interviews, and career growth. All links open in a new tab.
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
                    href={r.href}
                    external={r.external}
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
