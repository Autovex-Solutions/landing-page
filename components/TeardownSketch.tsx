"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact, teardown } from "@/content";

// Describe-your-workflow → instant n8n-style pipeline sketch + hours estimate.
// ponytail: keyword heuristics, fully client-side — the honest label on the
// panel says "instant sketch"; the real engine is PLAN_pipeline-engine.md.
type SketchNode = { label: string; kind: "trigger" | "step" | "done" };
type Sketch = { nodes: SketchNode[]; perWeek: number };

const TRIGGERS: [RegExp, string][] = [
  [/invoice|billing|receipt/i, "Invoice arrives"],
  [/order|purchase/i, "New order lands"],
  [/lead|enquir|inquir|form/i, "New lead comes in"],
  [/book|appointment|schedul/i, "Booking request arrives"],
  [/email|inbox|message|whatsapp|dm\b/i, "Message hits the inbox"],
];

const STEPS: [RegExp, string][] = [
  [/pdf|scan|extract|retype|re-?type|copy|paste|data entry|spreadsheet|sheet|excel/i, "Extract & enter the data"],
  [/crm|hubspot|salesforce|pipedrive/i, "Update the CRM"],
  [/invoice|quickbooks|xero|billing/i, "Generate & send the invoice"],
  [/chase|remind|follow.?up|no.?show|late|overdue/i, "Chase it automatically"],
  [/schedul|calendar|book|appointment/i, "Schedule & confirm"],
  [/reply|respond|answer|draft/i, "Draft the reply"],
  [/report|summar|dashboard|kpi/i, "Compile the report"],
  [/dispatch|shipping|deliver|driver|inventory|stock/i, "Sync ops & notify dispatch"],
  [/approv|review|sign.?off/i, "Route for approval"],
  [/whatsapp|slack|telegram|sms|text/i, "Route & answer messages"],
];

function build(text: string): Sketch {
  const trigger = TRIGGERS.find(([re]) => re.test(text))?.[1] ?? "The work shows up";
  const steps = STEPS.filter(([re]) => re.test(text))
    .map(([, label]) => label)
    .slice(0, 4);
  if (steps.length === 0) steps.push("Extract the busywork", "Process & validate", "Update your tools");
  const volume = /daily|every day|each|hundreds|dozens|constant|all day|hours/i.test(text) ? 6 : 0;
  const perWeek = 3 + steps.length * 4 + volume;
  return {
    nodes: [
      { label: trigger, kind: "trigger" },
      ...steps.map((label) => ({ label, kind: "step" as const })),
      { label: "Done — team notified, nothing retyped", kind: "done" },
    ],
    perWeek,
  };
}

export default function TeardownSketch() {
  const [text, setText] = useState("");
  const [sketch, setSketch] = useState<Sketch>(() => build(teardown.sample));
  const [mine, setMine] = useState(false);
  const [runId, setRunId] = useState(0);
  const [on, setOn] = useState(false);
  const skRef = useRef<HTMLDivElement>(null);

  // first run: play the sample stagger when scrolled into view;
  // later runs: re-arm with a double rAF so the reset paints first
  useEffect(() => {
    setOn(false);
    if (runId === 0) {
      const el = skRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(el);
      return () => io.disconnect();
    }
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [runId]);

  const run = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSketch(build(text));
    setMine(true);
    setRunId((n) => n + 1);
  };

  const monthly = Math.round(sketch.perWeek * 4.3);
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(teardown.mailSubject)}&body=${encodeURIComponent(
    text.trim() || teardown.sample,
  )}`;
  const step = 180; // ms per node in the stagger

  return (
    <div className="sketch">
      <div className="sketch-bar mono">
        <span>PIPELINE.SKETCH — instant estimate</span>
        <span className="sample-chip">{mine ? "yours" : "sample"}</span>
      </div>
      <div className="sketch-body">
        <form className="sk-form" onSubmit={run}>
          <label htmlFor="sk-input">Describe the workflow you hate</label>
          <textarea
            id="sk-input"
            value={text}
            placeholder={teardown.placeholder}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
          <button className="btn primary sk-run" type="submit">
            Sketch my pipeline <span className="arrow">&rarr;</span>
          </button>
        </form>
        <div className={`sk${on ? " in" : ""}`} aria-live="polite" key={runId} ref={skRef}>
          {sketch.nodes.map((node, i) => (
            <div key={`${runId}-${node.label}`} className="sk-item">
              {i > 0 && <span className="link" style={{ transitionDelay: `${i * step - 90}ms` }} />}
              <div className={`node n-${node.kind}`} style={{ transitionDelay: `${i * step}ms` }}>
                {node.label}
                {node.kind === "trigger" && <small>trigger</small>}
              </div>
            </div>
          ))}
          <div className="sk-total" style={{ transitionDelay: `${sketch.nodes.length * step + 200}ms` }}>
            <span>estimated time back</span>
            <b>&asymp; {monthly} hrs/month</b>
          </div>
        </div>
        <p className="sk-note">
          A 5-second sketch, not the real thing. The engineered teardown — a human, your numbers —
          is free: <a href={mailHref}>{teardown.ctaLabel.toLowerCase()}</a>
        </p>
      </div>
    </div>
  );
}
