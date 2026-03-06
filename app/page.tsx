import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MentorCard } from "@/components/mentors/MentorCard";
import { EventCard } from "@/components/cards/EventCard";

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

const TESTIMONIALS = [
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
];

const PARTNERS = [
  { name: "Tech for Good Foundation" },
  { name: "Global Education Network" },
  { name: "Developer Community Alliance" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: mentorsRaw } = await supabase
    .from("mentors")
    .select(`
      id, expertise_categories, experience_years, availability, languages, verified,
      users(id, name, country, bio)
    `)
    .eq("verified", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const featuredMentors = (mentorsRaw ?? []).map((m) => {
    const usersField = (m as { users?: unknown }).users;
    const u = Array.isArray(usersField) ? usersField[0] : usersField;
    const user = u as { id: string; name: string; country: string | null; bio: string | null } | null;
    return {
      id: m.id,
      name: user?.name ?? "Mentor",
      country: user?.country ?? null,
      bio: user?.bio ?? null,
      expertise_categories: (m as { expertise_categories: string[] }).expertise_categories ?? [],
      experience_years: (m as { experience_years: number }).experience_years ?? 0,
      availability: (m as { availability: string }).availability ?? "flexible",
      languages: (m as { languages: string[] }).languages ?? [],
      verified: (m as { verified: boolean }).verified ?? false,
    };
  });

  const { data: eventsRaw } = await supabase
    .from("workshop_events")
    .select(`
      id, title, description, event_type, event_date, event_time, timezone,
      duration_minutes, location, is_online, language, tags,
      host:users!host_id(name)
    `)
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true })
    .limit(3);

  const upcomingEvents = (eventsRaw ?? []).map((ev) => {
    const host = (ev as { host?: unknown }).host;
    const h = Array.isArray(host) ? host[0] : host;
    const hostName = (h as { name?: string } | null)?.name ?? "Community";
    return {
      id: ev.id,
      title: ev.title,
      description: ev.description ?? null,
      event_type: ev.event_type,
      event_date: ev.event_date,
      event_time: ev.event_time,
      timezone: ev.timezone ?? null,
      duration_minutes: ev.duration_minutes ?? null,
      location: ev.location ?? null,
      is_online: ev.is_online ?? false,
      language: ev.language ?? null,
      hostName,
      tags: (ev.tags as string[]) ?? [],
    };
  });

  const { count: mentorCount } = await supabase.from("mentors").select("id", { count: "exact", head: true }).eq("verified", true);
  const { count: menteeCount } = await supabase.from("mentees").select("id", { count: "exact", head: true });

  const stats = [
    { value: mentorCount ?? 0, label: "Mentors" },
    { value: menteeCount ?? 0, label: "Mentees" },
    { value: "100+", label: "Success Stories" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-24 text-white sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />
        <div className="relative container-wide text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-100 ring-1 ring-white/20">
            🌍 Connecting Mentors & Scholars Worldwide
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Connect with Mentors.{" "}
            <span className="text-white/95">Unlock Your Future.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Volunteer mentors from around the world connect with scholars and young
            professionals — completely free. Get guidance in tech, career growth, scholarships, and more.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              Find a Mentor
            </Link>
            <Link
              href="/become-a-mentor"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-earth-100 bg-white shadow-soft">
        <div className="container-wide">
          <div className="grid grid-cols-3 divide-x divide-earth-100 py-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 py-4 text-center">
                <p className="text-2xl font-bold text-primary-600 sm:text-3xl">{value}</p>
                <p className="mt-1 text-sm text-earth-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container-wide py-16 sm:py-20 text-center">
        <h2 className="section-heading">Bridging the Mentorship Gap</h2>
        <p className="mx-auto mt-4 max-w-2xl text-earth-600 sm:text-lg">
          Millions of talented young people lack access to experienced guides in AI, technology,
          and career development. We connect them with volunteer mentors who have the expertise — and the heart — to help them thrive.
        </p>
        <Link href="/about" className="btn-secondary mt-8 inline-flex">
          Our Mission & Story
        </Link>
      </section>

      {/* Featured Mentors */}
      {featuredMentors.length > 0 && (
        <section className="bg-earth-50/50 py-16 sm:py-20">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="section-heading">Featured Mentors</h2>
              <p className="mx-auto mt-3 max-w-xl text-earth-600">
                Meet some of our verified volunteer mentors ready to support you.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMentors.slice(0, 6).map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  id={mentor.id}
                  name={mentor.name}
                  country={mentor.country}
                  bio={mentor.bio}
                  expertiseCategories={mentor.expertise_categories}
                  experienceYears={mentor.experience_years}
                  availability={mentor.availability}
                  languages={mentor.languages}
                  verified={mentor.verified}
                  currentUserRole={null}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/mentors" className="btn-primary">
                View all mentors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="container-wide py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-heading">Upcoming Events</h2>
              <p className="mt-2 text-earth-600">Workshops, webinars, and meetups from our community.</p>
            </div>
            <Link href="/events" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all events →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((ev) => (
              <EventCard
                key={ev.id}
                id={ev.id}
                title={ev.title}
                description={ev.description}
                event_type={ev.event_type}
                event_date={ev.event_date}
                event_time={ev.event_time}
                timezone={ev.timezone}
                duration_minutes={ev.duration_minutes}
                location={ev.location}
                is_online={ev.is_online}
                language={ev.language}
                hostName={ev.hostName}
                tags={ev.tags}
              />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-earth-50/50 py-16 sm:py-20">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="section-heading">How It Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-earth-600">
              Getting started takes just a few minutes — no fees, no gatekeepers.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="card-hover relative p-8 text-center">
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
            <Link href="/how-it-works" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Learn more about the process →
            </Link>
          </div>
        </div>
      </section>

      {/* Mentorship Areas */}
      <section className="container-wide py-16 sm:py-20">
        <div className="text-center">
          <h2 className="section-heading">Mentorship Areas</h2>
          <p className="mx-auto mt-3 max-w-xl text-earth-600">
            Whatever your goal — AI, software, career, leadership — there are mentors ready to guide you.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MENTORSHIP_AREAS.map(({ icon, label }) => (
            <Link
              key={label}
              href={`/mentors?category=${encodeURIComponent(label)}`}
              className="card-hover flex items-center gap-3 px-4 py-3"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-medium text-earth-800">{label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/categories" className="btn-secondary">
            View All Areas
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-earth-50/50 py-16 sm:py-20">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="section-heading">Voices from Our Community</h2>
            <p className="mx-auto mt-3 max-w-xl text-earth-600">
              Real stories from mentors and scholars who are making it happen.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
              <div key={name} className="card-hover flex flex-col p-6">
                <span className="text-3xl text-primary-200">&ldquo;</span>
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
          <div className="mt-8 text-center">
            <Link href="/success-stories" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Read more success stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="container-wide py-16 sm:py-20">
        <div className="text-center">
          <h2 className="section-heading">Partners & Supporters</h2>
          <p className="mx-auto mt-3 max-w-xl text-earth-600">
            Organizations that help us expand access to mentorship worldwide.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          {PARTNERS.map((p) => (
            <Link
              key={p.name}
              href="/partners"
              className="rounded-2xl border border-earth-200 bg-white px-8 py-4 font-medium text-earth-700 shadow-soft transition hover:border-primary-200 hover:shadow-soft-lg"
            >
              {p.name}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/partners" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all partners →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="container-wide text-center">
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
