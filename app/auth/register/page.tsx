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
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <h1 className="section-heading">Create an account</h1>
      <p className="mt-2 text-earth-600">
        Sign up as a {role} to get started.
      </p>
      <RegisterForm defaultRole={role} className="mt-8" />
      <p className="mt-6 text-center text-sm text-earth-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
