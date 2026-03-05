import Link from "next/link";

const LINKS = {
  Platform: [
    { href: "/mentors", label: "Find Mentors" },
    { href: "/categories", label: "Mentorship Areas" },
    { href: "/media", label: "Media Gallery" },
    { href: "/auth/register?role=mentee", label: "Join as Mentee" },
    { href: "/auth/register?role=mentor", label: "Volunteer as Mentor" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ],
  Account: [
    { href: "/auth/login", label: "Sign In" },
    { href: "/auth/register", label: "Create Account" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile/edit", label: "Edit Profile" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/best-practices", label: "Best Practices" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-earth-200 bg-earth-950 text-earth-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <span className="text-2xl">🌍</span>
              <span className="text-lg">Mentorship Platform</span>
            </Link>
            <p className="mt-3 text-sm text-earth-400 leading-relaxed">
              Connecting volunteer mentors worldwide with scholars in developing
              countries. Free, global, and powered by generosity.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="mailto:f2yapps@support.com"
                className="rounded-lg bg-earth-800 px-3 py-1.5 text-xs font-medium text-earth-300 hover:bg-earth-700 hover:text-white transition"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>

          {/* Nav groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-earth-500">
                {group}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-earth-400 hover:text-white transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-3 border-t border-earth-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-earth-500">
            © {new Date().getFullYear()} Mentorship Platform. All rights reserved.
          </p>
          <p className="text-xs text-earth-600">
            Built to bridge the mentorship gap across Africa, Asia, and the world.
          </p>
        </div>
      </div>
    </footer>
  );
}
