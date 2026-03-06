import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Partners & Sponsors",
  description: "Universities, organizations, and institutions supporting our mentorship platform.",
};

const PARTNERS = [
  { name: "Tech for Good Foundation", type: "Non-profit", description: "Supporting digital skills and mentorship in emerging markets." },
  { name: "Global Education Network", type: "Education", description: "University partners offering scholarship guidance and resources." },
  { name: "Developer Community Alliance", type: "Industry", description: "Connecting volunteer mentors from tech companies worldwide." },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-earth-50/50">
      <section className="border-b border-earth-100 bg-white py-16 sm:py-20">
        <div className="container-wide text-center">
          <h1 className="section-heading">Partners & Sponsors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-earth-600">
            Universities, organizations, and institutions that help us expand access to mentorship worldwide.
          </p>
        </div>
      </section>

      <section className="container-wide py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p) => (
            <div key={p.name} className="card-hover flex flex-col p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-semibold text-earth-900">{p.name}</h2>
              <p className="mt-1 text-sm font-medium text-primary-600">{p.type}</p>
              <p className="mt-2 flex-1 text-sm text-earth-600">{p.description}</p>
            </div>
          ))}
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
