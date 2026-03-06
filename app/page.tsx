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

const VALUE_STATEMENTS = [
  {
    quote: "Mentorship can accelerate your learning, open doors, and build the confidence to pursue scholarships and career goals.",
    label: "Why it matters",
    color: "bg-primary-100 text-primary-700",
  },
  {
    quote: "Volunteer mentors give their time so that talent everywhere has access to guidance — not just where it’s easy to find.",
    label: "Our mission",
    color: "bg-green-100 text-green-700",
  },
  {
    quote: "From application advice to technical skills, our community supports real outcomes: new roles, admissions, and lasting professional relationships.",
    label: "Real outcomes",
    color: "bg-amber-100 text-amber-700",
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  let testimonials: { quote: string; name: string; role: string; initials: string; color: string }[] = [];
  try {
    const { data: reviewRows } = await supabase
      .from("reviews")
      .select("id, rating, feedback, created_at")
      .not("feedback", "is", null)
      .order("created_at", { ascending: false })
      .limit(6);
    if (reviewRows?.length && reviewRows.some((r: { feedback: string | null }) => r.feedback?.trim())) {
      testimonials = reviewRows
        .filter((r: { feedback: string | null }) => r.feedback?.trim())
        .slice(0, 3)
        .map((r: { feedback: string; id: string }, i: number) => ({
          quote: (r.feedback as string).slice(0, 200) + ((r.feedback as string).length > 200 ? "…" : ""),
          name: "Community member",
          role: "Mentee",
          initials: String(i + 1),
          color: ["bg-primary-100 text-primary-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700"][i] ?? "bg-earth-100 text-earth-700",
        }));
    }
  } catch {
    testimonials = [];
  }
  const useTestimonials = testimonials.length >= 2;

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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-28 text-white sm:px-6 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="relative container-wide text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-100 ring-1 ring-white/20 backdrop-blur-sm">
            🌍 Connecting Mentors & Scholars Worldwide
          </span>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Connect with Mentors.{" "}
            <span className="text-white/95">Unlock Your Future.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-primary-100 sm:text-xl">
            Volunteer mentors from around the world connect with scholars and young
            professionals — completely free. Get guidance in tech, career growth, scholarships, and more.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 text-base font-semibold text-primary-700 shadow-xl transition hover:bg-primary-50 hover:shadow-2xl"
            >
              Find a Mentor
            </Link>
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/70 px-10 py-4 text-base font-semibold text-white transition hover:bg-white/15"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-2 border-b border-earth-100 bg-white shadow-soft-lg">
        <div className="container-wide">
          <div className="grid grid-cols-3 divide-x divide-earth-100 py-10">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 py-5 text-center">
                <p className="text-3xl font-bold text-primary-600 sm:text-4xl">{value}</p>
                <p className="mt-1.5 text-sm font-medium text-earth-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + Video */}
      <section className="bg-earth-50/80 py-20 sm:py-28">
        <div className="container-wide">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                Our Mission
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
                Bridging the Mentorship Gap
              </h2>
              <p className="mt-5 max-w-xl text-earth-600 leading-relaxed sm:text-lg">
                Millions of talented young people lack access to experienced guides in AI, technology,
                and career development. We connect them with volunteer mentors who have the expertise — and the heart — to help them thrive.
              </p>
              <Link href="/about" className="btn-secondary mt-8 inline-flex">
                Our Story
              </Link>
            </div>
            <div className="w-full shrink-0 lg:w-[360px]">
              <div className="rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden" style={{ aspectRatio: "9/16" }}>
                <iframe
                  src="https://www.youtube.com/embed/SCg8oW3cifA?rel=0&modestbranding=1"
                  title="Global Mentorship Introduction"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-center text-sm font-medium text-earth-600">Watch our story</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-earth-100 bg-white py-20 sm:py-28">
        <div className="container-wide">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              Simple steps
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-earth-600">
              Getting started takes just a few minutes — no fees, no gatekeepers.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="group relative rounded-3xl border border-earth-100 bg-white p-8 text-center shadow-soft transition hover:shadow-soft-lg hover:border-primary-100">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
                  Step {step}
                </span>
                <span className="inline-block text-5xl" aria-hidden>{icon}</span>
                <h3 className="mt-6 text-xl font-semibold text-earth-900">{title}</h3>
                <p className="mt-3 text-earth-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/how-it-works" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Learn more about the process →
            </Link>
          </div>
        </div>
      </section>

      {/* Mentorship Areas */}
      <section className="bg-earth-50/80 py-20 sm:py-28">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
              Mentorship Areas
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-earth-600">
              Whatever your goal — AI, software, career, leadership — there are mentors ready to guide you.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {MENTORSHIP_AREAS.map(({ icon, label }) => (
              <Link
                key={label}
                href={`/mentors?category=${encodeURIComponent(label)}`}
                className="group flex items-center gap-4 rounded-2xl border border-earth-100 bg-white px-5 py-4 shadow-soft transition hover:border-primary-200 hover:shadow-soft-lg"
              >
                <span className="text-2xl" aria-hidden>{icon}</span>
                <span className="text-sm font-semibold text-earth-800 group-hover:text-primary-700">{label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/categories" className="btn-secondary">
              View All Areas
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      {featuredMentors.length > 0 && (
        <section className="border-t border-earth-100 bg-white py-20 sm:py-28">
          <div className="container-wide">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
                Featured Mentors
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-earth-600">
                Meet some of our verified volunteer mentors ready to support you.
              </p>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-12 text-center">
              <Link href="/mentors" className="btn-primary">
                View all mentors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials or value statements */}
      <section className="bg-earth-50/80 py-20 sm:py-28">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
              {useTestimonials ? "Voices from Our Community" : "Why Mentorship Matters"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-earth-600">
              {useTestimonials
                ? "What mentees and mentors say about their experience."
                : "A few reasons we built this platform."}
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {(useTestimonials ? testimonials : VALUE_STATEMENTS).map((item, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-earth-100 bg-white p-8 shadow-soft">
                <span className="text-4xl leading-none text-primary-200">&ldquo;</span>
                <p className="mt-4 flex-1 text-earth-700 leading-relaxed italic">{(item as { quote: string }).quote}</p>
                <div className="mt-8 flex items-center gap-4 border-t border-earth-100 pt-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${(item as { color: string }).color}`}>
                    {"initials" in item ? (item as { initials: string }).initials : (item as { label: string }).label.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-earth-900">{"name" in item ? (item as { name: string }).name : (item as { label: string }).label}</p>
                    <p className="text-sm text-earth-500">{"role" in item ? (item as { role: string }).role : "Platform value"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/success-stories" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Read success stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="border-t border-earth-100 bg-white py-20 sm:py-28">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
                  Upcoming Events
                </h2>
                <p className="mt-3 text-earth-600">Workshops, webinars, and meetups from our community.</p>
              </div>
              <Link href="/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                View all events →
              </Link>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      )}

      {/* Partners */}
      <section className="bg-earth-50/80 py-20 sm:py-28">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
            Partners & Supporters
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-earth-600">
            We are building partnerships with universities and organizations to expand access to mentorship worldwide.
          </p>
          <Link href="/partners" className="btn-secondary mt-8 inline-flex">
            Learn about partnering with us
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-primary-800 bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-24 text-white sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative container-wide text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Ready to Begin?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-100">
            Join a growing community of mentors and scholars building a more
            equitable future through knowledge, guidance, and connection.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-4 font-semibold text-primary-700 shadow-xl transition hover:bg-primary-50"
            >
              Get Free Mentorship
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/70 px-10 py-4 font-semibold text-white transition hover:bg-white/15"
            >
              Browse Mentors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
