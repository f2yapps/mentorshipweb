import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to get free mentorship in AI, technology, and career development, or how to become a volunteer mentor to empower youth worldwide.",
};

const MENTEE_STEPS = [
  { icon: "📝", title: "Create a free account", desc: "Sign up as a mentee — no payment required. Takes under 2 minutes." },
  { icon: "🎯", title: "Complete your profile", desc: "Share your goals, interests, and areas where you want to grow (AI, tech, career, etc.)." },
  { icon: "🔍", title: "Browse the directory", desc: "Use filters to find mentors by expertise, country, or language that fits your needs." },
  { icon: "✉️", title: "Send a request", desc: "Write a short message explaining your goals and what you hope to learn from the mentor." },
  { icon: "📅", title: "Connect & start", desc: "When a mentor accepts, connect via their preferred method — video, email, or chat." },
  { icon: "📈", title: "Track your journey", desc: "View and manage your active mentorships from your personal Dashboard." },
];

const MENTOR_STEPS = [
  { icon: "🤝", title: "Sign up as a mentor", desc: "Create an account — volunteering is free and takes just a few minutes." },
  { icon: "💼", title: "Build your profile", desc: "Share your expertise in AI, technology, career development, or any area you can help with." },
  { icon: "🕐", title: "Set your availability", desc: "Choose how many hours per week you can commit and your preferred communication channels." },
  { icon: "✅", title: "Get verified & go live", desc: "Once reviewed, your profile appears in the Mentor Directory for scholars to discover." },
  { icon: "📬", title: "Receive requests", desc: "Mentees will send you requests. Review them and accept the ones that match your expertise." },
  { icon: "🌍", title: "Make an impact", desc: "Guide a young person across the world — one conversation can change the trajectory of a life." },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-earth-50 to-earth-100 px-4 py-16 sm:px-6 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, #d5cfbc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative container-wide text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
            ✨ Simple, free, global
          </span>
          <h1 className="section-heading mt-6 text-balance text-4xl sm:text-5xl">
            How the platform works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-700">
            Getting started is simple and completely free — whether you&apos;re seeking
            mentorship or ready to give back as a volunteer mentor.
          </p>
        </div>
      </section>

      {/* ── Mentee path ─────────────────────────────────────────────────── */}
      <section className="container-wide py-16 sm:py-20">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-2xl">
            🎓
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-earth-900">For Mentees (Scholars)</h2>
        </div>
        <p className="mt-2 text-earth-600">
          You&apos;re a student or young professional looking for expert guidance in tech, AI, or career growth.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENTEE_STEPS.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="card-glow group rounded-2xl border border-earth-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {i + 1}
                </span>
                <span className="text-xl">{icon}</span>
              </div>
              <h3 className="mt-3 font-semibold text-earth-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-earth-600">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/auth/register?role=mentee" className="btn-primary">
            Get Free Mentorship →
          </Link>
        </div>
      </section>

      {/* ── Mentor path ─────────────────────────────────────────────────── */}
      <section className="bg-earth-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="container-wide">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-200 text-2xl">
              🌟
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-earth-900">For Mentors (Volunteers)</h2>
          </div>
          <p className="mt-2 text-earth-600">
            You&apos;re an experienced professional ready to share your knowledge and make a lasting impact.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MENTOR_STEPS.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="card-glow group rounded-2xl border border-earth-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-earth-200 text-xs font-bold text-earth-700">
                    {i + 1}
                  </span>
                  <span className="text-xl">{icon}</span>
                </div>
                <h3 className="mt-3 font-semibold text-earth-900">{title}</h3>
                <p className="mt-1 text-sm text-earth-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/auth/register?role=mentor" className="btn-secondary">
              Volunteer as Mentor →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="container-wide mx-auto max-w-3xl py-16 sm:py-20">
        <h2 className="section-heading text-center">Common Questions</h2>
        <div className="mt-8 space-y-4">
          {[
            { q: "Is this really free?", a: "Yes — 100% free for everyone, always. Mentors volunteer their time. There are no subscriptions, no premium tiers, no hidden fees." },
            { q: "How long does a mentorship last?", a: "There's no fixed duration. Some mentorships are a few sessions; others become long-term relationships. It's up to you and your mentor." },
            { q: "What languages are supported?", a: "Mentors speak many languages including English, Amharic, Oromo, Tigrinya, French, Arabic, Spanish, and more. Filter by language in the directory." },
            { q: "How are mentors vetted?", a: "Every mentor profile is reviewed by our team before appearing in the public directory. We check for genuine expertise and professional background." },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="card-glow group cursor-pointer rounded-2xl border border-earth-100 bg-white p-5 shadow-soft transition-all duration-300 open:shadow-soft-lg open:border-primary-200"
            >
              <summary className="flex items-center justify-between font-medium text-earth-900 list-none">
                {q}
                <span className="ml-4 text-primary-500 transition group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-sm text-earth-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-20 text-white sm:px-6">
        <div className="blob-float pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="blob-float-delay pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to Start?</h2>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 font-semibold text-primary-700 shadow-2xl transition hover:bg-primary-50 hover:-translate-y-1"
            >
              Get Mentored
            </Link>
            <Link
              href="/auth/register?role=mentor"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/10 hover:-translate-y-1"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
