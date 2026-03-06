import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Heart, Globe, Award } from "lucide-react";
import { MentorApplicationForm } from "@/components/mentors/MentorApplicationForm";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description:
    "Join our volunteer mentor community. Share your expertise and help scholars worldwide achieve their goals.",
};

const BENEFITS = [
  {
    icon: Heart,
    title: "Give back",
    description: "Make a real impact on someone's education and career without leaving your desk.",
  },
  {
    icon: Globe,
    title: "Global reach",
    description: "Connect with mentees across Africa, Asia, and Latin America from anywhere.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Get recognized as a verified mentor and build your reputation in the community.",
  },
];

const REQUIREMENTS = [
  "Relevant experience in at least one mentorship area (e.g. tech, career, scholarships)",
  "Ability to commit a few hours per month for at least 3 months",
  "Good communication skills and willingness to support someone's goals",
  "Respect for diversity and different backgrounds",
];

export default function BecomeAMentorPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Become a Mentor</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Share your expertise with scholars worldwide. Volunteer a few hours a month
            and help someone unlock their potential.
          </p>
          <Link href="#apply" className="btn-primary mt-8 inline-flex">
            Apply now
          </Link>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <h2 className="section-heading text-center">Why mentor with us?</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-hover p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-earth-900">{title}</h3>
              <p className="mt-2 text-sm text-earth-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-earth-100 bg-white py-12 sm:py-16">
        <div className="container-narrow">
          <h2 className="section-heading">Eligibility requirements</h2>
          <p className="mt-2 text-earth-600">
            We want mentors who can offer consistent, supportive guidance. You should:
          </p>
          <ul className="mt-6 space-y-3">
            {REQUIREMENTS.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span className="text-earth-700">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="section-heading">Application form</h2>
          <p className="mt-2 text-earth-600">
            Tell us about your background and why you want to mentor. We'll review and get back to you.
          </p>
          <div className="mt-8">
            <MentorApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
