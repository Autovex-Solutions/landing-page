"use client";

// Floating chat-launcher widget, mounted once in layout.tsx so it's on
// every page (mobile + desktop — sizing scales down under 640px via
// --robot-scale in globals.css). Closed by default: just the launcher
// button, matching the standard "site assistant" pattern — the supplied
// component had no minimized state at all, just the always-expanded
// character, which isn't workable as a persistent element on every page.
// Re-themed from a gray shell + cyan glow onto the site's own dark +
// phosphor-amber system, and rebuilt with plain CSS (globals.css) instead
// of Tailwind utility classes / an inline <style> block — this codebase's
// `@import "tailwindcss"` wraps its output in `@layer utilities`, which
// always loses to unlayered plain CSS, so Tailwind classes here would
// have silently done nothing.
//
// Chat is backed by a real model now (app/api/chat/route.ts, Groq) —
// the API key lives server-side only (.env.local locally, the Vercel
// project's env vars in production) and is never sent to the browser;
// this component only ever talks to our own /api/chat route.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, X } from "lucide-react";

type Message = { id: number; text: string; sender: "bot" | "user" };

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Hi! I'm the Autovex agent. How can I help?", sender: "bot" },
];

const FALLBACK_REPLY = "Sorry, I'm having trouble connecting right now — try again in a moment, or book a call and we'll help directly.";

export default function RobotAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    chatEndRef.current?.scrollIntoView({ behavior: noMotion ? "auto" : "smooth" });
  }, [messages, open, sending]);

  // Focus the input on open, close on Escape, return focus to the
  // launcher on close (both this way and via the X button) — same
  // pattern as the mobile nav drawer, minus the full focus trap: this is
  // a non-modal widget, the rest of the page stays reachable while it's
  // open. The focus-return has to live in the cleanup, not called
  // straight after setOpen(false): calling it synchronously races
  // React's render, since the launcher button doesn't exist in the DOM
  // (and launcherRef.current is still null) until the next commit —
  // cleanup runs after that commit, once it's actually there to focus.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      launcherRef.current?.focus();
    };
  }, [open]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || sending) return;

    const history = [...messages, { id: Date.now(), text, sender: "user" as const }];
    setMessages(history);
    setInputValue("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const reply: string = res.ok && data.reply ? data.reply : FALLBACK_REPLY;
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: "bot" }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: FALLBACK_REPLY, sender: "bot" }]);
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <div className="robot-launcher-group">
        <div className="robot-greeting" onClick={() => setOpen(true)}>
          Hello! How can I assist you today?
        </div>
        <button
          ref={launcherRef}
          className="robot-launcher"
          aria-label="Open the Autovex agent chat"
          onClick={() => setOpen(true)}
        >
          <Bot size={26} strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div className="robot-widget" role="dialog" aria-label="Autovex agent chat">
      <button className="robot-close" aria-label="Close chat" onClick={() => setOpen(false)}>
        <X size={16} strokeWidth={2} />
      </button>

      <div className="robot-figure">
        {/* Purely decorative shell — aria-hidden, not the chat itself */}
        <div className="robot-antenna" aria-hidden="true">
          <span className="robot-antenna-dot" />
          <span className="robot-antenna-rod" />
        </div>

        <div className="robot-head" aria-hidden="true">
          <div className="robot-visor">
            <span className="robot-eye" />
            <span className="robot-eye" />
          </div>
          <span className="robot-ear robot-ear-left" />
          <span className="robot-ear robot-ear-right" />
        </div>

        <div className="robot-neck" aria-hidden="true" />

        <div className="robot-torso">
          <div className="robot-screen">
            <div className="robot-screen-glare" aria-hidden="true" />
            <div className="robot-messages" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`robot-msg robot-msg-${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {sending && <div className="robot-msg robot-msg-bot robot-msg-typing">…</div>}
              <div ref={chatEndRef} />
            </div>
            <form className="robot-form" onSubmit={handleSend}>
              <label htmlFor="robot-input" className="sr-only">
                Message the Autovex agent
              </label>
              <input
                ref={inputRef}
                id="robot-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message…"
                autoComplete="off"
                disabled={sending}
              />
              <button type="submit" aria-label="Send message" disabled={sending}>
                <Send size={14} />
              </button>
            </form>
          </div>
          <div className="robot-buttons" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="robot-base" aria-hidden="true" />
      </div>
    </div>
  );
}
