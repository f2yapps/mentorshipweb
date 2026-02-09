"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

type Props = { defaultRole: UserRole; className?: string };

export function RegisterForm({ defaultRole, className = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // If no session (email confirmation required), redirect to login with message
    const hasSession = !!data.session;
    if (!hasSession) {
      const next =
        role === "mentor" ? "/auth/mentor" : role === "mentee" ? "/auth/mentee" : "/";
      router.push(`/auth/login?next=${encodeURIComponent(next)}&confirmed=pending`);
      router.refresh();
      return;
    }
    // User is signed in - redirect to role-specific onboarding
    if (role === "mentor") {
      router.push("/auth/mentor");
    } else if (role === "mentee") {
      router.push("/auth/mentee");
    } else {
      router.push("/");
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-earth-700">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mt-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-earth-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-earth-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-1"
        />
        <p className="mt-1 text-xs text-earth-500">At least 6 characters</p>
      </div>
      <div>
        <span className="block text-sm font-medium text-earth-700">I am a</span>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="mentee"
              checked={role === "mentee"}
              onChange={() => setRole("mentee")}
              className="h-4 w-4 text-primary-600"
            />
            Mentee
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="mentor"
              checked={role === "mentor"}
              onChange={() => setRole("mentor")}
              className="h-4 w-4 text-primary-600"
            />
            Mentor
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
