"use client";

import { useEffect, useRef } from "react";

// Dotted sine-wave surface — canvas 2D port of a three.js points-grid effect.
// ponytail: no three.js (~150KB gzip) for a background; swap in the WebGL
// original if we ever want mouse parallax or depth of field.
// variant "hero": full-bleed, lower camera, slow drift, amber horizon glow.
// variant "cta": smaller, brighter band under the closing section.
const PARAMS = {
  hero: { cols: 84, rows: 38, sep: 76, f: 340, camY: 420, horizon: 0.3, speed: 0.028, r: 2.6, alpha: 0.75 },
  cta: { cols: 60, rows: 28, sep: 90, f: 320, camY: 260, horizon: 0.42, speed: 0.05, r: 2.6, alpha: 0.5 },
};

export default function DottedWave({ variant = "cta" }: { variant?: "hero" | "cta" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = PARAMS[variant];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let running = false;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const horizon = h * p.horizon;
      const amberFrom = p.rows * 0.62; // far rows warm up toward the horizon
      for (let iz = p.rows - 1; iz >= 0; iz--) {
        const z = iz * p.sep + 240;
        const s = p.f / (p.f + z);
        ctx.fillStyle = iz > amberFrom ? "#f2a33c" : "#f2f1ee";
        for (let ix = 0; ix < p.cols; ix++) {
          const x = (ix - p.cols / 2) * p.sep;
          const y = Math.sin((ix + t) * 0.3) * 46 + Math.sin((iz + t) * 0.5) * 46;
          const sx = w / 2 + x * s;
          if (sx < -4 || sx > w + 4) continue;
          const sy = horizon + (p.camY - y) * s;
          ctx.globalAlpha = Math.min(p.alpha, 0.9 * s);
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.6, p.r * s), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += p.speed;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize(); // paints one static frame — all reduced-motion users get
    addEventListener("resize", resize);
    // only animate while on screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      removeEventListener("resize", resize);
    };
  }, [variant]);

  return <canvas ref={ref} className="wave" aria-hidden="true" />;
}
