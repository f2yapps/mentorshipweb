"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import { postQuestion } from "@/app/actions/community";

const CATEGORIES = ["All", "Mentorship", "Career", "Scholarships", "Opportunities", "General"];
const POST_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export type DiscussionRow = {
  id: string;
  body: string;
  category: string;
  created_at: string;
  users: { name: string | null } | null;
};

export function CommunityClient({
  discussions,
}: {
  discussions: DiscussionRow[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [newQuestion, setNewQuestion] = useState("");
  const [postCategory, setPostCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered =
    category === "All"
      ? discussions
      : discussions.filter((d) => d.category === category);

  const handlePostQuestion = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await postQuestion(newQuestion, postCategory);
      if (result.ok) {
        setNewQuestion("");
        router.refresh();
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-sm text-earth-600">Category:</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="input w-auto text-sm"
                disabled={loading}
              >
                {POST_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              type="button"
              onClick={handlePostQuestion}
              disabled={loading || !newQuestion.trim()}
              className="btn-primary mt-4 inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {loading ? "Posting…" : "Post question"}
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

          <h2 className="mt-8 text-lg font-semibold text-earth-900">Discussions</h2>
          <div className="mt-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-earth-200 bg-white p-8 text-center shadow-soft">
                <MessageCircle className="mx-auto h-12 w-12 text-earth-300" />
                <p className="mt-4 font-medium text-earth-700">
                  {discussions.length === 0 ? "No discussions yet" : "No discussions in this category"}
                </p>
                <p className="mt-1 text-sm text-earth-500">
                  {discussions.length === 0
                    ? "Be the first to ask a question above. When discussions are posted, they will appear here."
                    : "Try another category or ask a new question."}
                </p>
                {discussions.length === 0 && (
                  <Link href="/mentors" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
                    Find a mentor in the meantime →
                  </Link>
                )}
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-2xl border border-earth-200 bg-white p-5 shadow-soft"
                  >
                    <p className="text-earth-900 whitespace-pre-wrap">{d.body}</p>
                    <p className="mt-3 text-xs text-earth-500">
                      {(d.users?.name ?? "Someone")} · {d.category} ·{" "}
                      {new Date(d.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
