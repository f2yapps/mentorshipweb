'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { isSupabaseNotConfiguredError } from '@/lib/supabase/errors'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isSupabaseSetup = isSupabaseNotConfiguredError(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong!
            </h1>
          </div>

          {!isSupabaseSetup && !(error.message.includes("Server Components") || error.message.includes("omitted in production")) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Error Details</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-mono text-sm break-words">{error.message}</p>
                {error.digest && <p className="text-red-600 text-xs mt-2">Error ID: {error.digest}</p>}
              </div>
            </div>
          )}

          {(isSupabaseSetup || error.message.includes("Server Components") || error.message.includes("omitted in production")) && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            {isSupabaseSetup ? (
              <p className="text-amber-900 text-sm">{error.message}</p>
            ) : (
              <>
                <p className="text-amber-900 text-sm">
                  A page hit an error. Often this is due to Supabase: wrong or missing env vars, or the project is paused.
                </p>
                <p className="mt-2 text-amber-800 text-sm">
                  <strong>Local:</strong> Check <code className="bg-amber-100 px-1 rounded">.env.local</code> and the terminal running <code className="bg-amber-100 px-1 rounded">npm run dev</code>. You can also open <a href="/api/check-env" className="underline font-medium">/api/check-env</a> to verify env (no secrets shown).
                </p>
                <p className="mt-2 text-amber-800 text-sm">
                  <strong>Deployed:</strong> In Vercel add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then redeploy.
                </p>
              </>
            )}
            <p className="mt-3 text-amber-800 text-sm">
              <a href="/setup" className="underline font-medium">Go to setup instructions →</a>
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
