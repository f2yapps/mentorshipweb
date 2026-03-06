import Link from "next/link";
import { HelpCircle, Mail, FileText, Shield, Handshake } from "lucide-react";

const PLATFORM_LINKS = [
  { href: "/mentors", label: "Find Mentors" },
  { href: "/events", label: "Events" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog / Insights" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/community", label: "Community" },
  { href: "/media", label: "Media Gallery" },
  { href: "/auth/register?role=mentee", label: "Join as Mentee" },
  { href: "/become-a-mentor", label: "Become a Mentor" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact Us" },
  { href: "/partners", label: "Partners / Sponsors" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", icon: Mail },
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/terms", label: "Terms of Service", icon: FileText },
  { href: "/partners", label: "Partners / Sponsors", icon: Handshake },
];

export function Footer() {
  return (
    <footer className="relative bg-earth-950 text-earth-300">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      <div className="container-wide py-14 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg shadow-md">
                🌍
              </span>
              <span className="text-lg">Mentorship</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-earth-400">
              Connecting volunteer mentors worldwide with scholars in developing
              countries. Free, global, and powered by generosity.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:f2yapps@support.com"
                className="inline-flex items-center gap-2 rounded-xl bg-earth-800 px-4 py-2.5 text-sm font-semibold text-earth-300 transition hover:bg-primary-700 hover:text-white"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-earth-500">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              {PLATFORM_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-earth-400 transition hover:text-primary-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-earth-500">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-earth-400 transition hover:text-primary-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-earth-500">
              Support & Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {SUPPORT_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-earth-400 transition hover:text-white"
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-earth-800/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-earth-500">
            © {new Date().getFullYear()} Mentorship Platform. All rights reserved.
          </p>
          <p className="text-xs font-medium text-earth-600">
            Built to bridge the mentorship gap across Africa, Asia, and the world. 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
