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
    gradientFrom: "from-primary-500",
    gradientTo: "to-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: "🔍",
    step: "02",
    title: "Find Your Match",
    desc: "Browse verified mentors by expertise, country, or language. Send a request with a personal message about what you hope to achieve.",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: "🚀",
    step: "03",
    title: "Grow Together",
    desc: "Connect via video call, email, or chat. Build an ongoing relationship with a mentor who understands your goals and local context.",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-600",
    bg: "bg-green-50",
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
    accent: "bg-primary-500",
    initials: "WM",
  },
  {
    quote: "Volunteer mentors give their time so that talent everywhere has access to guidance - not just where it's easy to find.",
    label: "Our mission",
    color: "bg-green-100 text-green-700",
    accent: "bg-green-500",
    initials: "OM",
  },
  {
    quote: "From application advice to technical skills, our community supports real outcomes: new roles, admissions, and lasting professional relationships.",
    label: "Real outcomes",
    color: "bg-amber-100 text-amber-700",
    accent: "bg-amber-500",
    initials: "RO",
  },
];

const TRUST_SIGNALS = [
  { icon: "✅", text: "100% Free, Always" },
  { icon: "🛡️", text: "Verified Mentors" },
  { icon: "🌍", text: "50+ Countries" },
  { icon: "⚡", text: "Quick Matching" },
];

