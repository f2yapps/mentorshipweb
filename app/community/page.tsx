import { createClient } from "@/lib/supabase/server";
import { CommunityClient } from "@/components/community/CommunityClient";
import type { DiscussionRow } from "@/components/community/CommunityClient";

export default async function CommunityPage() {
  let discussions: DiscussionRow[] = [];
  try {
    const supabase = await createClient();
    const { data: rows } = await supabase
      .from("community_discussions")
      .select("id, body, category, created_at, users(name)")
      .order("created_at", { ascending: false });

    discussions = (rows ?? []).map((r) => {
      const u = (r as { users?: { name: string | null } | null }).users;
      return {
        id: r.id,
        body: r.body,
        category: r.category ?? "General",
        created_at: r.created_at,
        users: u ?? null,
      };
    });
  } catch {
    // Table may not exist yet; run migration 018_community_discussions.sql
  }

  return <CommunityClient discussions={discussions} />;
}
