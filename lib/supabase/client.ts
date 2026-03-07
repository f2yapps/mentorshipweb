/**
 * Supabase browser client for use in Client Components.
 * Throws when env vars are missing so we never hit a placeholder URL and get "Failed to fetch".
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseNotConfiguredError } from "./errors";

export function createClient(): SupabaseClient {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseNotConfiguredError();
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Returns a Supabase client for use in the browser. Uses env vars if present;
 * otherwise fetches config from the server so the app works even when
 * NEXT_PUBLIC_ vars weren't inlined at build time. Call this inside event
 * handlers or useEffect, not at module load, so it only runs in the browser.
 */
export async function getSupabaseClientAsync(): Promise<SupabaseClient> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (url && key) {
    return createBrowserClient(url, key);
  }

  const res = await fetch("/api/supabase-config");
  if (!res.ok) {
    throw new SupabaseNotConfiguredError();
  }
  const { url: configUrl, anonKey } = (await res.json()) as {
    url?: string;
    anonKey?: string;
  };
  if (!configUrl || !anonKey) {
    throw new SupabaseNotConfiguredError();
  }
  return createBrowserClient(configUrl, anonKey);
}
