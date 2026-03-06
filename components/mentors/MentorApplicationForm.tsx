"use client";

import { useState } from "react";
import Link from "next/link";
import { MENTORSHIP_CATEGORIES } from "@/lib/constants";

export function MentorApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [whyMentor, setWhyMentor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleExpertise = (cat: string) => {
    setExpertise((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertise.length === 0) {
      setError("Please select at least one area of expertise.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mentor-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          expertise,
          experience,
          why_mentor: whyMentor,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. You can still create a mentor account below.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card rounded-2xl border border-green-200 bg-green-50/50 p-8 text-center">
        <p className="text-lg font-semibold text-earth-900">Thank you for applying!</p>
        <p className="mt-2 text-earth-600">
          We&apos;ll review your application and get back to you. In the meantime, you can create your mentor account and complete your profile.
        </p>
        <Link href="/auth/register?role=mentor" className="btn-primary mt-6 inline-flex">
          Create mentor account
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8">
      <div>
        <label htmlFor="mentor-app-name" className="block text-sm font-medium text-earth-700">
          Full name *
        </label>
        <input
          id="mentor-app-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mt-1"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="mentor-app-email" className="block text-sm font-medium text-earth-700">
          Email *
        </label>
        <input
          id="mentor-app-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <p className="block text-sm font-medium text-earth-700">Areas of expertise *</p>
        <p className="mt-1 text-xs text-earth-500">Select at least one</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MENTORSHIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleExpertise(cat)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                expertise.includes(cat)
                  ? "bg-primary-500 text-white"
                  : "bg-earth-100 text-earth-700 hover:bg-earth-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="mentor-app-experience" className="block text-sm font-medium text-earth-700">
          Brief experience / background *
        </label>
        <textarea
          id="mentor-app-experience"
          required
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="input mt-1 min-h-[100px] resize-y"
          placeholder="e.g. 5 years in software engineering, led teams at..."
          rows={4}
        />
      </div>
      <div>
        <label htmlFor="mentor-app-why" className="block text-sm font-medium text-earth-700">
          Why do you want to mentor? *
        </label>
        <textarea
          id="mentor-app-why"
          required
          value={whyMentor}
          onChange={(e) => setWhyMentor(e.target.value)}
          className="input mt-1 min-h-[100px] resize-y"
          placeholder="A few sentences about your motivation..."
          rows={4}
        />
      </div>
      {error && (
        <p className="text-sm text-amber-700">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
