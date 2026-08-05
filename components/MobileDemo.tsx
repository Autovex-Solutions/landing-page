"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Prototype approved", small: "figma" },
  { label: "iOS build generated", small: "ios" },
  { label: "Android build generated", small: "android" },
  { label: "QA passed", small: "tests" },
  { label: "✓ App Store ready", small: "release" },
];

export default function MobileDemo() {
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
    <div className="flow" aria-label="Example mobile development pipeline">
      <div className="flow-status mono">
        <span className={running ? "flow-dot on" : "flow-dot"} />
        {reduced
          ? "mobile"
          : running
          ? "building..."
          : active >= STEPS.length
          ? "published ✓"
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