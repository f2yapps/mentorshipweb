/**
 * Supabase browser client for use in Client Components.
 * Throws when env vars are missing so we never hit a placeholder URL and get "Failed to fetch".
 */

import { createBrowserClient } from "@supabase/ssr";
import { SupabaseNotConfiguredError } from "./errors";

export function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseNotConfiguredError();
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
