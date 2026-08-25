"use client";

// One-time intro on page load: "AUTOVEX" then "SOLUTIONS" draw in as
// outlined strokes, fill solid, hold briefly, then fade to reveal the
// site. Same shape as the supplied brief, rebuilt on this site's own
// system: plain CSS classes in globals.css instead of Tailwind utilities
// (this codebase's `@import "tailwindcss"` wraps its output in
// `@layer utilities`, which always loses to this file's unlayered plain
// CSS — see the .desktop-only/.mobile-only comment for the full story)
// and an inline <style> block, and the brand's own ink/sans tokens
// instead of hardcoded white + a generic sans stack.
import { useEffect, useState } from "react";

const HOLD_MS = 3500; // stroke-draw animation + a brief pause
const FADE_MS = 1000;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Respect the setting outright rather than just skip the animation —
    // this is a multi-second delay in front of the entire site, which is
    // exactly the kind of thing prefers-reduced-motion exists to let
    // someone opt out of.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const removeTimer = setTimeout(() => setVisible(false), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash${fading ? " fading" : ""}`} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="splash-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <text x="50%" y="40%" textAnchor="middle" dominantBaseline="middle" className="splash-text splash-text-top">
          AUTOVEX
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="splash-text splash-text-bottom">
          SOLUTIONS
        </text>
      </svg>
    </div>
  );
}
