"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, MessageSquare } from "lucide-react";

const CATEGORIES = ["All", "Mentorship", "Career", "Scholarships", "Opportunities", "General"];

export default function CommunityPage() {
  const [category, setCategory] = useState("All");
  const [newQuestion, setNewQuestion] = useState("");

  const handlePostQuestion = () => {
    // When you have a backend: submit newQuestion, then refresh list
    setNewQuestion("");
  };

  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Community</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Ask questions, share advice, and connect with other mentees and mentors.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Ask a question — keep the feature */}
          <div className="card rounded-2xl border border-primary-200 bg-primary-50/50 p-6">
            <h2 className="font-semibold text-earth-900">Ask a question</h2>
            <p className="mt-1 text-sm text-earth-600">
              Get advice from the community. Mentors and peers often respond within a day.
            </p>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="input mt-4 min-h-[100px] resize-y"
              rows={3}
            />
            <button
              type="button"
              onClick={handlePostQuestion}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Post question
            </button>
          </div>

          {/* Category filters — keep the UI */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-primary-500 text-white"
                    : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Discussions list — no fake data; empty state when there are no real discussions */}
          <h2 className="mt-8 text-lg font-semibold text-earth-900">Discussions</h2>
          <div className="mt-4 rounded-2xl border border-earth-200 bg-white p-8 text-center shadow-soft">
            <MessageCircle className="mx-auto h-12 w-12 text-earth-300" />
            <p className="mt-4 font-medium text-earth-700">No discussions yet</p>
            <p className="mt-1 text-sm text-earth-500">
              Be the first to ask a question above. When discussions are posted, they will appear here.
            </p>
            <Link href="/mentors" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
              Find a mentor in the meantime →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
