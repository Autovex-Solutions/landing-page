"use client";

// One-time intro on page load: the logo mark slides in from the left and
// "Autovex Solutions" slides in from the right, meeting in the center —
// per explicit request, replacing the previous center stroke-draw text
// animation. Plain CSS classes in globals.css (this codebase's
// `@import "tailwindcss"` wraps its output in `@layer utilities`, which
// always loses to this file's unlayered plain CSS) and the brand's own
// mark asset + ink/sans tokens, not hardcoded colors.
import { useEffect, useState } from "react";

const HOLD_MS = 3500; // slide-in animation + a brief pause
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
      <div className="splash-lockup">
        <img
          src="/logo-mark-white.png"
          alt=""
          width="64"
          height="64"
          className="splash-mark"
        />
        <span className="splash-word">Autovex Solutions</span>
      </div>
    </div>
  );
}
