'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error)
  }, [error])

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

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Error Details:
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-mono text-sm break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-600 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>

          {error.message.includes('Supabase') && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                🔧 How to fix Supabase configuration:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Settings → API</li>
                <li>Copy the full Project URL and anon/public key</li>
                <li>Update your .env.local file with the complete credentials</li>
                <li>Restart your development server</li>
              </ol>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="border-2 border-primary-500 text-primary-700 px-6 py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Go home
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              If this error persists, please check:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Your .env.local file has valid Supabase credentials</li>
              <li>• Your Supabase project is active and accessible</li>
              <li>• You&apos;ve restarted the development server after updating .env.local</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
