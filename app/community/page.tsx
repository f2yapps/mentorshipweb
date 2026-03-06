"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, ThumbsUp, MessageSquare } from "lucide-react";

type Discussion = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  category: string;
  comments: number;
  likes: number;
  date: string;
};

const DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "Best resources for preparing for technical interviews?",
    author: "Aisha M.",
    excerpt: "I have my first technical interview in two weeks. What resources did you use for coding and system design prep?",
    category: "Career",
    comments: 12,
    likes: 24,
    date: "2025-03-01",
  },
  {
    id: "2",
    title: "Scholarship deadline approaching — last-minute tips?",
    author: "Samuel T.",
    excerpt: "My scholarship application is due in 10 days. Any last-minute advice on what to double-check before submitting?",
    category: "Scholarships",
    comments: 8,
    likes: 15,
    date: "2025-02-28",
  },
  {
    id: "3",
    title: "Transitioning from academia to industry",
    author: "Fatima N.",
    excerpt: "I'm finishing my PhD and considering industry roles. Would love to hear from others who made the switch.",
    category: "Career",
    comments: 19,
    likes: 31,
    date: "2025-02-27",
  },
  {
    id: "4",
    title: "How often do you meet with your mentor?",
    author: "Omar H.",
    excerpt: "Curious what schedule works best for everyone — weekly, biweekly? And how do you prepare for each session?",
    category: "Mentorship",
    comments: 22,
    likes: 41,
    date: "2025-02-26",
  },
  {
    id: "5",
    title: "Remote internship opportunities for students in Africa",
    author: "Lina K.",
    excerpt: "Sharing a list of companies that offer remote internships to students in my region. Add yours in the comments!",
    category: "Opportunities",
    comments: 34,
    likes: 67,
    date: "2025-02-25",
  },
];

const CATEGORIES = ["All", "Mentorship", "Career", "Scholarships", "Opportunities", "General"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommunityPage() {
  const [category, setCategory] = useState("All");
  const [newQuestion, setNewQuestion] = useState("");

  const filtered =
    category === "All"
      ? DISCUSSIONS
      : DISCUSSIONS.filter((d) => d.category === category);

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
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Post question
            </button>
          </div>

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

          <ul className="mt-8 space-y-4">
            {filtered.map((d) => (
              <li key={d.id}>
                <article className="card-hover p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="rounded-full bg-earth-100 px-2 py-0.5 text-xs font-medium text-earth-600">
                        {d.category}
                      </span>
                      <h3 className="mt-2 font-semibold text-earth-900">{d.title}</h3>
                      <p className="mt-1 text-sm text-earth-600">{d.excerpt}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-earth-500">
                        <span>{d.author}</span>
                        <span>{formatDate(d.date)}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {d.comments} comments
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {d.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
