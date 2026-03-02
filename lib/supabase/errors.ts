/**
 * Thrown when NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.
 * Server pages should catch and redirect to /setup. Client will show the message in UI or error boundary.
 */
export const SUPABASE_NOT_CONFIGURED_MSG =
  "SUPABASE_NOT_CONFIGURED";

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (local) or Vercel → Settings → Environment Variables (deployed), then restart or redeploy."
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

export function isSupabaseNotConfiguredError(e: unknown): boolean {
  if (e instanceof SupabaseNotConfiguredError) return true;
  return e instanceof Error && e.message === SUPABASE_NOT_CONFIGURED_MSG;
}
