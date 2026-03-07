import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { BookmarkButton } from "@/components/opportunities/BookmarkButton";
import {
  Calendar, ExternalLink, GraduationCap, Globe,
  Building2, ArrowLeft, Banknote, BookOpen,
} from "lucide-react";

const DEGREE_LABELS: Record<string, string> = {
  bachelor: "Bachelor's", masters: "Master's", phd: "PhD", any: "Any Level",
};
const FUNDING_LABELS: Record<string, string> = {
  full: "Fully Funded", partial: "Partial Funding", stipend: "Stipend", other: "Other",
};
const TYPE_LABELS: Record<string, string> = {
  scholarship: "Scholarship", fellowship: "Fellowship", internship: "Internship",
};
const TYPE_COLORS: Record<string, string> = {
  scholarship: "bg-primary-100 text-primary-700",
  fellowship: "bg-purple-100 text-purple-700",
  internship: "bg-green-100 text-green-700",
};
const FUNDING_COLORS: Record<string, string> = {
  full: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-700",
  stipend: "bg-blue-100 text-blue-700",
  other: "bg-earth-100 text-earth-600",
};

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: opp } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single();

    if (!opp) notFound();

    let isSaved = false;
    if (user) {
      const { data: saved } = await supabase
        .from("saved_opportunities")
        .select("id")
        .eq("user_id", user.id)
        .eq("opportunity_id", id)
        .maybeSingle();
      isSaved = !!saved;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = opp.deadline ? new Date(opp.deadline + "T00:00:00") : null;
    const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / 86400000) : null;
    const isExpired = daysLeft !== null && daysLeft < 0;
    const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-earth-800 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to opportunities
          </Link>

          <div className="card overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-primary-500 to-primary-700" />
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[opp.opportunity_type] ?? "bg-earth-100 text-earth-600"}`}>
                      {TYPE_LABELS[opp.opportunity_type] ?? opp.opportunity_type}
                    </span>
                    {opp.funding_type && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${FUNDING_COLORS[opp.funding_type] ?? "bg-earth-100 text-earth-600"}`}>
                        {FUNDING_LABELS[opp.funding_type] ?? opp.funding_type}
                      </span>
                    )}
                    {isExpired && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Closed</span>
                    )}
                    {isUrgent && !isExpired && (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                        {daysLeft === 0 ? "Closes today!" : `${daysLeft} days left`}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-earth-900">{opp.title}</h1>
                  <p className="mt-1 text-base text-earth-600 font-medium">{opp.organization}</p>
                </div>
                {user && (
                  <BookmarkButton opportunityId={opp.id} initialSaved={isSaved} />
                )}
              </div>

              {/* Quick facts */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {opp.country && (
                  <div className="rounded-xl bg-earth-50 p-3 text-center">
                    <Globe className="mx-auto mb-1 h-4 w-4 text-earth-400" />
                    <p className="text-xs text-earth-500">Country</p>
                    <p className="mt-0.5 text-sm font-semibold text-earth-800">{opp.country}</p>
                  </div>
                )}
                {opp.degree_level && (
                  <div className="rounded-xl bg-earth-50 p-3 text-center">
                    <GraduationCap className="mx-auto mb-1 h-4 w-4 text-earth-400" />
                    <p className="text-xs text-earth-500">Degree</p>
                    <p className="mt-0.5 text-sm font-semibold text-earth-800">
                      {DEGREE_LABELS[opp.degree_level] ?? opp.degree_level}
                    </p>
                  </div>
                )}
                {opp.funding_type && (
                  <div className="rounded-xl bg-earth-50 p-3 text-center">
                    <Banknote className="mx-auto mb-1 h-4 w-4 text-earth-400" />
                    <p className="text-xs text-earth-500">Funding</p>
                    <p className="mt-0.5 text-sm font-semibold text-earth-800">
                      {FUNDING_LABELS[opp.funding_type] ?? opp.funding_type}
                    </p>
                  </div>
                )}
                {deadline && (
                  <div className={`rounded-xl p-3 text-center ${isUrgent && !isExpired ? "bg-red-50" : "bg-earth-50"}`}>
                    <Calendar className={`mx-auto mb-1 h-4 w-4 ${isUrgent && !isExpired ? "text-red-400" : "text-earth-400"}`} />
                    <p className={`text-xs ${isUrgent && !isExpired ? "text-red-500" : "text-earth-500"}`}>Deadline</p>
                    <p className={`mt-0.5 text-sm font-semibold ${isUrgent && !isExpired ? "text-red-700" : isExpired ? "text-earth-400" : "text-earth-800"}`}>
                      {deadline.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {opp.description && (
                <section className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-2">About</h2>
                  <p className="text-sm text-earth-700 leading-relaxed">{opp.description}</p>
                </section>
              )}

              {/* Eligibility */}
              {opp.eligibility && (
                <section className="mt-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-2">Eligibility</h2>
                  <p className="text-sm text-earth-700 leading-relaxed">{opp.eligibility}</p>
                </section>
              )}

              {/* Fields of study */}
              {Array.isArray(opp.field_of_study) &&
                opp.field_of_study.filter((f: string) => f !== "any").length > 0 && (
                <section className="mt-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-2">
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Fields of Study</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {opp.field_of_study
                      .filter((f: string) => f !== "any")
                      .map((f: string) => (
                        <span key={f} className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                          {f}
                        </span>
                      ))}
                  </div>
                </section>
              )}

              {/* Organization */}
              <section className="mt-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-earth-500 mb-2">
                  <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Organization</span>
                </h2>
                <p className="text-sm font-medium text-earth-800">{opp.organization}</p>
              </section>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                {opp.application_link && !isExpired ? (
                  <a
                    href={opp.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 transition"
                  >
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </a>
                ) : isExpired ? (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-earth-100 px-6 py-3 font-semibold text-earth-400 cursor-not-allowed">
                    Application Closed
                  </span>
                ) : null}
                <Link href="/opportunities" className="btn-ghost">
                  Browse More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
