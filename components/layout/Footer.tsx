import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/categories", label: "Categories" },
  { href: "/mentors", label: "Find Mentors" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-earth-200 bg-earth-100 text-earth-700">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-bold text-primary-600">
            <span className="text-xl">🌍</span>
            <span>Mentorship Platform</span>
          </div>
          <nav className="flex flex-wrap gap-4">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium hover:text-primary-600"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-sm text-earth-600">
          Connecting volunteer mentors with mentees across Ethiopia, Africa, and the world.
          Free advice and guidance for everyone.
        </p>
        <p className="mt-2 text-xs text-earth-500">
          © {new Date().getFullYear()} Mentorship Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
