import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=confirmation_failed", url.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL("/auth/login?error=confirmation_failed", url.origin)
      );
    }

    // Determine where to send the user based on role + onboarding state
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "mentor") {
        const { data: mentor } = await supabase
          .from("mentors")
          .select("id")
          .eq("user_id", user.id)
          .single();
        return NextResponse.redirect(
          new URL(mentor ? "/dashboard/mentor" : "/auth/mentor", url.origin)
        );
      }

      if (profile?.role === "mentee") {
        const { data: mentee } = await supabase
          .from("mentees")
          .select("id")
          .eq("user_id", user.id)
          .single();
        return NextResponse.redirect(
          new URL(mentee ? "/dashboard/mentee" : "/auth/mentee", url.origin)
        );
      }

      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", url.origin));
      }
    }

    return NextResponse.redirect(new URL(next, url.origin));
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) {
      return NextResponse.redirect(new URL("/setup", url.origin));
    }
    return NextResponse.redirect(
      new URL("/auth/login?error=confirmation_failed", url.origin)
    );
  }
}
