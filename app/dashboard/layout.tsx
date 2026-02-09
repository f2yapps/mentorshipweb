import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { UserRole } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-earth-700 hover:bg-earth-100"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-earth-500 hover:bg-earth-100"
            >
              ← Back to site
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
