/**
 * Dev-only: check if Supabase env vars are set (does not expose values).
 * Visit /api/check-env when running locally to debug config.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const checks = {
    NEXT_PUBLIC_SUPABASE_URL: url
      ? { set: true, length: url.length, preview: `${url.slice(0, 30)}...` }
      : { set: false },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey
      ? { set: true, length: anonKey.length, looksValid: anonKey.startsWith('eyJ') && anonKey.length > 200 }
      : { set: false },
    SUPABASE_SERVICE_ROLE_KEY: serviceKey
      ? { set: true, length: serviceKey.length }
      : { set: false },
  }

  const allOk = checks.NEXT_PUBLIC_SUPABASE_URL.set && checks.NEXT_PUBLIC_SUPABASE_ANON_KEY.set
  const anonValid = checks.NEXT_PUBLIC_SUPABASE_ANON_KEY.set && (checks.NEXT_PUBLIC_SUPABASE_ANON_KEY as { looksValid?: boolean }).looksValid

  return NextResponse.json({
    ok: allOk && anonValid,
    message: !checks.NEXT_PUBLIC_SUPABASE_URL.set
      ? 'Missing NEXT_PUBLIC_SUPABASE_URL in .env.local (or Vercel env vars)'
      : !checks.NEXT_PUBLIC_SUPABASE_ANON_KEY.set
        ? 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (or Vercel env vars)'
        : !anonValid
          ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY looks invalid (should be 200+ chars, start with eyJ...). Get the full key from Supabase → Settings → API.'
          : 'Env vars look set. If you still see errors, check the terminal where npm run dev is running for the real error.',
    checks,
  })
}
