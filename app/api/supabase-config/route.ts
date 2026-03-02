/**
 * Returns public Supabase config so the browser can create a client
 * when NEXT_PUBLIC_ vars are missing from the client bundle (e.g. build-time env).
 */

import { NextResponse } from "next/server";

export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  return NextResponse.json({ url, anonKey });
}
