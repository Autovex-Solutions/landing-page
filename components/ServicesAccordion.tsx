"use client";

// Mobile-only accordion for the Services section (< 768px — see .mobile-only in
// globals.css). Desktop keeps the flow-diagram cards in sections.tsx untouched;
// this replaces them below md so the three services scan in one screen instead
// of three stacked diagrams.

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { services } from "@/content";

const EASE: [number, number, number, number] = [0.22, 0.61, 0.21, 1];
const SPRING = { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  // Reduced motion: "hidden" and "show" become visually identical (already
  // opacity: 1, no offset) instead of the variant/initial props being
  // nulled out entirely — useReducedMotion() resolves asynchronously after
  // first mount (it can't know the media query during SSR), so an element
  // that started animating toward a real hidden state (opacity: 0) before
  // the hook flips true got stuck there permanently once its props
  // suddenly had nothing telling it to move to "show". This shipped as a
  // real bug: the mobile Services accordion was invisible end-to-end for
  // any visitor with prefers-reduced-motion on.
  const listVariants: Variants = reduceMotion
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
  const itemVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };
  const bulletListVariants: Variants = reduceMotion
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } };
  const bulletVariants: Variants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } } };

  return (
    <motion.div
      className="acc-list"
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {services.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `svc-panel-${i}`;
        const triggerId = `svc-trigger-${i}`;

        return (
          <motion.div
            className={`acc-item${isOpen ? " open" : ""}`}
            key={item.title}
            variants={itemVariants}
          >
            <motion.button
              type="button"
              id={triggerId}
              className="acc-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={item.title}
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

            {/* Always mounted (not AnimatePresence-unmounted) so aria-controls
                on the trigger always points to a real element in the DOM —
                a screen reader tool flagged the previous mount/unmount
                version because aria-controls dangled to a nonexistent id
                whenever a panel was collapsed. Animate height/opacity
                directly instead of on mount; aria-hidden keeps the
                (visually clipped) content out of the AT tree while closed. */}
            <motion.div
              id={panelId}
              className="acc-panel"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : SPRING}
            >
              <motion.ul
                className="acc-bullets"
                variants={bulletListVariants}
                initial="hidden"
                animate={isOpen ? "show" : "hidden"}
              >
                {item.bullets.map((bullet) => (
                  <motion.li key={bullet} variants={bulletVariants}>
                    {bullet}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
