import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Connect with volunteer mentors across Ethiopia, Africa, and the world. Get free advice in academics, career, life, and more.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-earth-50 to-accent-teal/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="section-heading text-primary-800 sm:text-4xl">
            Connect with Mentors Who Care
          </h1>
          <p className="mt-4 text-lg text-earth-700 sm:text-xl">
            A global mentorship platform connecting volunteer mentors with mentees across
            Ethiopia, Africa, and the world. Get free advice and guidance in academics,
            career, life, and more.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=mentee" className="btn-primary text-base">
              I need a mentor
            </Link>
            <Link href="/auth/register?role=mentor" className="btn-secondary text-base">
              I want to mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="section-heading text-center">Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-earth-700">
            We believe everyone deserves access to guidance and support. Our platform brings
            together volunteer mentors who offer free advice and mentees who seek growth—
            from students and professionals in Ethiopia and across Africa to anyone
            worldwide.
          </p>
      </section>

      {/* How it works (teaser) */}
      <section className="bg-earth-100 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-heading text-center">How It Works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="card p-6 text-center">
              <span className="text-3xl">1</span>
              <h3 className="mt-2 font-semibold text-earth-900">Sign up</h3>
              <p className="mt-1 text-sm text-earth-600">
                Register as a mentee or mentor. Choose your categories and interests.
              </p>
            </div>
            <div className="card p-6 text-center">
              <span className="text-3xl">2</span>
              <h3 className="mt-2 font-semibold text-earth-900">Connect</h3>
              <p className="mt-1 text-sm text-earth-600">
                Mentees request mentorship; mentors accept and set up communication.
              </p>
            </div>
            <div className="card p-6 text-center">
              <span className="text-3xl">3</span>
              <h3 className="mt-2 font-semibold text-earth-900">Grow</h3>
              <p className="mt-1 text-sm text-earth-600">
                Build a relationship and get ongoing support via chat, email, or video.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="btn-secondary">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Categories teaser */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="section-heading text-center">Mentorship Categories</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-earth-700">
          Get support in Academics, Career, Life, Relationships, Mental Health,
          Entrepreneurship, Tech, Agriculture, Leadership, Immigration, Faith & Purpose,
          and more.
        </p>
        <div className="mt-8 text-center">
          <Link href="/categories" className="btn-primary">
            Browse categories
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading text-white">Ready to get started?</h2>
          <p className="mt-4 text-primary-100">
            Join as a mentee to request guidance, or become a mentor to give back.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white px-6 py-2.5 font-medium text-primary-600 hover:bg-primary-50"
            >
              Request a mentor
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-2.5 font-medium hover:bg-white/10"
            >
              Find mentors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
