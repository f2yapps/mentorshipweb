import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to sign up as a mentor or mentee, request or offer mentorship, and connect.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">How It Works</h1>
      <p className="mt-4 text-earth-700">
        Getting started is simple. Choose your path below.
      </p>

      <section className="mt-10 space-y-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-earth-900">For Mentees</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-earth-700">
            <li>Sign up and create an account as a mentee.</li>
            <li>Complete your profile: goals and preferred categories (e.g. Career, Academics).</li>
            <li>Browse the <Link href="/mentors" className="text-primary-600 hover:underline">Mentor Directory</Link> and filter by category, country, or language.</li>
            <li>Send a mentorship request to a mentor with a short message.</li>
            <li>When the mentor accepts, connect via their preferred method (chat, email, or video).</li>
            <li>Track your requests and sessions in your <Link href="/dashboard/mentee" className="text-primary-600 hover:underline">Mentee Dashboard</Link>.</li>
          </ol>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-earth-900">For Mentors</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-earth-700">
            <li>Sign up and create an account as a mentor.</li>
            <li>Complete your mentor profile: expertise categories, interests, availability, languages, and preferred communication (chat, email, video).</li>
            <li>Once verified (or after approval, depending on settings), you appear in the Mentor Directory.</li>
            <li>Receive mentorship requests from mentees and view them in your <Link href="/dashboard/mentor" className="text-primary-600 hover:underline">Mentor Dashboard</Link>.</li>
            <li>Accept or decline requests and connect with mentees via your preferred channel.</li>
          </ol>
        </div>

        <div className="rounded-lg bg-primary-50 p-6">
          <h2 className="text-lg font-semibold text-primary-900">Ready to start?</h2>
          <p className="mt-2 text-primary-800">
            Create an account and choose whether you need a mentor or want to offer mentorship.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/auth/register?role=mentee" className="btn-primary">
              I need a mentor
            </Link>
            <Link href="/auth/register?role=mentor" className="btn-secondary">
              I want to mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
