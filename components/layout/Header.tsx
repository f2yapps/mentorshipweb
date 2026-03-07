"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  HelpCircle,
  Layers,
  Users,
  UserCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  Trophy,
  MessageCircle,
  Image,
  LayoutDashboard,
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

type UserProfile = { id: string; name: string; role: string } | null;

const MAIN_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { href: "/categories", label: "Categories", icon: Layers },
  { href: "/mentors", label: "Find Mentors", icon: Users },
  { href: "/mentees", label: "Mentees", icon: UserCircle },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/career-advisor", label: "AI Career Advisor", icon: GraduationCap },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/blog", label: "Blog / Insights", icon: FileText },
  { href: "/success-stories", label: "Success Stories", icon: Trophy },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/media", label: "Media Gallery", icon: Image },
];

const VISIBLE_MAIN = ["/", "/about", "/how-it-works", "/categories", "/mentors"];
const EXPLORE_LABEL = "Explore";
const MORE_LINKS_RAW = MAIN_LINKS.filter((l) => !VISIBLE_MAIN.includes(l.href));
// Media Gallery first, then rest in original order
const MORE_LINKS = [
  ...MORE_LINKS_RAW.filter((l) => l.href === "/media"),
  ...MORE_LINKS_RAW.filter((l) => l.href !== "/media"),
];

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  pathname: string;
  onClick?: () => void;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-primary-100 text-primary-700" : "text-earth-600 hover:bg-earth-100 hover:text-earth-900"
      }`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const moreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
        if (authUser) fetchUserProfile(authUser);
        else setUser(null);
        setLoading(false);
      });

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session?.user) fetchUserProfile(session.user);
        else setUser(null);
      });
      subscription = sub;
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleSignOut = async () => {
    const supabase = await getSupabaseClientAsync();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const dashboardHref =
    user?.role === "mentor"
      ? "/dashboard/mentor"
      : user?.role === "mentee"
        ? "/dashboard/mentee"
        : user?.role === "admin"
          ? "/dashboard/admin"
          : "/";

  const showMentees = user?.role === "mentor" || user?.role === "admin";
  const visibleLinks = MAIN_LINKS.filter((l) => VISIBLE_MAIN.includes(l.href));
  const mainNavLinks = showMentees
    ? [...visibleLinks, MAIN_LINKS.find((l) => l.href === "/mentees")!].filter(Boolean)
    : visibleLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-earth-100/60 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg shadow-md">
            🌍
          </span>
          <span className="hidden bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-lg text-transparent sm:inline">
            Mentorship
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-0.5">
          {mainNavLinks.map(({ href, label, icon }) => (
            <NavLink key={href} href={href} label={label} icon={icon} pathname={pathname} />
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                MORE_LINKS.some((l) => l.href === pathname)
                  ? "bg-primary-100 text-primary-700"
                  : "text-earth-600 hover:bg-earth-100 hover:text-earth-900"
              }`}
            >
              {EXPLORE_LABEL}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-earth-100 bg-white py-2 shadow-soft-xl ring-1 ring-black/5">
                {MORE_LINKS.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === href ? "bg-primary-50 text-primary-800" : "text-earth-700 hover:bg-earth-50"
                    }`}
                  >
                    {icon && (() => {
                      const Icon = icon;
                      return <Icon className="h-4 w-4" />;
                    })()}
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {!loading &&
            (user ? (
              <>
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-earth-200 bg-earth-50 px-3 py-1.5 text-sm font-semibold text-earth-800 transition hover:bg-earth-100 hover:border-earth-300"
                  >
                    <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-earth-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-earth-100 bg-white py-2 shadow-soft-xl ring-1 ring-black/5">
                      <Link
                        href={dashboardHref}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <Bell className="h-4 w-4" /> Notifications
                      </Link>
                      <Link
                        href="/messages"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <MessageSquare className="h-4 w-4" /> Messages
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-earth-700 hover:bg-earth-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm font-semibold">
                  Log in
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm px-5">
                  Get Started →
                </Link>
              </>
            ))}
          <button
            type="button"
            className="rounded-xl p-2 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-earth-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {mainNavLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100"
                onClick={() => setMenuOpen(false)}
              >
                {icon && (() => {
                  const Icon = icon;
                  return <Icon className="h-4 w-4" />;
                })()}
                {label}
              </Link>
            ))}
          </div>
          <p className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-earth-500">{EXPLORE_LABEL}</p>
          <div className="flex flex-col gap-1">
            {MORE_LINKS.filter((l) => l.href !== "/mentees" || showMentees).map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100"
                onClick={() => setMenuOpen(false)}
              >
                {icon && (() => {
                  const Icon = icon;
                  return <Icon className="h-4 w-4" />;
                })()}
                {label}
              </Link>
            ))}
          </div>
          {user && (
            <div className="mt-4 border-t border-earth-100 pt-4">
              <Link href={dashboardHref} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/notifications" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100" onClick={() => setMenuOpen(false)}>Notifications</Link>
              <Link href="/messages" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100" onClick={() => setMenuOpen(false)}>Messages</Link>
              <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link href="/settings" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-earth-700 hover:bg-earth-100" onClick={() => setMenuOpen(false)}>Settings</Link>
              <button type="button" onClick={() => { setMenuOpen(false); handleSignOut(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-earth-700 hover:bg-earth-100">Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
