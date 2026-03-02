import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Mentorship Platform team for questions, partnerships, or support.",
};

const CONTACT_ITEMS = [
  {
    icon: "✉️",
    title: "General Inquiries",
    desc: "Questions about the platform, mentorship, or potential partnerships.",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
  {
    icon: "🛟",
    title: "Account & Technical Support",
    desc: "Need help with your account, a mentorship request, or a technical issue?",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
  {
    icon: "🤝",
    title: "Partnerships & Collaborations",
    desc: "Organizations wanting to partner with us to expand mentorship access.",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-50 to-earth-100 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="section-heading">Get in Touch</h1>
          <p className="mt-4 text-earth-700">
            Have a question, idea, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact cards ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {CONTACT_ITEMS.map(({ icon, title, desc, action }) => (
            <div key={title} className="card p-6">
              <span className="text-3xl">{icon}</span>
              <h2 className="mt-3 font-semibold text-earth-900">{title}</h2>
              <p className="mt-2 text-sm text-earth-600">{desc}</p>
              <a
                href={action.href}
                className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
              >
                {action.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Response time ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <div className="rounded-xl border border-earth-200 bg-earth-50 p-6 text-center">
          <p className="text-sm text-earth-600">
            <span className="font-medium text-earth-900">Response time:</span>{" "}
            We typically respond within 2–3 business days. For urgent account issues,
            check the FAQ section in your Dashboard or email us directly.
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-earth-600">Looking to join the platform?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=mentee" className="btn-primary">
              Join as Mentee
            </Link>
            <Link href="/auth/register?role=mentor" className="btn-secondary">
              Volunteer as Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
