import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { redirect } from "next/navigation";
import { BookmarkButton } from "@/components/opportunities/BookmarkButton";
import { Search, Filter, Calendar, ExternalLink, GraduationCap, Globe } from "lucide-react";

export const metadata = { title: "Scholarships & Opportunities" };

const DEGREE_LABELS: Record<string, string> = {
  bachelor: "Bachelor", masters: "Masters", phd: "PhD", any: "Any Level",
};
const FUNDING_LABELS: Record<string, string> = {
  full: "Fully Funded", partial: "Partial", stipend: "Stipend", other: "Other",
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

type SearchParams = Promise<{
  q?: string; country?: string; degree?: string;
  field?: string; funding?: string; type?: string;
}>;

export default async function OpportunitiesPage({ searchParams }: { searchParams: SearchParams }) {
  try {
    const filters = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from("opportunities")
      .select("*")
      .eq("is_published", true)
      .order("deadline", { ascending: true, nullsFirst: false });

    if (filters.country) query = query.ilike("country", `%${filters.country}%`);
    if (filters.degree) query = query.eq("degree_level", filters.degree);
    if (filters.funding) query = query.eq("funding_type", filters.funding);
    if (filters.type) query = query.eq("opportunity_type", filters.type);
    if (filters.field) query = query.contains("field_of_study", [filters.field]);
    if (filters.q) {
      query = query.or(
        `title.ilike.%${filters.q}%,organization.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
      );
    }

    const { data: opportunities } = await query;

    let savedIds = new Set<string>();
    if (user) {
      const { data: saved } = await supabase
        .from("saved_opportunities")
        .select("opportunity_id")
        .eq("user_id", user.id);
      savedIds = new Set((saved ?? []).map((s: { opportunity_id: string }) => s.opportunity_id));
    }

    const items = opportunities ?? [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="min-h-screen bg-earth-50">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-12 text-white">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold sm:text-4xl">Scholarships &amp; Opportunities</h1>
            <p className="mt-2 text-primary-100 text-lg">
              Discover scholarships, fellowships, and internships tailored for you.
            </p>
            <form method="GET" className="mt-6 flex gap-2">
              {filters.country && <input type="hidden" name="country" value={filters.country} />}
              {filters.degree && <input type="hidden" name="degree" value={filters.degree} />}
              {filters.funding && <input type="hidden" name="funding" value={filters.funding} />}
              {filters.type && <input type="hidden" name="type" value={filters.type} />}
              {filters.field && <input type="hidden" name="field" value={filters.field} />}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
                <input
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Search by title, organization, or keyword..."
                  className="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-earth-900 shadow-sm placeholder:text-earth-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="rounded-xl bg-white px-5 py-3 font-semibold text-primary-700 hover:bg-primary-50 transition">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="lg:w-60 shrink-0">
              <form method="GET">
                {filters.q && <input type="hidden" name="q" value={filters.q} />}
                <div className="card p-5 space-y-5">
                  <div className="flex items-center gap-2 font-semibold text-earth-800">
                    <Filter className="h-4 w-4" /> Filters
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">Type</label>
                    <select name="type" defaultValue={filters.type ?? ""} className="input text-sm w-full">
                      <option value="">All types</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="fellowship">Fellowship</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">Degree Level</label>
                    <select name="degree" defaultValue={filters.degree ?? ""} className="input text-sm w-full">
                      <option value="">Any level</option>
                      <option value="bachelor">Bachelor</option>
                      <option value="masters">Masters</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">Funding</label>
                    <select name="funding" defaultValue={filters.funding ?? ""} className="input text-sm w-full">
                      <option value="">Any funding</option>
                      <option value="full">Fully Funded</option>
                      <option value="partial">Partial</option>
                      <option value="stipend">Stipend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">Country</label>
                    <input name="country" defaultValue={filters.country ?? ""} placeholder="e.g. United States" className="input text-sm w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">Field of Study</label>
                    <input name="field" defaultValue={filters.field ?? ""} placeholder="e.g. Agriculture" className="input text-sm w-full" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1 text-sm">Apply</button>
                    <Link href="/opportunities" className="btn-ghost text-sm px-3">Clear</Link>
                  </div>
                </div>
              </form>
              {user && (
                <Link href="/opportunities/saved" className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 hover:bg-amber-100 transition">
                  Saved Opportunities
                </Link>
              )}
            </aside>

            <div className="flex-1 min-w-0">
              <p className="mb-4 text-sm text-earth-500">
                <span className="font-semibold text-earth-800">{items.length}</span>{" "}
                {items.length === 1 ? "opportunity" : "opportunities"} found
              </p>

              {items.length === 0 ? (
                <div className="card p-12 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-earth-300" />
                  <p className="mt-4 font-semibold text-earth-700">No opportunities match your filters</p>
                  <Link href="/opportunities" className="btn-primary mt-4 inline-flex">Clear filters</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((opp: Record<string, unknown>) => {
                    const deadline = opp.deadline
                      ? new Date((opp.deadline as string) + "T00:00:00")
                      : null;
                    const daysLeft = deadline
                      ? Math.ceil((deadline.getTime() - today.getTime()) / 86400000)
                      : null;
                    const isExpired = daysLeft !== null && daysLeft < 0;
                    const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;

                    return (
                      <div key={opp.id as string} className={`card p-5 ${isExpired ? "opacity-60" : ""}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <Link href={`/opportunities/${opp.id as string}`} className="min-w-0 flex-1 group">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[opp.opportunity_type as string] ?? "bg-earth-100 text-earth-600"}`}>
                                {TYPE_LABELS[opp.opportunity_type as string] ?? (opp.opportunity_type as string)}
                              </span>
                              {opp.funding_type && (
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${FUNDING_COLORS[opp.funding_type as string] ?? "bg-earth-100 text-earth-600"}`}>
                                  {FUNDING_LABELS[opp.funding_type as string] ?? (opp.funding_type as string)}
                                </span>
                              )}
                              {isExpired && (
                                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Closed</span>
                              )}
                              {isUrgent && !isExpired && (
                                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                                  {daysLeft}d left
                                </span>
                              )}
                            </div>
                            <h2 className="font-semibold text-earth-900 text-base group-hover:text-primary-700 transition">{opp.title as string}</h2>
                            <p className="text-sm text-earth-500 mt-0.5">{opp.organization as string}</p>
                          </Link>
                          {user && (
                            <BookmarkButton
                              opportunityId={opp.id as string}
                              initialSaved={savedIds.has(opp.id as string)}
                            />
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-earth-500">
                          {opp.country && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" />{opp.country as string}
                            </span>
                          )}
                          {opp.degree_level && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3.5 w-3.5" />
                              {DEGREE_LABELS[opp.degree_level as string] ?? (opp.degree_level as string)}
                            </span>
                          )}
                          {deadline && (
                            <span className={`flex items-center gap-1 ${isUrgent && !isExpired ? "font-semibold text-red-600" : ""}`}>
                              <Calendar className="h-3.5 w-3.5" />
                              Deadline: {deadline.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>

                        {Array.isArray(opp.field_of_study) &&
                          (opp.field_of_study as string[]).filter((f) => f !== "any").length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(opp.field_of_study as string[])
                                .filter((f) => f !== "any")
                                .slice(0, 5)
                                .map((f: string) => (
                                  <span key={f} className="rounded-full bg-earth-100 px-2 py-0.5 text-[11px] text-earth-600">{f}</span>
                                ))}
                            </div>
                          )}

                        {opp.description && (
                          <p className="mt-3 text-sm text-earth-600 line-clamp-2">{opp.description as string}</p>
                        )}
                        {opp.eligibility && (
                          <p className="mt-2 text-xs text-earth-500">
                            <span className="font-medium">Eligibility:</span> {opp.eligibility as string}
                          </p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/opportunities/${opp.id as string}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-earth-200 bg-white px-4 py-2 text-sm font-medium text-earth-700 hover:bg-earth-50 transition"
                          >
                            View Details
                          </Link>
                          {opp.application_link && !isExpired && (
                            <a
                              href={opp.application_link as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
                            >
                              Apply Now <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
