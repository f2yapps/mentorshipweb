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
  { icon: "🌐", title: "Global Community", desc: "We break geographic boundaries - mentors and mentees connect across continents and cultures." },
  { icon: "🆓", title: "Free for Everyone", desc: "Mentorship is a human right. Our platform is free forever for both mentors and mentees." },
  { icon: "🤝", title: "Volunteer Spirit", desc: "Every mentor gives their time freely, creating an ecosystem built on generosity and shared purpose." },
  { icon: "📈", title: "Real Impact", desc: "We measure success by real skills gained, careers launched, and lives transformed - not vanity metrics." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-earth-50 to-earth-100 px-4 py-16 sm:px-6 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, #d5cfbc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative container-wide text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
            🌍 About the platform
          </span>
          <h1 className="section-heading mt-6 text-balance text-4xl sm:text-5xl">
            Closing the global mentorship gap
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-earth-700">
            We connect volunteer experts in developed countries with talented young people in developing countries
            who deserve the same access to knowledge, networks, and guidance.
          </p>
        </div>
      </section>

      {/* ── Vision ──────────────────────────────────────────────────────── */}
      <section className="container-wide py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <div className="space-y-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-2xl">
              🔭
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-earth-900 sm:text-3xl">Our Vision</h2>
            <p className="text-earth-700 leading-relaxed">
              A world where every young person - regardless of where they were born, what
              language they speak, or what resources they have - can access a mentor who
              genuinely cares about their future in AI, technology, and beyond.
            </p>
            <p className="text-earth-700 leading-relaxed">
              We believe mentorship is one of the most powerful forces for upward mobility,
              and that experienced professionals in developed countries have an extraordinary
              opportunity to help shape the next generation of global innovators.
            </p>
          </div>
          <div className="card-glow rounded-2xl border border-primary-100 bg-white p-8 shadow-soft-lg">
            <blockquote className="text-lg font-medium italic text-earth-900">
              &ldquo;The best investment you can make is in someone else&apos;s potential.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-primary-700">- Our founding principle</p>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────────── */}
      <section className="bg-earth-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="container-wide">
          <h2 className="section-heading text-center">Our Values</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-earth-600">
            Six principles that guide every decision we make.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="card-glow group rounded-2xl border border-earth-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-earth-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus areas ─────────────────────────────────────────────────── */}
      <section className="container-wide py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-earth-100 text-2xl">
              🌍
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-earth-900">
              Focus on Developing Countries
            </h2>
            <p className="mt-3 text-earth-700 leading-relaxed">
              Young people in Ethiopia, Nigeria, Kenya, Ghana, Bangladesh, Pakistan,
              and dozens of other developing nations have enormous talent - but often
              lack access to professionals who can show them how to channel it.
            </p>
            <p className="mt-3 text-earth-700 leading-relaxed">
              Our platform bridges that gap by giving scholars direct access to mentors
              who understand both the global tech landscape and the unique opportunities
              in emerging markets.
            </p>
          </div>
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-2xl">
              🤖
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-earth-900">
              AI &amp; Technology for Youth
            </h2>
            <p className="mt-3 text-earth-700 leading-relaxed">
              Artificial intelligence is reshaping every sector. We believe every young
              person should have the opportunity to learn, contribute to, and benefit
              from this transformation - not just those in Silicon Valley or London.
            </p>
            <p className="mt-3 text-earth-700 leading-relaxed">
              Whether you&apos;re a student learning to code, a young professional entering
              tech, or an aspiring researcher, find an experienced mentor ready to guide
              your journey - completely free.
            </p>
          </div>
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
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Be Part of the Change
          </h2>
          <p className="mt-4 text-primary-100">
            Whether you&apos;re a scholar seeking guidance or an expert ready to give back,
            your place in this community is waiting.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 font-semibold text-primary-700 shadow-2xl transition hover:bg-primary-50 hover:-translate-y-1"
            >
              Find a Mentor
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
