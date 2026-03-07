import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Partners & Sponsors",
  description: "Universities, organizations, and institutions supporting our mentorship platform.",
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Partners & Sponsors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            We work with universities, nonprofits, and companies to expand access to mentorship worldwide.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <h2 className="text-xl font-bold text-earth-900 sm:text-2xl">Our partners</h2>
        <p className="mt-2 text-earth-600">Universities and organizations that support our mission.</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Grid kept for when you add real partners; no fake placeholder names */}
          <div className="rounded-2xl border border-earth-200 bg-white p-8 text-center shadow-soft">
            <Building2 className="mx-auto h-12 w-12 text-earth-300" />
            <p className="mt-4 text-sm font-medium text-earth-500">Partners will be listed here</p>
          </div>
        </div>
        <div className="mt-16 rounded-2xl border border-primary-200 bg-primary-50/50 p-8 text-center">
          <Handshake className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-4 text-xl font-semibold text-earth-900">Become a partner</h2>
          <p className="mx-auto mt-2 max-w-xl text-earth-600">
            Organizations interested in partnering with us can reach out to discuss collaboration, sponsorship, or joint programs.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
