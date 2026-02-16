import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Global youth mentorship platform connecting young people worldwide with mentors in AI, technology, career development, and personal growth. Empowering youth in developing countries.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-earth-50 to-accent-teal/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="section-heading text-primary-800 sm:text-4xl">
            Empowering Youth Through Global Mentorship
          </h1>
          <p className="mt-4 text-lg text-earth-700 sm:text-xl">
            Connect with volunteer mentors worldwide to unlock your potential in AI, technology, 
            career development, and personal growth. Free mentorship for young people in developing 
            countries and beyond.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=mentee" className="btn-primary text-base">
              Find a Mentor
            </Link>
            <Link href="/auth/register?role=mentor" className="btn-secondary text-base">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="section-heading text-center">Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-earth-700">
            We empower young people worldwide, especially in developing countries, with access 
            to mentorship in AI, technology, and career development. Our platform connects youth 
            with experienced mentors who volunteer their time to guide the next generation of 
            innovators, leaders, and changemakers.
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
        <h2 className="section-heading text-center">Mentorship Areas</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-earth-700">
          Get guidance in Artificial Intelligence & Machine Learning, Software Development, 
          Data Science, Career Development, Entrepreneurship, Digital Skills, Academic Success, 
          Personal Growth, and more. Specialized support for youth in developing countries.
        </p>
        <div className="mt-8 text-center">
          <Link href="/categories" className="btn-primary">
            Explore mentorship areas
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading text-white">Start Your Journey Today</h2>
          <p className="mt-4 text-primary-100">
            Join thousands of young people worldwide getting mentored in AI, tech, and career development. 
            Or share your expertise and help shape the future.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=mentee"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white px-6 py-2.5 font-medium text-primary-600 hover:bg-primary-50"
            >
              Get Mentored
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-2.5 font-medium hover:bg-white/10"
            >
              Browse Mentors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
