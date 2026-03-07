-- ── Migration 019: Direct Messaging ──────────────────────────────────────────
-- conversations: one per mentor-mentee pair
-- messages: individual messages within a conversation

CREATE TABLE IF NOT EXISTS public.conversations (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id             UUID        NOT NULL REFERENCES public.mentors(id)  ON DELETE CASCADE,
  mentee_id             UUID        NOT NULL REFERENCES public.mentees(id)  ON DELETE CASCADE,
  mentorship_request_id UUID        REFERENCES public.mentorship_requests(id) ON DELETE SET NULL,
  last_message_at       TIMESTAMPTZ,
  last_message_preview  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID        NOT NULL REFERENCES public.users(id)         ON DELETE CASCADE,
  body            TEXT        NOT NULL CHECK (char_length(trim(body)) > 0),
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_mentor_id  ON public.conversations(mentor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_mentee_id  ON public.conversations(mentee_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;

-- conversations: readable/writable only by participants
CREATE POLICY "conversations: participant read"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.mentors  WHERE id = mentor_id AND user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.mentees  WHERE id = mentee_id AND user_id = auth.uid())
  );

CREATE POLICY "conversations: participant insert"
  ON public.conversations FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.mentors  WHERE id = mentor_id AND user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.mentees  WHERE id = mentee_id AND user_id = auth.uid())
  );

CREATE POLICY "conversations: participant update"
  ON public.conversations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.mentors  WHERE id = mentor_id AND user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.mentees  WHERE id = mentee_id AND user_id = auth.uid())
  );

-- messages: readable/writable only by conversation participants
CREATE POLICY "messages: participant read"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (
          EXISTS (SELECT 1 FROM public.mentors  WHERE id = c.mentor_id AND user_id = auth.uid())
          OR
          EXISTS (SELECT 1 FROM public.mentees  WHERE id = c.mentee_id AND user_id = auth.uid())
        )
    )
  );

CREATE POLICY "messages: participant insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (
          EXISTS (SELECT 1 FROM public.mentors  WHERE id = c.mentor_id AND user_id = auth.uid())
          OR
          EXISTS (SELECT 1 FROM public.mentees  WHERE id = c.mentee_id AND user_id = auth.uid())
        )
    )
  );

-- ── Trigger: keep last_message_at + preview up to date ────────────────────────
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message_at      = NEW.created_at,
    last_message_preview = left(NEW.body, 80)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
