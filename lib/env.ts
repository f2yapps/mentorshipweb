/**
 * Check if Supabase env vars are set and look valid (no secret values exposed).
 * Use in root layout to show a setup page instead of throwing in Server Components.
 * Trims values so leading/trailing whitespace in .env.local doesn't break the check.
 */
export function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!url || !anonKey) return false;
  if (url.includes("placeholder") || anonKey.includes("placeholder")) return false;
  if (url.includes("YOUR_PROJECT_REF") || anonKey.includes("your-full-key")) return false;
  // Anon key should be a JWT: long and start with eyJ (same as /api/check-env)
  if (!anonKey.startsWith("eyJ") || anonKey.length <= 200) return false;

  return true;
}
