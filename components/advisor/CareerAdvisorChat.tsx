"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { askAdvisor, AdvisorMessage, MentorSuggestion } from "@/app/actions/ai-advisor";
import { Send, Loader2, GraduationCap, MapPin } from "lucide-react";

const EXAMPLE_QUESTIONS = [
  "How do I get a PhD scholarship in the US?",
  "How can I become a data scientist?",
  "Which universities are best for hydrology?",
  "How do I write a strong scholarship application essay?",
  "What fellowships are available for African students?",
  "How do I transition from engineering to product management?",
];

type ChatMessage = AdvisorMessage & { mentors?: MentorSuggestion[] };

export function CareerAdvisorChat({
  userProfile,
}: {
  userProfile: { role: string; preferredCategories?: string[]; goals?: string };
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput("");
    setError(null);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(newMessages);
    setLoading(true);

    const result = await askAdvisor(
      newMessages.map((m) => ({ role: m.role, content: m.content })),
      userProfile
    );

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessages([
      ...newMessages,
      { role: "assistant", content: result.reply, mentors: result.mentors },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="card p-6">
          <p className="text-sm font-semibold text-earth-700 mb-3">Try asking:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-xl border border-earth-200 bg-earth-50 px-4 py-3 text-left text-sm text-earth-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, i) => (
        <div key={i}>
          {msg.role === "user" ? (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-3 text-sm text-white">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base">
                🧠
              </div>
              <div className="flex-1 min-w-0">
                <div className="card p-4">
                  <div className="prose prose-sm max-w-none text-earth-800 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>

                {/* Mentor suggestions */}
                {msg.mentors && msg.mentors.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth-500">
                      Mentors who can help
                    </p>
                    <div className="space-y-2">
                      {msg.mentors.map((mentor) => (
                        <div key={mentor.id} className="card p-3 flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-earth-900">{mentor.name}</p>
                            {(mentor.current_position || mentor.organization) && (
                              <p className="text-xs text-earth-500 mt-0.5">
                                {mentor.current_position}
                                {mentor.current_position && mentor.organization && " · "}
                                {mentor.organization}
                              </p>
                            )}
                            {mentor.expertise_categories.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {mentor.expertise_categories.slice(0, 3).map((cat) => (
                                  <span key={cat} className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/mentors/${mentor.id}`}
                            className="shrink-0 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Loading */}
      {loading && (
        <div className="flex gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base">
            🧠
          </div>
          <div className="card px-4 py-3 flex items-center gap-2 text-sm text-earth-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking…
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div ref={bottomRef} />

      {/* Input */}
      <div className="sticky bottom-4 card p-3 flex gap-2 shadow-lg">
        <textarea
          ref={inputRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about scholarships, career paths, universities… (Enter to send)"
          className="flex-1 resize-none rounded-xl border border-earth-200 bg-earth-50 px-3 py-2 text-sm text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="self-end rounded-xl bg-primary-600 p-2.5 text-white hover:bg-primary-700 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
