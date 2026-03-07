"use server";

import { createClient } from "@/lib/supabase/server";

export type AdvisorMessage = { role: "user" | "assistant"; content: string };

export type AdvisorResult =
  | { ok: true; reply: string; mentors: MentorSuggestion[] }
  | { ok: false; error: string };

export type MentorSuggestion = {
  id: string;
  name: string;
  current_position: string | null;
  organization: string | null;
  expertise_categories: string[];
  bio: string | null;
};

const SYSTEM_PROMPT = `You are an expert AI career advisor on a mentorship platform for students and young professionals, especially from underrepresented communities. Your role is to:

1. Give clear, actionable career guidance for questions about scholarships, PhD programs, career paths, universities, internships, and professional development.
2. Be warm, encouraging, and specific. Avoid vague advice.
3. When relevant, mention what kind of mentor would help them most (e.g., "You'd benefit from a mentor working in hydrology or environmental science").
4. Keep responses concise — 2–4 short paragraphs. Use bullet points for steps when helpful.
5. If asked about specific universities, scholarships, or programs, give real names and specific details.
6. Always end with one concrete next step the user can take today.

You are NOT a general chatbot. Stay focused on career, education, scholarships, and professional development topics.`;

export async function askAdvisor(
  messages: AdvisorMessage[],
  userProfile?: { role: string; preferredCategories?: string[]; goals?: string }
): Promise<AdvisorResult> {
  const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
  if (!apiKey) {
    return { ok: false, error: "AI advisor is not configured. Please add ANTHROPIC_API_KEY to your environment." };
  }

  try {
    const supabase = await createClient();

    // Fetch mentors to suggest relevant ones based on the conversation
    const { data: mentors } = await supabase
      .from("mentors")
      .select(`
        id,
        expertise_categories,
        user_id,
        users!inner(name, current_position, organization, bio)
      `)
      .eq("verified", true)
      .limit(50);

    const lastUserMessage = messages[messages.length - 1]?.content ?? "";

    // Build context about user profile if available
    let profileContext = "";
    if (userProfile?.goals) profileContext += `\nUser's goals: ${userProfile.goals}`;
    if (userProfile?.preferredCategories?.length) {
      profileContext += `\nUser's interests: ${userProfile.preferredCategories.join(", ")}`;
    }

    const systemWithProfile = SYSTEM_PROMPT + (profileContext ? `\n\nUser profile context:${profileContext}` : "");

    // Call Claude API directly via fetch (avoids needing the SDK installed on Vercel)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemWithProfile,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { ok: false, error: `AI error: ${response.status} ${err.slice(0, 200)}` };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "";

    // Find relevant mentors based on the user's question
    const keywords = lastUserMessage.toLowerCase();
    const suggestedMentors: MentorSuggestion[] = [];

    if (mentors) {
      for (const m of mentors) {
        const cats = (m.expertise_categories ?? []) as string[];
        const matches = cats.some((c) =>
          keywords.includes(c.toLowerCase()) ||
          c.toLowerCase().split(" ").some((word) => keywords.includes(word))
        );
        if (matches) {
          const u = (m as { users: { name: string; current_position: string | null; organization: string | null; bio: string | null } }).users;
          suggestedMentors.push({
            id: m.id,
            name: u.name,
            current_position: u.current_position,
            organization: u.organization,
            expertise_categories: cats,
            bio: u.bio,
          });
          if (suggestedMentors.length >= 3) break;
        }
      }
    }

    return { ok: true, reply, mentors: suggestedMentors };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
