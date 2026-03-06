"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Community</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            A place to ask questions, share advice, and connect with other mentees and mentors.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-earth-200 bg-white p-10 text-center shadow-soft">
          <MessageCircle className="mx-auto h-14 w-14 text-earth-400" />
          <h2 className="mt-6 text-xl font-semibold text-earth-900">Community discussions coming soon</h2>
          <p className="mt-3 text-earth-600">
            We are building a space where you can post questions, share tips, and learn from others. In the meantime, connect with a mentor, check the FAQ, or contact us with your questions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/mentors" className="btn-primary">
              Find a mentor
            </Link>
            <Link href="/faq" className="btn-secondary">
              FAQ
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
