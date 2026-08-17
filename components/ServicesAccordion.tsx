"use client";

// Mobile-only accordion for the Services section (< 768px — see .mobile-only in
// globals.css). Desktop keeps the flow-diagram cards in sections.tsx untouched;
// this replaces them below md so the three services scan in one screen instead
// of three stacked diagrams.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { services } from "@/content";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.21, 1];

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="acc-list">
      {services.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `svc-panel-${i}`;

        return (
          <div className={`acc-item${isOpen ? " open" : ""}`} key={item.title}>
            <button
              type="button"
              className="acc-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="acc-head">
                <span className="acc-tag mono">{item.tag}</span>
                <span className="acc-title">{item.title}</span>
                <span className="acc-summary">{item.summary}</span>
              </span>
              <motion.span
                className="acc-chevron"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
              >
                <ChevronDown size={18} strokeWidth={2} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="acc-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                >
                  <ul className="acc-bullets">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
