import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to get mentored in AI, technology, and career development, or become a mentor to empower youth worldwide.",
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
          <h2 className="text-lg font-semibold text-earth-900">For Young People Seeking Mentorship</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-earth-700">
            <li>Sign up and create your free account as a mentee.</li>
            <li>Complete your profile: share your goals, interests, and areas where you want to grow (AI, tech, career, etc.).</li>
            <li>Browse the <Link href="/mentors" className="text-primary-600 hover:underline">Mentor Directory</Link> and filter by expertise, country, or language.</li>
            <li>Send a mentorship request with a message explaining what you hope to learn.</li>
            <li>When a mentor accepts, connect via their preferred method (video call, email, or chat).</li>
            <li>Track your mentorship journey in your <Link href="/dashboard/mentee" className="text-primary-600 hover:underline">Dashboard</Link>.</li>
          </ol>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-earth-900">For Mentors</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-earth-700">
            <li>Sign up and create your mentor account—it's completely voluntary and free.</li>
            <li>Complete your profile: share your expertise in AI, technology, career development, or other areas.</li>
            <li>Set your availability and preferred communication methods (video, email, chat).</li>
            <li>Once approved, you'll appear in the Mentor Directory for young people to discover.</li>
            <li>Receive mentorship requests and view them in your <Link href="/dashboard/mentor" className="text-primary-600 hover:underline">Mentor Dashboard</Link>.</li>
            <li>Accept requests that align with your expertise and start making an impact in a young person's life.</li>
          </ol>
        </div>

        <div className="rounded-lg bg-primary-50 p-6">
          <h2 className="text-lg font-semibold text-primary-900">Join the Movement</h2>
          <p className="mt-2 text-primary-800">
            Whether you're seeking guidance in AI and tech, or ready to share your expertise with the next generation, 
            start your journey today—completely free.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/auth/register?role=mentee" className="btn-primary">
              Get Mentored
            </Link>
            <Link href="/auth/register?role=mentor" className="btn-secondary">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
