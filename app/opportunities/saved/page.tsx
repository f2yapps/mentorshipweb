import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { BookmarkButton } from "@/components/opportunities/BookmarkButton";
import { Calendar, ExternalLink, GraduationCap, Globe } from "lucide-react";

export const metadata = { title: "Saved Opportunities" };

const TYPE_LABELS: Record<string, string> = {
  scholarship: "Scholarship", fellowship: "Fellowship", internship: "Internship",
};
const TYPE_COLORS: Record<string, string> = {
  scholarship: "bg-primary-100 text-primary-700",
  fellowship: "bg-purple-100 text-purple-700",
  internship: "bg-green-100 text-green-700",
};

export default async function SavedOpportunitiesPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?next=/opportunities/saved");

    const { data: saved } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id, opportunities(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const items = (saved ?? []).map((s) => s.opportunities as Record<string, unknown>).filter(Boolean);
    const savedIds = new Set(items.map((o) => o.id as string));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="min-h-screen bg-earth-50 py-10">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-earth-900">Saved Opportunities</h1>
              <p className="text-sm text-earth-500 mt-0.5">{items.length} saved</p>
            </div>
            <Link href="/opportunities" className="btn-secondary text-sm">Browse More</Link>
          </div>

          {items.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="font-semibold text-earth-700">No saved opportunities yet</p>
              <p className="mt-1 text-sm text-earth-500">Browse opportunities and click Save to bookmark them here.</p>
              <Link href="/opportunities" className="btn-primary mt-4 inline-flex">Browse Opportunities</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((opp) => {
                const deadline = opp.deadline ? new Date((opp.deadline as string) + "T00:00:00") : null;
                const daysLeft = deadline ? Math.ceil((deadline.getTime() - today.getTime()) / 86400000) : null;
                const isExpired = daysLeft !== null && daysLeft < 0;
                const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;

                return (
                  <div key={opp.id as string} className={`card p-5 ${isExpired ? "opacity-60" : ""}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[opp.opportunity_type as string] ?? "bg-earth-100 text-earth-600"}`}>
                            {TYPE_LABELS[opp.opportunity_type as string] ?? (opp.opportunity_type as string)}
                          </span>
                          {isExpired && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Closed</span>}
                          {isUrgent && !isExpired && (
                            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">{daysLeft}d left</span>
                          )}
                        </div>
                        <h2 className="font-semibold text-earth-900">{opp.title as string}</h2>
                        <p className="text-sm text-earth-500 mt-0.5">{opp.organization as string}</p>
                      </div>
                      <BookmarkButton opportunityId={opp.id as string} initialSaved={savedIds.has(opp.id as string)} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-earth-500">
                      {opp.country && <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{opp.country as string}</span>}
                      {deadline && (
                        <span className={`flex items-center gap-1 ${isUrgent && !isExpired ? "font-semibold text-red-600" : ""}`}>
                          <Calendar className="h-3.5 w-3.5" />
                          Deadline: {deadline.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>

                    {opp.description && <p className="mt-3 text-sm text-earth-600 line-clamp-2">{opp.description as string}</p>}

                    {opp.application_link && !isExpired && (
                      <div className="mt-4">
                        <a
                          href={opp.application_link as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
                        >
                          Apply Now <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
