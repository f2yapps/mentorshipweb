"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMediaPost } from "@/app/actions/media";

export function MediaDeleteButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteMediaPost(postId);
    if (result.ok) {
      router.refresh();
    } else {
      alert(result.error ?? "Failed to delete");
      setLoading(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded px-2 py-0.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition"
        >
          {loading ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="rounded px-2 py-0.5 text-xs font-medium text-earth-500 hover:text-earth-700 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="text-xs text-red-500 hover:text-red-700 hover:underline transition"
    >
      Delete
    </button>
  );
}
