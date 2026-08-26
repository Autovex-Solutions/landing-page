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
const MAX_REPLY_TOKENS = 120; // hard cap so a reply can't outgrow the chat screen, whatever the prompt says

const SYSTEM_PROMPT = `You are the Autovex Solutions site assistant, embedded as a small chat widget (one narrow bubble, no scrolling room) on autovexsolutions.com.
Autovex Solutions is an AI automation, custom software, web platform, and mobile app development agency. Services: AI automation (pipelines that kill busywork), custom software (dashboards, admin panels), web platforms, mobile apps (iOS/Android), UI/UX design, and a free "teardown" (describe a workflow you hate, get an automation plan with real numbers back in 48 hours).
Contact if asked: ${contact.email} · ${contact.phone} · book a call at ${contact.bookingUrl}

Hard rules, because this is a tiny chat bubble, not an email:
- ONE short sentence per reply. Two only if truly necessary. Never more.
- Never list more than one service in a single reply — answer only what was actually asked, pick the single most relevant thing rather than enumerating everything Autovex does. If they want more, they'll ask a follow-up.
- Plain conversational text only — no bullet points, numbered lists, headers, bold/italic markup, or line breaks.
- If you don't know something concrete (pricing, timelines), say so in one sentence and point to booking a call or the free teardown, don't guess or pad the answer.
- Never invent case studies, prices, or promises the site doesn't make.`;

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
