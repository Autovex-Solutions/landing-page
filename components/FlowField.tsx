"use client";

// Animated vector flow field for the footer background — a grid of short
// line segments whose angle is driven by a sine/cosine field so they read
// as a slow-moving current. Same idea as the reference (Motion.dev-style
// "vector flow field"), rebuilt to match this site's own conventions
// instead of its vivid rainbow-gradient + blend-mode treatment: subtle
// ink-colored lines over the footer's existing dark background, same
// DPR-aware canvas sizing, prefers-reduced-motion handling and
// pause-when-offscreen behavior as HeroMachine.tsx.
import { useEffect, useRef } from "react";

const INK = "242, 241, 238";
const SPACING = 28; // px between line centers

export default function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (noMotion) draw(0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING);
      const rows = Math.ceil(h / SPACING);

      ctx.strokeStyle = `rgba(${INK}, 0.16)`;
      ctx.lineWidth = 1.25;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * SPACING + SPACING / 2;
          const y = r * SPACING + SPACING / 2;
          const angle = (Math.sin(c * 0.05 + time) + Math.cos(r * 0.05 + time)) * Math.PI;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-7, 0);
          ctx.lineTo(7, 0);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    const loop = (now: number) => {
      draw(now * 0.0005);
      raf = requestAnimationFrame(loop);
    };

    resize();
    addEventListener("resize", resize);
    if (!noMotion) raf = requestAnimationFrame(loop);

    // pause offscreen — footer sits far below the fold, no reason to spend
    // CPU animating it before it's ever seen
    const io = new IntersectionObserver(([e]) => {
      if (noMotion) return;
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="footer-field" aria-hidden="true" />;
}
