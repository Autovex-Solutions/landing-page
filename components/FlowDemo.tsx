"use client";

import { useEffect, useState } from "react";

/*
 * Live-running version of the example automation flow in Services.
 * Steps activate in sequence like a pipeline executing, then the run
 * restarts. Reduced motion: everything renders in the finished state.
 *
 * Revert to Ishaq's original: restore the static .flow markup in
 * sections.tsx (git history) and delete this file + its CSS block.
 */

const STEPS = [
  { label: "● New lead form submitted", small: "trigger" },
  { label: "Enrich & score the lead", small: "" },
  { label: "Draft a personalised reply", small: "" },
  { label: "✓ CRM updated, rep notified", small: "4 sec" },
];

export default function FlowDemo() {
  // -1 = idle before a run; > STEPS.length = brief "done" hold
  const [active, setActive] = useState(-1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const id = setInterval(() => {
      setActive((a) => (a >= STEPS.length + 1 ? -1 : a + 1));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  const running = !reduced && active >= 0 && active < STEPS.length;

  return (
    <div className="flow" aria-label="Example automation flow">
      <div className="flow-status mono">
        <span className={running ? "flow-dot on" : "flow-dot"} />
        {reduced
          ? "automation"
          : running
            ? "running…"
            : active >= STEPS.length
              ? "done — 0 manual steps"
              : "waiting for trigger"}
      </div>
      {STEPS.map((step, i) => {
        const state = reduced || active > i ? "done" : active === i ? "active" : "idle";
        return (
          <div key={step.label} className="flow-item">
            {i > 0 && <span className={`down ${state !== "idle" ? "lit" : ""}`}>&darr;</span>}
            <span className={`chip ${state}`}>
              {step.label} {step.small && <small>{step.small}</small>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
