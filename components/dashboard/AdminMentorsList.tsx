"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mentor = {
  id: string;
  user_id: string;
  expertise_categories: string[];
  verified: boolean;
  users: { name: string; email: string } | null;
};

type Props = { mentors: Mentor[]; className?: string };

export function AdminMentorsList({ mentors, className = "" }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const setVerified = async (mentorId: string, verified: boolean) => {
    await supabase.from("mentors").update({ verified }).eq("id", mentorId);
    router.refresh();
  };

  if (mentors.length === 0) {
    return (
      <div className="rounded-lg border border-earth-200 bg-earth-50 p-6 text-center text-earth-600">
        No mentors yet.
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {mentors.map((m) => (
        <div key={m.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium text-earth-900">{m.users?.name ?? "—"}</p>
            <p className="text-sm text-earth-600">{m.users?.email}</p>
            <p className="mt-1 text-xs text-earth-500">
              {m.expertise_categories?.slice(0, 5).join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                m.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {m.verified ? "Verified" : "Unverified"}
            </span>
            <button
              type="button"
              onClick={() => setVerified(m.id, !m.verified)}
              className="btn-ghost text-sm"
            >
              {m.verified ? "Unverify" : "Approve"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
