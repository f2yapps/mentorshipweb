/**
 * Supabase server client for use in Server Components, Route Handlers, and Server Actions.
 * Uses cookies for session management with @supabase/ssr.
 * Throws SupabaseNotConfiguredError when env vars are missing so we never use a placeholder client.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseNotConfiguredError } from "./errors";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseNotConfiguredError();
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: any;
        }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component; ignore
        }
      },
    },
  });
}
