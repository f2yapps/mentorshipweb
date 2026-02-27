import Link from "next/link";

/**
 * Shown when NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY
 * are missing/invalid so the app doesn't throw a cryptic Server Components error.
 */
export function EnvSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-50 px-4">
      <div className="max-w-xl w-full card p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">⚙️</span>
          <h1 className="text-2xl font-bold text-earth-900">
            Supabase setup required
          </h1>
        </div>
        <p className="text-earth-700 mb-6">
          The app needs Supabase credentials to run. Add them to{" "}
          <code className="bg-earth-200 px-1.5 py-0.5 rounded text-sm">
            .env.local
          </code>{" "}
          and restart the dev server.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-earth-800 mb-6">
          <li>
            Open your Supabase project →{" "}
            <strong>Settings → API</strong>
          </li>
          <li>
            Copy <strong>Project URL</strong> and <strong>anon public</strong> key
          </li>
          <li>
            Create or edit <code className="bg-earth-200 px-1 rounded">.env.local</code> in the project root with:
          </li>
        </ol>
        <pre className="bg-earth-900 text-earth-100 rounded-lg p-4 text-sm overflow-x-auto mb-6">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-full-anon-key`}
        </pre>
        <p className="text-sm text-earth-600 mb-6">
          Get the real values from Supabase; the anon key is long (200+ chars) and starts with <code className="bg-earth-200 px-1 rounded">eyJ</code>.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/check-env"
            className="btn-primary"
          >
            Check env vars
          </a>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Open Supabase dashboard
          </a>
        </div>
        <p className="mt-6 text-sm text-earth-500">
          After updating <code className="bg-earth-200 px-1 rounded">.env.local</code>, run{" "}
          <code className="bg-earth-200 px-1 rounded">npm run dev</code> again.
        </p>
      </div>
    </div>
  );
}
