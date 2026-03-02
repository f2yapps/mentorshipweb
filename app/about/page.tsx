import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our mission: connect volunteer mentors from developed countries with scholars in developing countries. Learn about our vision, values, and impact.",
};

const VALUES = [
  { icon: "🌱", title: "Youth Empowerment", desc: "We invest in young people as the primary agents of change in their communities and countries." },
  { icon: "💻", title: "Technology Access", desc: "We democratize AI and tech education so talent anywhere in the world can reach its full potential." },
  { icon: "🌐", title: "Global Community", desc: "We break geographic boundaries — mentors and mentees connect across continents and cultures." },
  { icon: "🆓", title: "Free for Everyone", desc: "Mentorship is a human right. Our platform is free forever for both mentors and mentees." },
  { icon: "🤝", title: "Volunteer Spirit", desc: "Every mentor gives their time freely, creating an ecosystem built on generosity and shared purpose." },
  { icon: "📈", title: "Real Impact", desc: "We measure success by real skills gained, careers launched, and lives transformed — not vanity metrics." },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-50 to-earth-100 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="section-heading sm:text-4xl">About Our Mission</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-earth-700">
            We exist to close the mentorship gap — connecting volunteer experts in
            developed countries with talented young people in developing countries who
            deserve the same access to knowledge and guidance.
          </p>
        </div>
      </section>

      {/* ── Vision ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <div>
            <span className="text-5xl">🔭</span>
            <h2 className="mt-4 text-2xl font-bold text-earth-900">Our Vision</h2>
            <p className="mt-3 text-earth-700">
              A world where every young person — regardless of where they were born, what
              language they speak, or what resources they have — can access a mentor who
              genuinely cares about their future in AI, technology, and beyond.
            </p>
            <p className="mt-3 text-earth-700">
              We believe mentorship is one of the most powerful forces for upward mobility,
              and that experienced professionals in developed countries have an extraordinary
              opportunity to help shape the next generation of global innovators.
            </p>
          </div>
          <div className="rounded-2xl bg-primary-50 p-8">
            <blockquote className="text-lg font-medium italic text-primary-900">
              &ldquo;The best investment you can make is in someone else&apos;s potential.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-primary-700">— Our founding principle</p>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────────── */}
      <section className="bg-earth-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-heading text-center">Our Values</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-earth-600">
            Six principles that guide every decision we make.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6">
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-3 font-semibold text-earth-900">{title}</h3>
                <p className="mt-2 text-sm text-earth-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus areas ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <span className="text-4xl">🌍</span>
            <h2 className="mt-4 text-xl font-bold text-earth-900">
              Focus on Developing Countries
            </h2>
            <p className="mt-3 text-earth-700">
              Young people in Ethiopia, Nigeria, Kenya, Ghana, Bangladesh, Pakistan,
              and dozens of other developing nations have enormous talent — but often
              lack access to professionals who can show them how to channel it.
            </p>
            <p className="mt-3 text-earth-700">
              Our platform bridges that gap by giving scholars direct access to mentors
              who understand both the global tech landscape and the unique opportunities
              in emerging markets.
            </p>
          </div>
          <div>
            <span className="text-4xl">🤖</span>
            <h2 className="mt-4 text-xl font-bold text-earth-900">
              AI &amp; Technology for Youth
            </h2>
            <p className="mt-3 text-earth-700">
              Artificial intelligence is reshaping every sector. We believe every young
              person should have the opportunity to learn, contribute to, and benefit
              from this transformation — not just those in Silicon Valley or London.
            </p>
            <p className="mt-3 text-earth-700">
              Whether you&apos;re a student learning to code, a young professional entering
              tech, or an aspiring researcher, find an experienced mentor ready to guide
              your journey — completely free.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-primary-600 px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Be Part of the Change</h2>
          <p className="mt-4 text-primary-100">
            Whether you&apos;re a scholar seeking guidance or an expert ready to give back,
            your place in this community is waiting.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Find a Mentor
            </Link>
            <Link
              href="/auth/register?role=mentor"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
