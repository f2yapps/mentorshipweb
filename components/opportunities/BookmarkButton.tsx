"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark } from "@/app/actions/opportunities";

export function BookmarkButton({
  opportunityId,
  initialSaved,
}: {
  opportunityId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await toggleBookmark(opportunityId);
    if (res.ok) setSaved(res.bookmarked);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading}
      title={saved ? "Remove bookmark" : "Save opportunity"}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
        saved
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "bg-earth-100 text-earth-600 hover:bg-earth-200"
      }`}
    >
      {saved ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
