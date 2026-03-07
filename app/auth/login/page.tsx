import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your mentorship account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-earth-50 to-earth-100 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-stretch">
        <div className="max-w-md text-center lg:text-left">
          <h1 className="section-heading sm:text-4xl">Welcome back</h1>
          <p className="mt-3 text-earth-700">
            Sign in to continue your mentorship journey, track requests, and stay connected with your community.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-earth-600 lg:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 font-medium text-primary-700">
              ✨ Free mentorship platform
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-earth-100 px-3 py-1 font-medium text-earth-700">
              🌍 Global mentors &amp; scholars
            </span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="card-glow rounded-2xl border border-earth-100 bg-white/90 p-6 shadow-soft-lg backdrop-blur-sm sm:p-8">
            <h2 className="text-lg font-semibold text-earth-900">Log in</h2>
            <p className="mt-1 text-sm text-earth-600">
              Use your email and password to access your account.
            </p>
            <Suspense fallback={<div className="mt-8 text-sm text-earth-500">Loading form…</div>}>
              <LoginForm className="mt-6" />
            </Suspense>
            <p className="mt-6 text-center text-sm text-earth-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
