// Supabase Edge Function: sync-opportunities
// Fetches scholarship/fellowship listings from public RSS feeds and
// inserts new entries into the opportunities table.
// Deploy: supabase functions deploy sync-opportunities
// Invoke:  via pg_cron HTTP call or Supabase dashboard "Run" button.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// RSS sources — all are free public syndication feeds
const RSS_SOURCES = [
  {
    url: "https://www.opportunitydesk.org/feed/",
    defaultType: "scholarship" as const,
    defaultFunding: "full" as const,
  },
  {
    url: "https://www.scholars4dev.com/feed/",
    defaultType: "scholarship" as const,
    defaultFunding: "full" as const,
  },
];

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

function extractText(xml: string, tag: string): string {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(xml);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : "";
}

function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    items.push({
      title: extractText(itemXml, "title"),
      link: extractText(itemXml, "link") || extractText(itemXml, "guid"),
      description: extractText(itemXml, "description"),
      pubDate: extractText(itemXml, "pubDate"),
    });
  }
  return items;
}

// Strip HTML tags and truncate
function cleanText(html: string, maxLen = 500): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

// Best-effort: guess deadline from text like "Deadline: March 15, 2025"
function guessDeadline(text: string): string | null {
  const patterns = [
    /deadline[:\s]+([A-Za-z]+ \d{1,2},?\s*\d{4})/i,
    /closing date[:\s]+([A-Za-z]+ \d{1,2},?\s*\d{4})/i,
    /apply by[:\s]+([A-Za-z]+ \d{1,2},?\s*\d{4})/i,
    /due[:\s]+([A-Za-z]+ \d{1,2},?\s*\d{4})/i,
  ];
  for (const p of patterns) {
    const m = p.exec(text);
    if (m) {
      const d = new Date(m[1]);
      if (!isNaN(d.getTime()) && d > new Date()) {
        return d.toISOString().split("T")[0];
      }
    }
  }
  return null;
}

// Best-effort: guess country from title/description
function guessCountry(text: string): string | null {
  const countries = [
    "United States", "United Kingdom", "Germany", "Canada", "Australia",
    "France", "Netherlands", "Sweden", "Norway", "Japan", "China",
    "South Korea", "India", "South Africa", "Kenya", "Ethiopia",
    "Ghana", "Nigeria", "Rwanda", "Tanzania", "Uganda",
    "Multiple", "Remote", "Global",
  ];
  for (const c of countries) {
    if (text.toLowerCase().includes(c.toLowerCase())) return c;
  }
  return null;
}

// Best-effort: guess degree level
function guessDegree(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("phd") || lower.includes("doctoral") || lower.includes("doctorate")) return "phd";
  if (lower.includes("master") || lower.includes("msc") || lower.includes("mba") || lower.includes("postgrad")) return "masters";
  if (lower.includes("bachelor") || lower.includes("undergraduate") || lower.includes("bsc")) return "bachelor";
  return "any";
}

// Best-effort: guess opportunity type
function guessType(text: string): "scholarship" | "fellowship" | "internship" {
  const lower = text.toLowerCase();
  if (lower.includes("internship") || lower.includes("intern ")) return "internship";
  if (lower.includes("fellowship") || lower.includes("fellow ")) return "fellowship";
  return "scholarship";
}

// Guess funding type
function guessFunding(text: string): "full" | "partial" | "stipend" | "other" {
  const lower = text.toLowerCase();
  if (lower.includes("fully funded") || lower.includes("full scholarship") || lower.includes("full funding")) return "full";
  if (lower.includes("partial") || lower.includes("part-funded")) return "partial";
  if (lower.includes("stipend") || lower.includes("allowance")) return "stipend";
  return "full"; // most listed scholarships are fully funded
}

// Extract organization from title like "Fulbright Scholarship – U.S. Department of State"
function guessOrg(title: string, description: string): string {
  // Look for "by <Org>" or "from <Org>" patterns
  const byMatch = /(?:by|from|offered by|sponsored by)\s+([A-Z][^,.\n]{3,60})/i.exec(description);
  if (byMatch) return byMatch[1].trim().slice(0, 100);
  // Try dash-separated: "Title – Organization"
  const dashMatch = /[–—-]\s*([A-Z][^,.\n]{3,60})$/.exec(title);
  if (dashMatch) return dashMatch[1].trim().slice(0, 100);
  return "Various";
}

Deno.serve(async (req) => {
  // Allow only POST or GET (for cron invocations)
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let totalInserted = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  for (const source of RSS_SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: { "User-Agent": "MentorshipPlatform/1.0 (scholarship aggregator)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        errors.push(`${source.url}: HTTP ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRssItems(xml);

      for (const item of items.slice(0, 20)) { // max 20 per source per run
        if (!item.title || !item.link) continue;

        const combined = `${item.title} ${item.description}`;
        const deadline = guessDeadline(combined);

        // Skip if deadline is in the past
        if (deadline && new Date(deadline) < new Date()) continue;

        const payload = {
          title: item.title.slice(0, 200),
          organization: guessOrg(item.title, item.description),
          description: cleanText(item.description, 600),
          country: guessCountry(combined),
          degree_level: guessDegree(combined),
          field_of_study: ["any"],
          eligibility: null,
          funding_type: guessFunding(combined),
          deadline: deadline,
          application_link: item.link,
          opportunity_type: guessType(combined),
          is_published: true,
        };

        // Use application_link as unique key to avoid duplicates
        const { data: existing } = await supabase
          .from("opportunities")
          .select("id")
          .eq("application_link", item.link)
          .maybeSingle();

        if (existing) {
          totalSkipped++;
          continue;
        }

        const { error } = await supabase.from("opportunities").insert(payload);
        if (error) {
          errors.push(`Insert failed for "${item.title}": ${error.message}`);
        } else {
          totalInserted++;
        }
      }
    } catch (err) {
      errors.push(`${source.url}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return Response.json({
    ok: true,
    inserted: totalInserted,
    skipped: totalSkipped,
    errors,
    ran_at: new Date().toISOString(),
  });
});
