"use client";

// Mobile-only accordion for the Services section (< 768px — see .mobile-only in
// globals.css). Desktop keeps the flow-diagram cards in sections.tsx untouched;
// this replaces them below md so the three services scan in one screen instead
// of three stacked diagrams.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { services } from "@/content";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.21, 1];
const SPRING = { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const bulletListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const bulletVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="acc-list"
      variants={reduceMotion ? undefined : listVariants}
      initial={reduceMotion ? undefined : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
    >
      {services.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `svc-panel-${i}`;

        return (
          <motion.div
            className={`acc-item${isOpen ? " open" : ""}`}
            key={item.title}
            variants={reduceMotion ? undefined : itemVariants}
          >
            <motion.button
              type="button"
              className="acc-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.12 }}
            >
              <span className="acc-head">
                <span className="acc-tag mono">{item.tag}</span>
                <span className="acc-title">{item.title}</span>
                <span className="acc-summary">{item.summary}</span>
              </span>
              <motion.span
                className="acc-chevron"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
              >
                <ChevronDown size={18} strokeWidth={2} />
              </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="acc-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : SPRING}
                >
                  <motion.ul
                    className="acc-bullets"
                    variants={reduceMotion ? undefined : bulletListVariants}
                    initial={reduceMotion ? undefined : "hidden"}
                    animate={reduceMotion ? undefined : "show"}
                  >
                    {item.bullets.map((bullet) => (
                      <motion.li key={bullet} variants={reduceMotion ? undefined : bulletVariants}>
                        {bullet}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
