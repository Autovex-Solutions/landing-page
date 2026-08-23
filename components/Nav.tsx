"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getNavLinks } from "@/content";

// Sticky glass nav. Transparent over the hero; after ~10px of scroll it
// condenses into a floating glass bar. Mobile: burger → full-height sheet
// (body scroll locked while open, Escape closes). Desktop links carry a
// hover pill that slides between them (shared layout animation) instead of
// a flat background swap, plus a scroll-progress hairline along the bottom
// edge — a small "control room" status readout, not just chrome.
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const links = useMemo(() => getNavLinks(), []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 10);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? Math.min(scrollY / max, 1) : 0);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`site-nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <nav>
        <a className="brand" href="#" onClick={() => setOpen(false)}>
          {/* ponytail: plain img — logo is a tiny png, next/image adds nothing here */}
          <img src="/logo-mark-white.png" alt="Autovex Solutions logo" width="34" height="34" />
          {/* desktop reads this as one line via flex + gap; mobile stacks it (see
              .brand-word) — the same two spans serve both without a text swap */}
          <span className="brand-word">
            <span>Autovex</span>
            <span>Solutions</span>
          </span>
        </a>
        {/* True center on desktop (see the grid rule on .site-nav nav) — not
            just "next to the logo", which is all flex space-between ever
            guaranteed when the left/right groups aren't the same width. */}
        <div className="nav-links" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link"
              onMouseEnter={() => setHovered(l.href)}
            >
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="nav-hover-pill"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }}
                />
              )}
              <span className="nav-link-label">{l.label}</span>
            </a>
          ))}
        </div>
        {/* CTA + burger as one right-hand action group, distinct from the
            links — was bundled inside .nav-links before, which is why the
            burger ended up as its own third zone instead of pairing with it. */}
        <div className="nav-actions">
          <a className="nav-cta" href="#contact">
            Book a call
          </a>
          <button
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
        <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </nav>
      <div className="nav-sheet" role="dialog" aria-label="Site menu">
        <div className="nav-sheet-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="btn primary" href="#contact" onClick={() => setOpen(false)}>
          Book a call <span className="arrow">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
