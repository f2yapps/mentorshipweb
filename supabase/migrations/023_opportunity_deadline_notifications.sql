-- ── Migration 023: Opportunity deadline notification trigger ─────────────────
-- When a new opportunity is inserted, notify all mentees who have bookmarked it
-- (useful when deadline is updated). Also creates a function admins can call
-- to send deadline reminders for opportunities closing within N days.

-- Function: notify users who saved an opportunity about its deadline
CREATE OR REPLACE FUNCTION public.notify_opportunity_deadline(days_until INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
  opp RECORD;
  saved RECORD;
  notif_msg TEXT;
  notified INTEGER := 0;
BEGIN
  FOR opp IN
    SELECT id, title, deadline
    FROM public.opportunities
    WHERE is_published = true
      AND deadline IS NOT NULL
      AND deadline = CURRENT_DATE + days_until
  LOOP
    FOR saved IN
      SELECT user_id FROM public.saved_opportunities WHERE opportunity_id = opp.id
    LOOP
      notif_msg := 'Deadline reminder: "' || opp.title || '" closes in ' || days_until || ' days (' || TO_CHAR(opp.deadline, 'Mon DD, YYYY') || ').';
      INSERT INTO public.notifications (user_id, type, title, message, body, related_entity_type, related_entity_id)
      VALUES (
        saved.user_id,
        'opportunity_deadline',
        'Upcoming scholarship deadline',
        notif_msg,
        notif_msg,
        'opportunity',
        opp.id
      )
      ON CONFLICT DO NOTHING;
      notified := notified + 1;
    END LOOP;
  END LOOP;
  RETURN notified;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger: when a new opportunity is published, notify all users
-- (kept lightweight — just a stub; full fan-out would use Edge Functions)
CREATE OR REPLACE FUNCTION public.notify_new_opportunity()
RETURNS TRIGGER AS $$
BEGIN
  -- We do nothing here by default to avoid fan-out to all users on insert.
  -- Use notify_opportunity_deadline() via a scheduled cron job instead.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_opportunity_published ON public.opportunities;
CREATE TRIGGER on_opportunity_published
  AFTER INSERT ON public.opportunities
  FOR EACH ROW
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION public.notify_new_opportunity();
