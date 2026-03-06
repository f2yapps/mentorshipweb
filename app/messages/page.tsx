"use client";

import { useState, useEffect } from "react";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  User,
} from "lucide-react";

type Conversation = {
  id: string;
  otherName: string;
  otherId: string;
  lastMessage?: string;
  lastAt?: string;
};

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; body: string; sender_id: string; created_at: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabaseClientAsync().then(async (supabase) => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/auth/login?next=/messages");
        return;
      }
      const { data: profile } = await supabase
        .from("users")
        .select("id, name")
        .eq("id", authUser.id)
        .single();
      setUser(profile ?? null);

      // Mock conversations for UI demo (replace with real conversations from DB when table exists)
      setConversations([
        { id: "1", otherName: "David K.", otherId: "d1", lastMessage: "Sounds good! Let's meet Thursday.", lastAt: "2025-03-04" },
        { id: "2", otherName: "Jennifer L.", otherId: "d2", lastMessage: "Here's the resource I mentioned.", lastAt: "2025-03-03" },
      ]);
      setLoading(false);
    });
  }, [router]);

  const selected = conversations.find((c) => c.id === selectedId);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-earth-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-earth-50/50">
      <div className="border-b border-earth-100 bg-white py-8">
        <div className="container-wide">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-earth-600 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-earth-900 sm:text-3xl">Messages</h1>
          <p className="mt-1 text-earth-600">Chat with your mentors and mentees.</p>
        </div>
      </div>

      <div className="container-wide py-6">
        <div className="mx-auto flex max-w-4xl overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-soft">
          {/* Conversation list */}
          <div className="w-full shrink-0 border-r border-earth-100 sm:w-80">
            <div className="flex h-14 items-center border-b border-earth-100 px-4">
              <MessageCircle className="h-5 w-5 text-primary-600" />
              <span className="ml-2 font-semibold text-earth-900">Conversations</span>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      selectedId === c.id ? "bg-primary-50" : "hover:bg-earth-50"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {c.otherName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-earth-900">{c.otherName}</p>
                      {c.lastMessage && (
                        <p className="truncate text-xs text-earth-500">{c.lastMessage}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {conversations.length === 0 && (
              <div className="p-6 text-center text-sm text-earth-500">
                No conversations yet. When you have an active mentorship, you can message here.
              </div>
            )}
          </div>

          {/* Chat area */}
          <div className="flex flex-1 flex-col min-h-[60vh]">
            {selected ? (
              <>
                <div className="flex h-14 items-center border-b border-earth-100 px-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {selected.otherName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="ml-3 font-semibold text-earth-900">{selected.otherName}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Placeholder messages for demo */}
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-earth-100 px-4 py-2 text-sm text-earth-800">
                        Hi! Thanks for connecting. When would work for a first call?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary-500 px-4 py-2 text-sm text-white">
                        How about Thursday afternoon?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-earth-100 px-4 py-2 text-sm text-earth-800">
                        Sounds good! Let&apos;s meet Thursday.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-earth-100 p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newMessage.trim()) setNewMessage("");
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input flex-1"
                    />
                    <button type="submit" className="btn-primary shrink-0">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <User className="h-12 w-12 text-earth-300" />
                <p className="mt-4 font-medium text-earth-700">Select a conversation</p>
                <p className="mt-1 text-sm text-earth-500">
                  Choose a conversation from the list to view and send messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
