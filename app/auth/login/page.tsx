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
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <h1 className="section-heading">Log in</h1>
      <p className="mt-2 text-earth-600">
        Sign in to access your dashboard and mentorship.
      </p>
      <Suspense fallback={<div className="mt-8">Loading...</div>}>
        <LoginForm className="mt-8" />
      </Suspense>
      <p className="mt-6 text-center text-sm text-earth-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
