"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function VerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(next);
    }, 3000);
    return () => clearTimeout(timer);
  }, [next, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="card p-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-earth-900">Email Verified!</h1>
          <p className="mt-3 text-earth-600">
            Your email has been successfully verified. You&apos;re all set!
          </p>
          <p className="mt-2 text-sm text-earth-400">
            Redirecting you to your dashboard…
          </p>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-earth-100">
            <div className="h-full animate-[grow_3s_linear_forwards] rounded-full bg-green-500" />
          </div>
          <button
            onClick={() => router.push(next)}
            className="btn-primary mt-6 w-full"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense>
      <VerifiedContent />
    </Suspense>
  );
}
