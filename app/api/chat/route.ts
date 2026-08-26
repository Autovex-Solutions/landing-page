import { NextResponse } from "next/server";
import { contact } from "@/content";

// Server-only proxy to Groq for the RobotAgent chat widget
// (components/RobotAgent.tsx). GROQ_API_KEY lives in .env.local (and, for
// the deployed site, the Vercel project's environment variables) —
// never NEXT_PUBLIC_-prefixed, so it's never bundled into client JS.
// The browser only ever talks to this route, never to Groq directly.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// This key's account only has access to Groq's reasoning-model lineup
// (no plain llama-3.x chat models) — gpt-oss-120b with reasoning_effort
// "low" gives a clean final answer in `content` without leaking
// chain-of-thought into it, confirmed by hand against the live API.
const MODEL = "openai/gpt-oss-120b";
const MAX_HISTORY = 8; // cap context sent per call — cost + latency control
const MAX_MESSAGE_LENGTH = 800;
const MAX_REPLY_TOKENS = 220; // enough room for the full service list; still a hard ceiling

// Knowledge pulled from Autovex_Solutions_Company_Profile.pdf (mission,
// service descriptions, "why choose us", founders) — the model answers
// from this instead of the shorter blurb that used to live inline here.
// Contact stays ${contact.email} (content.ts) rather than the PDF's
// autovexsolutions@gmail.com: that's the address shown everywhere else
// on the site (footer, Cta section), and giving the bot a second
// "official" email would contradict what visitors already see.
const SYSTEM_PROMPT = `You are the Autovex Solutions site assistant, embedded as a small chat widget (one narrow bubble, little scrolling room) on autovexsolutions.com.

About: Autovex Solutions — "Innovate. Automate. Elevate." A technology company helping businesses modernize, automate, and scale through intelligent software, combining AI-driven automation with strong engineering fundamentals. Partners closely with founders, startups, and growing businesses to turn ideas into reliable, production-ready software.

Services:
- AI Automations — custom AI-powered workflows, chatbots, and process automation that eliminate repetitive manual work.
- Custom Software Development — tailored solutions built around each client's own business logic, from internal tools to full-scale enterprise platforms.
- Web Development — modern, responsive, high-performance websites and web apps.
- Mobile App Development — native and cross-platform iOS/Android apps built for speed and reliability.
- UI/UX Design — wireframes, prototypes, and polished interfaces.
Also offered: a free "teardown" — describe a workflow you hate, get back an automation plan with real numbers within 48 hours.

Why Autovex: end-to-end capability (strategy, design, development, automation under one team) · AI-first, not bolted on afterward · founder-led delivery, hands-on on every project · flexible engagement for startups, SMEs, and growing enterprises.

Founders: Huzaifa, Sudais, and Ishaq.
Contact: ${contact.email} · ${contact.phone} · book a call at ${contact.bookingUrl}

Rules, because this is a tiny chat bubble, not an email:
- If asked broadly what Autovex does/offers, list the five services above, one per line (just the name, no descriptions), then one short closing line inviting a follow-up for detail on any of them. Use real line breaks between items, a plain "-" prefix is fine.
- For any narrower question (pricing, a specific service, contact, founders, etc.), answer in ONE short sentence — only what was actually asked, don't recite the whole list.
- Plain text only — no asterisks, bold, numbered lists, or headers.
- If you don't know something concrete (pricing, timelines for a specific project), say so in one sentence and point to booking a call or the free teardown rather than guessing.
- Never invent case studies, prices, or promises this profile and the site don't make.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  // .trim() guards against the single most common way this breaks in
  // practice: a stray leading/trailing space or newline picked up when
  // pasting the value into a dashboard's env var field.
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is not configured." }, { status: 500 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const history = incoming
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
    .slice(-MAX_HISTORY);

  if (history.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        max_tokens: MAX_REPLY_TOKENS,
        temperature: 0.6,
        reasoning_effort: "low",
      }),
    });

    if (!groqRes.ok) {
      // Logged server-side only (visible in Vercel's function logs) — the
      // client only ever gets the generic message below, never Groq's
      // raw error body.
      const detail = await groqRes.text().catch(() => "");
      console.error(`[api/chat] Groq ${groqRes.status}: ${detail}`);
      return NextResponse.json({ error: "Upstream error." }, { status: 502 });
    }

    const data = await groqRes.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "Empty response." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[api/chat] Request failed:", err);
    return NextResponse.json({ error: "Request failed." }, { status: 502 });
  }
}
