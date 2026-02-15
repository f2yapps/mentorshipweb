import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Mentorship Platform team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">Contact Us</h1>
      <p className="mt-4 text-earth-700">
        Have a question or feedback? Reach out to the team.
      </p>

      <div className="card mt-8 space-y-6 p-6">
        <div>
          <h2 className="font-semibold text-earth-900">General inquiries</h2>
          <p className="mt-1 text-earth-600">
            For general questions about the platform, mentorship, or partnerships, email us at{" "}
            <a href="mailto:f2yapps@support.com" className="text-primary-600 hover:underline">
              f2yapps@support.com
            </a>
            .
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-earth-900">Support</h2>
          <p className="mt-1 text-earth-600">
            If you need help with your account or a mentorship request, use the support link in your dashboard or email{" "}
            <a href="mailto:f2yapps@support.com" className="text-primary-600 hover:underline">
              f2yapps@support.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
