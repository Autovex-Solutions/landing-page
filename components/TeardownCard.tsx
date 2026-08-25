"use client";

// Lead-capture card for the Teardown section, used at every width
// (components/MonitorGuyBanner.tsx). Used to be mobile-only, trading the
// interactive pipeline-sketch demo's diagram for a single instant number —
// that desktop demo (TeardownSketch.tsx) was deleted, so this card is now
// the whole teardown experience, still built on the same heuristic engine.

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contact, teardown } from "@/content";
import { buildSketch, monthlyHours, type Sketch } from "@/lib/teardownEngine";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.21, 1];

export default function TeardownCard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Sketch | null>(null);
  const reduceMotion = useReducedMotion();

  const run = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setResult(buildSketch(text));
  };

  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(teardown.mailSubject)}&body=${encodeURIComponent(
    text.trim() || teardown.sample,
  )}`;

  return (
    <div className="td-card">
      <form className="td-form" onSubmit={run}>
        <label htmlFor="td-input" className="mono">
          Describe the workflow you hate
        </label>
        <textarea
          id="td-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={teardown.placeholder}
          rows={3}
        />
        <button className="btn primary td-run" type="submit">
          {teardown.mobileCta} <span className="arrow">&rarr;</span>
        </button>
      </form>

      {result && (
        <motion.div
          className="td-result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
        >
          <span className="td-result-num">&asymp; {monthlyHours(result)} hrs/month</span>
          <span className="td-result-label">back on your team&rsquo;s plate</span>
          <a className="btn primary td-send" href={mailHref}>
            {teardown.ctaLabel} <span className="arrow">&rarr;</span>
          </a>
          <p className="td-note">A 5-second sketch, not the real thing — the engineered version is free.</p>
        </motion.div>
      )}
    </div>
  );
}
