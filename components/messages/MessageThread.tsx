"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { getSupabaseClientAsync } from "@/lib/supabase/client";
import { sendMessage } from "@/app/actions/messages";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

type Props = {
  conversationId: string;
  currentUserId: string;
  otherName: string;
  initialMessages: Message[];
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function MessageThread({ conversationId, currentUserId, otherName, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    let channel: ReturnType<Awaited<ReturnType<typeof getSupabaseClientAsync>>["channel"]>;
    getSupabaseClientAsync().then((supabase) => {
      channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const msg = payload.new as Message;
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        )
        .subscribe();
    });
    return () => {
      getSupabaseClientAsync().then((supabase) => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, [conversationId]);

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed || isPending) return;
    setError(null);
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      sender_id: currentUserId,
      body: trimmed,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages((prev) => [...prev, optimistic]);
    setBody("");
    inputRef.current?.focus();

    startTransition(async () => {
      const result = await sendMessage(conversationId, trimmed);
      if (!result.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setError(result.error);
        setBody(trimmed);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-earth-100 bg-white px-4 py-3 shadow-sm">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-earth-500 hover:bg-earth-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm">
          {otherName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-earth-900">{otherName}</p>
          <p className="text-xs text-earth-400">Direct message</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-earth-50/60">
        {messages.length === 0 && (
          <div className="py-12 text-center text-earth-400 text-sm">
            No messages yet. Say hello! 👋
          </div>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.sender_id === currentUserId;
          const isOptimistic = msg.id.startsWith("opt-");
          const prevMsg = messages[i - 1];
          const showDate =
            !prevMsg ||
            new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="my-4 flex items-center gap-3">
                  <div className="flex-1 border-t border-earth-200" />
                  <span className="text-xs font-medium text-earth-400">
                    {new Date(msg.created_at).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1 border-t border-earth-200" />
                </div>
              )}
              <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isOwn
                      ? `bg-gradient-to-br from-primary-500 to-primary-600 text-white ${isOptimistic ? "opacity-70" : ""}`
                      : "bg-white border border-earth-100 text-earth-900 shadow-soft"
                  } ${isOwn ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                  <p className={`mt-1 text-right text-[10px] ${isOwn ? "text-primary-200" : "text-earth-400"}`}>
                    {formatTime(msg.created_at)}
                    {isOptimistic && " · Sending…"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-earth-100 bg-white px-4 py-3">
        {error && (
          <p className="mb-2 text-xs text-red-600">{error}</p>
        )}
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherName}… (Enter to send, Shift+Enter for newline)`}
            rows={1}
            className="input flex-1 resize-none max-h-32 overflow-y-auto"
            style={{ minHeight: "2.75rem" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!body.trim() || isPending}
            className="btn-primary flex h-11 w-11 items-center justify-center rounded-xl p-0 disabled:opacity-50"
            aria-label="Send"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
