"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact, teardown } from "@/content";

// Describe-your-workflow → instant n8n-style pipeline sketch + hours estimate.
// Idles as a self-running demo: auto-types pre-baked workflows and draws their
// diagrams on a loop until the visitor clicks the box and takes over.
// ponytail: keyword heuristics for user input, fully client-side — the real
// LLM-backed engine is PLAN_pipeline-engine.md.
type SkNode = { label: string; kind: "trigger" | "step" | "done" };
type Row = SkNode | [SkNode, SkNode]; // pair = parallel branch
type Sketch = { rows: Row[]; perWeek: number };

const STEP = 180; // ms per node in the stagger

const DEMOS: { text: string; sketch: Sketch }[] = [
  {
    text: "We get hundreds of marketing emails a day and someone has to sift the real inquiries from the fake ones.",
    sketch: {
      rows: [
        { label: "Email lands in the inbox", kind: "trigger" },
        { label: "AI reads it — real or noise?", kind: "step" },
        [
          { label: "Noise → archived & logged", kind: "step" },
          { label: "Real → routed to sales", kind: "step" },
        ],
        { label: "Sales sees only real leads", kind: "done" },
      ],
      perWeek: 9,
    },
  },
  {
    text: "Invoices arrive as PDFs and someone retypes every one into the CRM, then chases approvals over email for days.",
    sketch: {
      rows: [
        { label: "Invoice PDF arrives", kind: "trigger" },
        { label: "Fields extracted — nothing retyped", kind: "step" },
        { label: "CRM row created & matched", kind: "step" },
        { label: "Approver nudged until signed", kind: "step" },
        { label: "Books current, nobody chased", kind: "done" },
      ],
      perWeek: 14,
    },
  },
  {
    text: "Booking requests come in by email, we schedule them by hand and chase no-shows on WhatsApp all day.",
    sketch: {
      rows: [
        { label: "Booking request arrives", kind: "trigger" },
        { label: "Slot found, calendar booked", kind: "step" },
        { label: "WhatsApp confirmation + reminders", kind: "step" },
        [
          { label: "Shows up → ticket ready", kind: "step" },
          { label: "No-show → rebooked", kind: "step" },
        ],
        { label: "Calendar stays full", kind: "done" },
      ],
      perWeek: 11,
    },
  },
];

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
    rows: [
      { label: trigger, kind: "trigger" },
      ...steps.map((label) => ({ label, kind: "step" as const })),
      { label: "Done — team notified, nothing retyped", kind: "done" },
    ],
    perWeek,
  };
}

export default function TeardownSketch() {
  const [mode, setMode] = useState<"demo" | "user">("demo");
  const [demoText, setDemoText] = useState("");
  const [text, setText] = useState("");
  const [sketch, setSketch] = useState<Sketch | null>(null);
  const [mine, setMine] = useState(false);
  const [runId, setRunId] = useState(0);
  const [on, setOn] = useState(false);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // arm the demo when the panel scrolls into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // self-running demo loop: type a workflow, draw its pipeline, hold, next.
  // Dies for good the moment the visitor focuses the textarea (mode → user).
  useEffect(() => {
    if (!started || mode !== "demo") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDemoText(DEMOS[0].text);
      setSketch(DEMOS[0].sketch);
      setOn(true);
      return;
    }
    let dead = false;
    let timer: ReturnType<typeof setTimeout>;
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timer = setTimeout(res, ms);
      });
    (async () => {
      for (let d = 0; !dead; d = (d + 1) % DEMOS.length) {
        const demo = DEMOS[d];
        setDemoText("");
        await sleep(600);
        for (let i = 1; i <= demo.text.length && !dead; i++) {
          setDemoText(demo.text.slice(0, i));
          await sleep(demo.text[i - 1] === " " ? 55 : 22 + Math.random() * 34);
        }
        if (dead) break;
        await sleep(400);
        setSketch(demo.sketch);
        setRunId((n) => n + 1);
        // let the stagger finish, then hold long enough to read
        await sleep(demo.sketch.rows.length * STEP + 4600);
      }
    })();
    return () => {
      dead = true;
      clearTimeout(timer);
    };
  }, [started, mode]);

  // re-arm the stagger on every new run: reset, let the reset paint, then play
  useEffect(() => {
    if (runId === 0) return;
    setOn(false);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [runId]);

  const takeOver = () => {
    if (mode === "demo") setMode("user");
  };

  const run = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSketch(build(text));
    setMine(true);
    setRunId((n) => n + 1);
  };

  const monthly = sketch ? Math.round(sketch.perWeek * 4.3) : 0;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(teardown.mailSubject)}&body=${encodeURIComponent(
    text.trim() || teardown.sample,
  )}`;

  const node = (n: SkNode, delay: number, key?: number) => (
    <div key={key} className={`node n-${n.kind}`} style={{ transitionDelay: `${delay}ms` }}>
      {n.label}
      {n.kind === "trigger" && <small>trigger</small>}
    </div>
  );

  return (
    <div className="sketch" ref={rootRef}>
      <div className="sketch-bar mono">
        <span>PIPELINE.SKETCH — live</span>
        <span className="sample-chip">{mine ? "yours" : "demo"}</span>
      </div>
      <div className="sketch-body">
        <form className="sk-form" onSubmit={run}>
          <label htmlFor="sk-input">
            {mode === "demo" ? "Demo running — click in to describe yours" : "Describe the workflow you hate"}
          </label>
          <textarea
            id="sk-input"
            value={mode === "demo" ? `${demoText}▍` : text}
            placeholder={mode === "user" ? teardown.placeholder : ""}
            onChange={(e) => setText(e.target.value)}
            onFocus={takeOver}
            rows={5}
          />
          <button className="btn primary sk-run" type="submit">
            Sketch my pipeline <span className="arrow">&rarr;</span>
          </button>
          <p className="sk-note">
            A 5-second sketch, not the real thing. The engineered teardown — a human, your numbers —
            is free: <a href={mailHref}>{teardown.ctaLabel.toLowerCase()}</a>
          </p>
        </form>
        <div className={`sk${on ? " in" : ""}`} aria-live={mine ? "polite" : "off"} key={runId}>
          {sketch && (
            <>
              {sketch.rows.map((row, i) => (
                <div key={`${runId}-${i}`} className="sk-item">
                  {i > 0 && <span className="link" style={{ transitionDelay: `${i * STEP - 90}ms` }} />}
                  {Array.isArray(row) ? (
                    <div className="fork">{row.map((n, j) => node(n, (i + j * 0.5) * STEP, j))}</div>
                  ) : (
                    node(row, i * STEP)
                  )}
                </div>
              ))}
              <div className="sk-total" style={{ transitionDelay: `${(sketch.rows.length + 1) * STEP + 100}ms` }}>
                <span>estimated time back</span>
                <b>&asymp; {monthly} hrs/month</b>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
