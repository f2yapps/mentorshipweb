import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account as a mentor or mentee.",
};

type Props = { searchParams: Promise<{ role?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;
  const role = params.role === "mentor" ? "mentor" : "mentee";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-earth-50 to-earth-100 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-stretch">
        <div className="max-w-md text-center lg:text-left">
          <h1 className="section-heading sm:text-4xl">Create your account</h1>
          <p className="mt-3 text-earth-700">
            Sign up as a {role} to start requesting or offering mentorship in AI, technology, and career growth.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-earth-700">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/70 px-4 py-2 shadow-soft">
              <span className="text-base">✅</span>
              <span>100% free for both mentors and mentees</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/70 px-4 py-2 shadow-soft">
              <span className="text-base">🔒</span>
              <span>Your data is protected and never sold</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="card-glow rounded-2xl border border-earth-100 bg-white/90 p-6 shadow-soft-lg backdrop-blur-sm sm:p-8">
            <h2 className="text-lg font-semibold text-earth-900">Sign up</h2>
            <p className="mt-1 text-sm text-earth-600">
              Choose your role and create your free account.
            </p>
            <RegisterForm defaultRole={role} className="mt-6" />
            <p className="mt-6 text-center text-sm text-earth-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