export default async function HomePage() {
  const supabase = await createClient();

  let testimonials: { quote: string; name: string; role: string; initials: string; color: string; accent: string }[] = [];
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
          accent: ["bg-primary-500", "bg-green-500", "bg-amber-500"][i] ?? "bg-earth-400",
        }));
    }
  } catch {
    testimonials = [];
  }
  const useTestimonials = testimonials.length >= 2;
  const displayCards = useTestimonials ? testimonials : VALUE_STATEMENTS;

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
    { value: mentorCount ?? 0, label: "Verified Mentors", icon: "🎓", suffix: "+" },
    { value: menteeCount ?? 0, label: "Active Mentees", icon: "🌱", suffix: "+" },
    { value: 50, label: "Countries Reached", icon: "🌍", suffix: "+" },
    { value: 100, label: "Success Stories", icon: "⭐", suffix: "+" },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-earth-950 px-4 py-36 text-white sm:px-6 sm:py-48">
        {/* Animated blobs */}
        <div className="blob-float pointer-events-none absolute -right-28 -top-28 h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-3xl" />
        <div className="blob-float-delay pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="blob-float pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        {/* Dot overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />

        <div className="relative container-wide text-center">
          <div className="fade-up inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-primary-100 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            🌍 Connecting Mentors &amp; Scholars Worldwide
          </div>

          <h1 className="fade-up-1 mx-auto mt-10 max-w-5xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Connect with Mentors.
            <br />
            <span className="text-gradient-animate">Unlock Your Future.</span>
          </h1>

          <p className="fade-up-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-primary-100 sm:text-xl">
            Volunteer mentors from around the world connect with scholars and young professionals -{" "}
            <strong className="font-bold text-white">completely free</strong>. Get guidance in tech,
            career growth, scholarships, and more.
          </p>

          <div className="fade-up-3 mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-bold text-primary-700 shadow-2xl transition hover:bg-primary-50 hover:shadow-primary-500/25 hover:-translate-y-1"
            >
              🔍 Find a Mentor
            </Link>
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/50 bg-white/10 px-10 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 hover:-translate-y-1"
            >
              Get Started Free →
            </Link>
          </div>

          {/* Trust signals */}
          <div className="fade-up-3 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_SIGNALS.map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-sm font-medium text-primary-200">
                <span>{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-b border-earth-100 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-earth-100">
            {stats.map(({ value, label, icon, suffix }) => (
              <div key={label} className="group flex flex-col items-center px-4 py-10 text-center transition-colors hover:bg-primary-50/40">
                <span className="text-3xl transition-transform group-hover:scale-110">{icon}</span>
                <p className="mt-3 text-4xl font-extrabold tracking-tight text-primary-600">
                  {value}{suffix}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-earth-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission + Video ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-earth-50 py-24 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, #d5cfbc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative container-wide">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-bold text-primary-700 ring-1 ring-primary-200">
                ✨ Our Mission
              </span>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
                Bridging the{" "}
                <span className="bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">
                  Mentorship Gap
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-earth-600">
                Millions of talented young people lack access to experienced guides in AI, technology,
                and career development. We connect them with volunteer mentors who have the expertise - and the heart - to help them thrive.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start lg:justify-start">
                <Link href="/about" className="btn-secondary">
                  Our Story →
                </Link>
                <Link href="/mentors" className="btn-primary">
                  Meet Our Mentors
                </Link>
              </div>
            </div>

            <div className="w-full max-w-xs shrink-0">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-400 to-amber-400 opacity-25 blur-2xl" />
                <div
                  className="relative overflow-hidden rounded-3xl shadow-soft-xl ring-1 ring-black/10"
                  style={{ aspectRatio: "9/16" }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/SCg8oW3cifA?rel=0&modestbranding=1"
                    title="Global Mentorship Introduction"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-earth-500">
                Watch Our Story
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="border-t border-earth-100 bg-white py-24 sm:py-32">
        <div className="container-wide">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-bold text-primary-700 ring-1 ring-primary-200">
              Simple Steps
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-earth-600">
              Getting started takes just a few minutes - no fees, no gatekeepers.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon, step, title, desc, gradientFrom, gradientTo, bg }) => (
              <div key={step} className="card-glow group relative rounded-3xl border border-earth-100 bg-white p-8 pt-12 text-center shadow-soft">
                {/* Gradient step badge */}
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} px-5 py-2 text-sm font-extrabold text-white shadow-lg`}>
                  Step {step}
                </div>
                {/* Icon */}
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${bg} text-5xl transition-transform duration-300 group-hover:scale-110`}>
                  {icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-earth-900">{title}</h3>
                <p className="mt-3 leading-relaxed text-earth-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/how-it-works" className="btn-secondary">
              Learn more about the process →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mentorship Areas ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-earth-50 py-24 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, #d5cfbc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative container-wide">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
              Explore Topics
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
              Mentorship Areas
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-earth-600">
              Whatever your goal - AI, software, career, leadership - there are mentors ready to guide you.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {MENTORSHIP_AREAS.map(({ icon, label }) => (
              <Link
                key={label}
                href={`/mentors?category=${encodeURIComponent(label)}`}
                className="card-glow group flex items-center gap-3 rounded-2xl border border-earth-100 bg-white px-4 py-4 shadow-soft hover:border-primary-200"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-earth-50 text-2xl ring-1 ring-earth-100 transition-transform duration-200 group-hover:scale-110">
                  {icon}
                </span>
                <span className="text-sm font-semibold text-earth-800 group-hover:text-primary-700">{label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/categories" className="btn-primary">
              View All Areas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Mentors ──────────────────────────────────────────────── */}
      {featuredMentors.length > 0 && (
        <section className="border-t border-earth-100 bg-white py-24 sm:py-32">
          <div className="container-wide">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 ring-1 ring-green-200">
                🎓 Verified Experts
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
                Featured Mentors
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-earth-600">
                Meet some of our verified volunteer mentors ready to support you.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                View All Mentors →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials / Value Statements ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-earth-900 via-earth-950 to-primary-950 py-24 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="blob-float pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="blob-float-delay pointer-events-none absolute -left-24 bottom-12 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative container-wide">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold text-primary-200 backdrop-blur-sm">
              {useTestimonials ? "💬 Community Voices" : "💡 Why We Built This"}
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {useTestimonials ? "Voices from Our Community" : "Why Mentorship Matters"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-earth-400">
              {useTestimonials
                ? "What mentees and mentors say about their experience."
                : "A few reasons we built this platform."}
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {displayCards.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                {/* Accent bar */}
                <div className={`absolute left-8 top-0 h-1 w-16 rounded-b-full ${(item as { accent: string }).accent}`} />
                <span className="text-5xl font-black leading-none text-white/20">&ldquo;</span>
                <p className="mt-2 text-base leading-relaxed text-earth-300 italic">
                  {(item as { quote: string }).quote}
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${(item as { color: string }).color}`}>
                    {(item as { initials?: string }).initials ??
                      ("label" in item ? (item as { label: string }).label.slice(0, 2).toUpperCase() : "M")}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {"name" in item ? (item as { name: string }).name : (item as { label: string }).label}
                    </p>
                    <p className="text-sm text-earth-500">
                      {"role" in item ? (item as { role: string }).role : "Platform value"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/success-stories"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Read success stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="border-t border-earth-100 bg-white py-24 sm:py-32">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 ring-1 ring-blue-200">
                  📅 Live Events
                </span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
                  Upcoming Events
                </h2>
                <p className="mt-3 text-lg text-earth-600">Workshops, webinars, and meetups from our community.</p>
              </div>
              <Link href="/events" className="btn-secondary shrink-0">
                View all events →
              </Link>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ── Partners ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-earth-50 py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, #d5cfbc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative container-wide text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-earth-200 px-4 py-1.5 text-sm font-bold text-earth-700">
            🤝 Partners & Supporters
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-earth-900 sm:text-5xl">
            Building Together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-earth-600">
            We are building partnerships with universities and organizations to expand access to mentorship worldwide.
          </p>
          <Link href="/partners" className="btn-secondary mt-8 inline-flex">
            Learn about partnering with us →
          </Link>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4 py-32 text-white sm:px-6 sm:py-40">
        <div className="blob-float pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="blob-float-delay pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(255,255,255,0.08),transparent)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative container-wide text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-primary-100 backdrop-blur-sm">
            🚀 Start Today - It&apos;s Free
          </span>
          <h2 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Ready to Begin<br />Your Journey?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-primary-100">
            Join a growing community of mentors and scholars building a more equitable future
            through knowledge, guidance, and connection.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-12 py-4 text-base font-bold text-primary-700 shadow-2xl transition hover:bg-primary-50 hover:-translate-y-1"
            >
              🎓 Get Free Mentorship
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/50 bg-white/10 px-12 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 hover:-translate-y-1"
            >
              Browse Mentors →
            </Link>
          </div>
          <p className="mt-8 text-sm font-medium text-primary-300">
            No credit card required · No subscription · Always free for mentees
          </p>
        </div>
      </section>

    </div>
  );
}
