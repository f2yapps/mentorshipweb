"use server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseNotConfiguredError } from "@/lib/supabase/errors";
import { revalidatePath } from "next/cache";
import { PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react";

async function deleteOpportunity(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("opportunities").delete().eq("id", id);
  revalidatePath("/admin/opportunities");
}

async function upsertOpportunity(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const supabase = await createClient();

  const fieldRaw = (formData.get("field_of_study") as string) ?? "";
  const fields = fieldRaw.split(",").map((f) => f.trim()).filter(Boolean);

  const payload = {
    title: formData.get("title") as string,
    organization: formData.get("organization") as string,
    description: formData.get("description") as string || null,
    country: formData.get("country") as string || null,
    degree_level: formData.get("degree_level") as string || null,
    field_of_study: fields.length ? fields : ["any"],
    eligibility: formData.get("eligibility") as string || null,
    funding_type: formData.get("funding_type") as string || null,
    deadline: formData.get("deadline") as string || null,
    application_link: formData.get("application_link") as string || null,
    opportunity_type: formData.get("opportunity_type") as string,
    is_published: formData.get("is_published") === "true",
  };

  if (id) {
    await supabase.from("opportunities").update(payload).eq("id", id);
  } else {
    await supabase.from("opportunities").insert(payload);
  }
  revalidatePath("/admin/opportunities");
  revalidatePath("/opportunities");
}

export default async function AdminOpportunitiesPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") redirect("/dashboard");

    const { data: opportunities } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    const items = opportunities ?? [];

    return (
      <div className="min-h-screen bg-earth-50 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-earth-900">Manage Opportunities</h1>
              <p className="text-sm text-earth-500 mt-1">{items.length} total entries</p>
            </div>
            <Link href="#add-form" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add New
            </Link>
          </div>

          {/* Add / Edit form */}
          <div id="add-form" className="card p-6 mb-8">
            <h2 className="text-base font-semibold text-earth-800 mb-4">Add Opportunity</h2>
            <form action={upsertOpportunity} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value="" />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Title *</label>
                <input name="title" required className="input w-full" placeholder="e.g. Fulbright Foreign Student Program" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Organization *</label>
                <input name="organization" required className="input w-full" placeholder="e.g. U.S. Department of State" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Type *</label>
                <select name="opportunity_type" required className="input w-full">
                  <option value="scholarship">Scholarship</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Country</label>
                <input name="country" className="input w-full" placeholder="e.g. United States" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Degree Level</label>
                <select name="degree_level" className="input w-full">
                  <option value="">Any</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="masters">Masters</option>
                  <option value="phd">PhD</option>
                  <option value="any">Any Level</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Funding Type</label>
                <select name="funding_type" className="input w-full">
                  <option value="">Unknown</option>
                  <option value="full">Fully Funded</option>
                  <option value="partial">Partial</option>
                  <option value="stipend">Stipend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Deadline</label>
                <input name="deadline" type="date" className="input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Fields of Study (comma-separated)</label>
                <input name="field_of_study" className="input w-full" placeholder="e.g. Agriculture, Economics, Law" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Application Link</label>
                <input name="application_link" type="url" className="input w-full" placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Description</label>
                <textarea name="description" rows={3} className="input w-full" placeholder="Brief description of the opportunity..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Eligibility</label>
                <textarea name="eligibility" rows={2} className="input w-full" placeholder="Who can apply?" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1">Published</label>
                <select name="is_published" className="input w-full">
                  <option value="true">Yes - visible to users</option>
                  <option value="false">No - draft/hidden</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">Save Opportunity</button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3">
            {items.map((opp) => (
              <div key={opp.id} className={`card p-4 flex flex-wrap items-start justify-between gap-3 ${!opp.is_published ? "opacity-60" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full bg-earth-100 px-2 py-0.5 text-xs font-medium text-earth-600 capitalize">
                      {opp.opportunity_type}
                    </span>
                    {!opp.is_published && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Draft</span>
                    )}
                    {opp.deadline && new Date(opp.deadline + "T00:00:00") < new Date() && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Expired</span>
                    )}
                  </div>
                  <p className="font-semibold text-earth-900 text-sm">{opp.title}</p>
                  <p className="text-xs text-earth-500">{opp.organization} {opp.country ? `· ${opp.country}` : ""} {opp.deadline ? `· Deadline: ${opp.deadline}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {opp.application_link && (
                    <a href={opp.application_link} target="_blank" rel="noopener noreferrer" className="text-earth-400 hover:text-earth-700" title="Open application link">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link href={`/opportunities/${opp.id}`} className="text-earth-400 hover:text-primary-600" title="View detail">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <form action={deleteOpportunity}>
                    <input type="hidden" name="id" value={opp.id} />
                    <button
                      type="submit"
                      className="text-earth-400 hover:text-red-600"
                      title="Delete"
                      onClick={(e) => { if (!confirm("Delete this opportunity?")) e.preventDefault(); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (e) {
    if (isSupabaseNotConfiguredError(e)) redirect("/setup");
    throw e;
  }
}
