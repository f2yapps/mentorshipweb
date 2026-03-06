import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import Link from "next/link";
import type { UserRole } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      redirect("/auth/login?next=" + encodeURIComponent("/dashboard"));
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("id", authUser.id)
      .single();

    if (!profile) {
      redirect("/auth/register");
    }

    const role = profile.role as UserRole;
    const nav: { href: string; label: string }[] = [];
    if (role === "mentor") nav.push({ href: "/dashboard/mentor", label: "Mentor dashboard" });
    if (role === "mentee") nav.push({ href: "/dashboard/mentee", label: "Mentee dashboard" });
    if (role === "admin") nav.push({ href: "/dashboard/admin", label: "Admin" });

    return (
    <div className="min-h-screen bg-earth-50/50">
      <div className="container-wide py-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <aside className="w-full shrink-0 md:w-52">
            <nav className="rounded-2xl border border-earth-100 bg-white p-3 shadow-soft">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-earth-700 transition-colors hover:bg-earth-50"
                >
                  {label}
                </Link>
              ))}
              <div className="my-2 border-t border-earth-100" />
              <Link
                href="/"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-earth-500 transition-colors hover:bg-earth-50"
              >
                ← Back to site
              </Link>
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
    );
  } catch (e) {
    if (e && typeof e === "object" && (e as Error).message === "NEXT_REDIRECT") throw e;
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
