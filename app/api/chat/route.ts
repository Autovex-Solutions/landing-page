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

const SYSTEM_PROMPT = `You are the Autovex Solutions site assistant, embedded as a chat widget on autovexsolutions.com.
Autovex Solutions is an AI automation, custom software, web platform, and mobile app development agency.
What we offer:
- AI automation: wiring a client's tools together into pipelines that handle busywork end to end.
- Custom software: internal dashboards, admin panels and bespoke systems.
- Web platforms: fast, search-friendly marketing sites and web apps.
- Mobile apps: iOS and Android apps built for growth.
- UI/UX design: wireframes through production-ready screens.
- A free "teardown": a visitor describes a workflow they hate and gets an engineered automation plan with real numbers back within 48 hours.
Contact: ${contact.email} · ${contact.phone} · book a call at ${contact.bookingUrl}
Keep replies short — 2-4 sentences, plain conversational text only. The chat widget renders plain text, not markdown, so never use bullet points, numbered lists, headers, or bold/italic markup; write it the way you'd actually say it out loud. Be friendly and specific to Autovex. If you don't know something concrete (pricing, timelines for a specific project), say so plainly and point them to booking a call or using the free teardown form rather than guessing. Never invent case studies, prices, or promises the site doesn't make.`;

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
        max_tokens: 400,
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
