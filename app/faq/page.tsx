"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "1",
    question: "Is mentorship really free?",
    answer:
      "Yes. Our platform is 100% free for mentees. All mentors volunteer their time. We don't charge fees, subscriptions, or hidden costs. Our mission is to make mentorship accessible to everyone.",
  },
  {
    id: "2",
    question: "How do I find a mentor?",
    answer:
      "Go to Find Mentors and browse by category, country, or language. You can read mentor profiles and send a mentorship request with a short message about your goals. Once a mentor accepts, you can arrange meetings and stay in touch via your dashboard and notifications.",
  },
  {
    id: "3",
    question: "Who can become a mentor?",
    answer:
      "Anyone with relevant experience in our mentorship areas (e.g. AI, software development, career development, scholarships) can apply. We look for volunteers who can commit a few hours per month and who want to support scholars in developing countries. Apply on our Become a Mentor page.",
  },
  {
    id: "4",
    question: "How often should I meet my mentor?",
    answer:
      "It depends on you and your mentor. Many pairs meet every 1-2 weeks for 30-60 minutes. You can agree on a schedule that works for both of you. Consistency matters more than frequency.",
  },
  {
    id: "5",
    question: "What if my mentorship request is declined?",
    answer:
      "Mentors may decline due to capacity or fit. Don't take it personally. Browse other mentors and send a few requests. Make your message specific about your goals to increase your chances.",
  },
  {
    id: "6",
    question: "How do I get help with my account?",
    answer:
      "Check the FAQ first. For account or technical issues, email us at f2yapps@support.com. We typically respond within 2-3 business days. For urgent issues, mention 'Urgent' in the subject line.",
  },
  {
    id: "7",
    question: "Can I switch from mentee to mentor (or both)?",
    answer:
      "Yes. If you'd like to also volunteer as a mentor, go to Become a Mentor and submit an application. Once approved, you'll have access to both mentee and mentor features. Contact support if you need your role updated.",
  },
  {
    id: "8",
    question: "Is my data safe?",
    answer:
      "We take privacy seriously. We use industry-standard security and don't sell your data. See our Privacy Policy for details. Your account and profile data are protected and not shared with third parties.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("1");

  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Quick answers to common questions about the platform, mentorship, and your account.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="card overflow-hidden transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-semibold text-earth-900">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-earth-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-earth-100 px-6 py-4">
                    <p className="text-earth-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
