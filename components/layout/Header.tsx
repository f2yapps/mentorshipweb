"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { NotificationBell } from "@/components/notifications/NotificationBell";

type UserProfile = { id: string; name: string; role: string } | null;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    getSupabaseClientAsync().then((supabase) => {
      const fetchUserProfile = async (authUser: AuthUser) => {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, role")
          .eq("id", authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === "PGRST116") {
            const metadata = authUser.user_metadata;
            const { error: insertError } = await supabase
              .from("users")
              .insert({
                id: authUser.id,
                email: authUser.email,
                name: metadata?.name || "User",
                role: metadata?.role || "mentee",
              });

            if (!insertError) {
              const { data: newData } = await supabase
                .from("users")
                .select("id, name, role")
                .eq("id", authUser.id)
                .single();
              setUser(newData ?? null);
            }
          }
        } else {
          setUser(data ?? null);
        }
      };

      supabase.auth.getUser().then(({ data: { user: authUser } }) => {
        if (authUser) {
          fetchUserProfile(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      });

      subscription = sub;
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = await getSupabaseClientAsync();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/categories", label: "Categories" },
    { href: "/mentors", label: "Find Mentors" },
    ...(user?.role === "mentor" || user?.role === "admin" ? [{ href: "/mentees", label: "Mentees" }] : []),
    { href: "/events", label: "Events" },
    { href: "/media", label: "Media Gallery" },
  ];

  const dashboardHref =
    user?.role === "mentor"
      ? "/dashboard/mentor"
      : user?.role === "mentee"
        ? "/dashboard/mentee"
        : user?.role === "admin"
          ? "/dashboard/admin"
          : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-earth-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary-600">
          <span className="text-xl">🌍</span>
          <span>Mentorship</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-primary-100 text-primary-800"
                  : "text-earth-700 hover:bg-earth-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!loading &&
            (user ? (
              <>
                <Link href={dashboardHref} className="btn-ghost text-sm">
                  Dashboard
                </Link>
                <NotificationBell userId={user.id} />
                <Link href="/profile" className="hidden text-sm text-earth-600 hover:text-primary-600 transition-colors sm:inline">{user.name}</Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-ghost text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">
                  Log in
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            ))}
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-earth-200 bg-white px-4 py-3 md:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-earth-700 hover:bg-earth-100"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                href="/notifications"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-earth-700 hover:bg-earth-100"
                onClick={() => setMenuOpen(false)}
              >
                Notifications
              </Link>
              <Link
                href={dashboardHref}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-earth-700 hover:bg-earth-100"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-earth-700 hover:bg-earth-100"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
