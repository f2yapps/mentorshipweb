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
        <div className="mx-auto max-w-lg rounded-2xl border border-earth-200 bg-white p-10 text-center shadow-soft">
          <Building2 className="mx-auto h-14 w-14 text-earth-400" />
          <h2 className="mt-6 text-xl font-semibold text-earth-900">Building our partner network</h2>
          <p className="mt-3 text-earth-600">
            We are in conversations with universities and organizations that share our mission. Our first partners will be listed here once agreements are in place.
          </p>
          <div className="mt-10 rounded-2xl border border-primary-200 bg-primary-50/50 p-8">
            <Handshake className="mx-auto h-12 w-12 text-primary-600" />
            <h3 className="mt-4 font-semibold text-earth-900">Interested in partnering?</h3>
            <p className="mt-2 text-sm text-earth-600">
              Whether you represent a university, NGO, or company, we would love to explore collaboration.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
