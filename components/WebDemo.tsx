"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Design system ready", small: "ui" },
  { label: "Components assembled", small: "react" },
  { label: "API connected", small: "live" },
  { label: "SEO & performance", small: "100/100" },
  { label: "✓ Production deployed", small: "vercel" },
];

export default function WebDemo() {
  const [active, setActive] = useState(-1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    const id = setInterval(() => {
      setActive((a) => (a >= STEPS.length + 1 ? -1 : a + 1));
    }, 1050);

    return () => clearInterval(id);
  }, []);

  const running = !reduced && active >= 0 && active < STEPS.length;

  return (
    <div className="flow" aria-label="Example web development pipeline">
      <div className="flow-status mono">
        <span className={running ? "flow-dot on" : "flow-dot"} />
        {reduced
          ? "web"
          : running
          ? "building..."
          : active >= STEPS.length
          ? "live ✓"
          : "waiting"}
      </div>

      {STEPS.map((step, i) => {
        const state =
          reduced || active > i
            ? "done"
            : active === i
            ? "active"
            : "idle";

        return (
          <div key={step.label} className="flow-item">
            {i > 0 && (
              <span className={`down ${state !== "idle" ? "lit" : ""}`}>
                &darr;
              </span>
            )}

            <span className={`chip ${state}`}>
              {step.label}
              <small>{step.small}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}