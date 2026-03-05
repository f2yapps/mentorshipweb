import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Global youth mentorship platform connecting scholars in developing countries with volunteer mentors worldwide in AI, technology, career development, and personal growth.",
};

const HOW_IT_WORKS = [
  {
    icon: "📝",
    step: "01",
    title: "Create Your Profile",
    desc: "Sign up in minutes as a mentee or mentor. Share your goals, expertise, and the areas where you want to grow or give back.",
  },
  {
    icon: "🔍",
    step: "02",
    title: "Find Your Match",
    desc: "Browse verified mentors by expertise, country, or language. Send a request with a personal message about what you hope to achieve.",
  },
  {
    icon: "🚀",
    step: "03",
    title: "Grow Together",
    desc: "Connect via video call, email, or chat. Build an ongoing relationship with a mentor who understands your goals and local context.",
  },
];

const MENTORSHIP_AREAS = [
  { icon: "🤖", label: "AI & Machine Learning" },
  { icon: "💻", label: "Software Development" },
  { icon: "📊", label: "Data Science" },
  { icon: "💼", label: "Career Development" },
  { icon: "🚀", label: "Entrepreneurship" },
  { icon: "☁️", label: "Cloud & DevOps" },
  { icon: "🔒", label: "Cybersecurity" },
  { icon: "🎨", label: "UI/UX Design" },
  { icon: "🎓", label: "Academic Success" },
  { icon: "🌱", label: "Personal Development" },
  { icon: "📱", label: "Digital Skills" },
  { icon: "🌍", label: "Leadership & Impact" },
];

const STATS = [
  { value: "14+", label: "Mentorship Areas" },
  { value: "Free", label: "Always & Forever" },
  { value: "Global", label: "Mentors Worldwide" },
  { value: "100%", label: "Volunteer-Powered" },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-24 text-white sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-primary-100 ring-1 ring-white/20">
            🌍 Connecting Mentors &amp; Scholars Worldwide
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Unlock Your Potential With a{" "}
            <span className="text-accent-gold">Global Mentor</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Volunteer mentors from developed countries connect with scholars and
            young professionals in developing countries — completely free, in AI,
            tech, career growth, and beyond.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              Find a Mentor →
            </Link>
            <Link
              href="/auth/register?role=mentor"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Volunteer as Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="border-b border-earth-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-earth-100 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-6 py-6 text-center">
              <p className="text-2xl font-bold text-primary-600 sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-earth-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="section-heading">Bridging the Mentorship Gap</h2>
        <p className="mx-auto mt-4 text-earth-700 sm:text-lg">
          Millions of talented young people in developing countries lack access to experienced
          guides in AI, technology, and career development. We connect them with volunteer
          mentors who have the expertise — and the heart — to help them thrive.
        </p>
        <Link href="/about" className="btn-secondary mt-8 inline-flex">
          Our Mission &amp; Story
        </Link>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="bg-earth-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="section-heading">How It Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-earth-600">
              Getting started takes just a few minutes — no fees, no gatekeepers.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="card relative p-8 text-center">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-bold text-white">
                  Step {step}
                </span>
                <span className="text-5xl">{icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-earth-900">{title}</h3>
                <p className="mt-2 text-sm text-earth-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/how-it-works" className="text-sm font-medium text-primary-600 underline underline-offset-4 hover:text-primary-700">
              Learn more about the process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mentorship Areas ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="section-heading">Mentorship Areas</h2>
          <p className="mx-auto mt-3 max-w-xl text-earth-600">
            Whatever your goal — AI, software, career, leadership — there are mentors
            ready to guide you.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MENTORSHIP_AREAS.map(({ icon, label }) => (
            <Link
              key={label}
              href={`/mentors?category=${encodeURIComponent(label)}`}
              className="card flex items-center gap-3 px-4 py-3 transition hover:border-primary-300 hover:shadow-md"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-medium text-earth-800">{label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/categories" className="btn-secondary">
            View All Mentorship Areas
          </Link>
        </div>
      </section>

      {/* ── Why Join ──────────────────────────────────────────────────────── */}
      <section className="bg-earth-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-heading text-center">Why This Platform?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🆓", title: "100% Free", desc: "No fees, subscriptions, or paywalls. Every mentorship is volunteer-powered and always will be." },
              { icon: "🌐", title: "Truly Global", desc: "Mentors across North America, Europe, and beyond. Mentees across Africa, Asia, and Latin America." },
              { icon: "🤝", title: "Real Relationships", desc: "Not just one-off Q&A. Build an ongoing relationship with a mentor who knows your context and goals." },
              { icon: "🎯", title: "Relevant Expertise", desc: "From AI and machine learning to career pivots and scholarship applications — real-world guidance." },
              { icon: "🗣️", title: "Your Language", desc: "Find mentors who speak English, Amharic, French, Arabic, Spanish, and many more languages." },
              { icon: "✅", title: "Safe & Verified", desc: "All mentors are reviewed before appearing in the directory, so you know who you're connecting with." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6">
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-3 font-semibold text-earth-900">{title}</h3>
                <p className="mt-2 text-sm text-earth-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="section-heading">Voices from Our Community</h2>
          <p className="mx-auto mt-3 max-w-xl text-earth-600">
            Real stories from mentors and scholars who are making it happen.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              quote: "My mentor helped me land my first software engineering role in just four months. Having someone who believed in me made all the difference.",
              name: "Aisha M.",
              role: "Mentee · Ethiopia",
              initials: "AM",
              color: "bg-primary-100 text-primary-700",
            },
            {
              quote: "Giving back through this platform is the most fulfilling thing I do. Watching scholars grow into confident professionals is deeply rewarding.",
              name: "David K.",
              role: "Mentor · Canada",
              initials: "DK",
              color: "bg-green-100 text-green-700",
            },
            {
              quote: "I got into a top graduate program with my mentor's guidance on my application. I never thought it was possible from where I started.",
              name: "Fatima N.",
              role: "Mentee · Nigeria",
              initials: "FN",
              color: "bg-amber-100 text-amber-700",
            },
          ].map(({ quote, name, role, initials, color }) => (
            <div key={name} className="card flex flex-col p-6">
              <span className="text-3xl text-primary-200">"</span>
              <p className="mt-2 flex-1 text-sm text-earth-700 leading-relaxed italic">{quote}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-earth-100 pt-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${color}`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-earth-900">{name}</p>
                  <p className="text-xs text-earth-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Begin?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            Join a growing community of mentors and scholars building a more
            equitable future through knowledge, guidance, and connection.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              Get Free Mentorship
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Browse Mentors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
