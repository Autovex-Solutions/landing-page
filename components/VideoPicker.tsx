"use client";

import { useEffect, useState } from "react";

// Dev-only hero background chooser: arrows cycle the generative dot-wave and
// candidate clips in public/videos/ so we can pick the final look on localhost.
// Only mounted when NODE_ENV=development — never ships.
const CANDIDATES: { label: string; src: string | null }[] = [
  { label: "dot-wave (generative)", src: null },
  { label: "hero-loop.mp4 (Mixkit)", src: "/hero-loop.mp4" },
  { label: "ink-swirl-bw.mp4", src: "/videos/ink-swirl-bw.mp4" }, // Pexels 3051492
  { label: "ink-drops-black.mp4", src: "/videos/ink-drops-black.mp4" }, // Pexels 3960414
  { label: "printing-press.mp4", src: "/videos/printing-press.mp4" }, // Pexels 37533325
  { label: "cogwheels.mp4", src: "/videos/cogwheels.mp4" }, // Pexels 4824781
  { label: "robot-arm.mp4", src: "/videos/robot-arm.mp4" }, // Pexels 32386590
];

export default function VideoPicker() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const vid = document.querySelector<HTMLVideoElement>(".bgvid");
    if (!vid) return;
    const pick = CANDIDATES[i];
    if (pick.src === null) {
      vid.style.display = "none";
      vid.removeAttribute("src");
    } else {
      vid.style.display = "";
      vid.src = pick.src;
      vid.play().catch(() => {}); // reduced-motion users keep it paused
    }
  }, [i]);

  const step = (d: number) => setI((p) => (p + d + CANDIDATES.length) % CANDIDATES.length);

  return (
    <div className="vidpick mono">
      <button type="button" onClick={() => step(-1)} aria-label="Previous background">
        &larr;
      </button>
      <span>
        {i + 1}/{CANDIDATES.length} &middot; {CANDIDATES[i].label}
      </span>
      <button type="button" onClick={() => step(1)} aria-label="Next background">
        &rarr;
      </button>
    </div>
  );
}
