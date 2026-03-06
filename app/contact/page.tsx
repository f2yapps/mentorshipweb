import type { Metadata } from "next";
import Link from "next/link";
import { Mail, HelpCircle, Handshake } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Mentorship Platform team for questions, partnerships, or support.",
};

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "General Inquiries",
    desc: "Questions about the platform, mentorship, or potential partnerships.",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
  {
    icon: HelpCircle,
    title: "Account & Technical Support",
    desc: "Need help with your account, a mentorship request, or a technical issue?",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
  {
    icon: Handshake,
    title: "Partnerships & Collaborations",
    desc: "Organizations wanting to partner with us to expand mentorship access.",
    action: { label: "f2yapps@support.com", href: "mailto:f2yapps@support.com" },
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Get in Touch</h1>
          <p className="mt-4 text-earth-600">
            Have a question, idea, or feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-earth-900">Contact options</h2>
            <div className="mt-4 space-y-6">
              {CONTACT_ITEMS.map(({ icon: Icon, title, desc, action }) => (
                <div key={title} className="card p-5">
                  <Icon className="h-8 w-8 text-primary-600" />
                  <h3 className="mt-3 font-semibold text-earth-900">{title}</h3>
                  <p className="mt-1 text-sm text-earth-600">{desc}</p>
                  <a
                    href={action.href}
                    className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {action.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-earth-900">Send us a message</h2>
            <p className="mt-1 text-sm text-earth-600">
              Use the form below for inquiries or feedback. We typically respond within 2–3 business days.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-earth-100 bg-white py-12">
        <div className="container-wide text-center">
          <p className="text-earth-600">Looking to join the platform?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=mentee" className="btn-primary">
              Join as Mentee
            </Link>
            <Link href="/become-a-mentor" className="btn-secondary">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
